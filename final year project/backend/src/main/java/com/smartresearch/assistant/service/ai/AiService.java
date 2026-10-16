package com.smartresearch.assistant.service.ai;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service interfacing with LangChain4j Chat and Embedding models with automatic rate-limit retries.
 */
@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final ChatLanguageModel chatLanguageModel;
    private final EmbeddingModel embeddingModel;

    public AiService(ChatLanguageModel chatLanguageModel, EmbeddingModel embeddingModel) {
        this.chatLanguageModel = chatLanguageModel;
        this.embeddingModel = embeddingModel;
    }

    public String generateAnswer(String systemPrompt, String userQuery) {
        return executeWithRetry(() -> {
            SystemMessage sysMsg = SystemMessage.from(systemPrompt);
            UserMessage userMsg = UserMessage.from(userQuery);
            Response<dev.langchain4j.data.message.AiMessage> response = chatLanguageModel.generate(sysMsg, userMsg);
            return response.content().text();
        });
    }

    public String generateCompletion(String fullPrompt) {
        return executeWithRetry(() -> chatLanguageModel.generate(fullPrompt));
    }

    public float[] generateEmbedding(String text) {
        return executeWithRetry(() -> {
            Response<Embedding> response = embeddingModel.embed(text);
            return response.content().vector();
        });
    }

    public List<float[]> generateEmbeddings(List<String> texts) {
        if (texts == null || texts.isEmpty()) return List.of();

        try {
            List<TextSegment> segments = texts.stream().map(TextSegment::from).collect(Collectors.toList());
            Response<List<Embedding>> response = embeddingModel.embedAll(segments);
            return response.content().stream().map(Embedding::vector).collect(Collectors.toList());
        } catch (Exception ex) {
            logger.warn("Batch embedding failed, falling back to sequential retry embedding: {}", ex.getMessage());
            List<float[]> result = new ArrayList<>();
            for (String text : texts) {
                result.add(generateEmbedding(text));
            }
            return result;
        }
    }

    private <T> T executeWithRetry(SupplierWithException<T> action) {
        int maxRetries = 3;
        long waitTimeMs = 2500;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return action.get();
            } catch (Exception ex) {
                String errorMsg = ex.getMessage() != null ? ex.getMessage() : "";
                boolean isRateLimit = errorMsg.contains("429") || 
                                      errorMsg.contains("RESOURCE_EXHAUSTED") || 
                                      errorMsg.contains("quota") || 
                                      errorMsg.contains("Quota exceeded");

                if (isRateLimit && attempt < maxRetries) {
                    logger.warn("Groq API rate limit hit (Attempt {}/{}). Waiting {}ms before retrying...", attempt, maxRetries, waitTimeMs * attempt);
                    try {
                        Thread.sleep(waitTimeMs * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                } else {
                    if (isRateLimit) {
                        throw new RuntimeException("Groq API rate limit reached. Please wait a minute before sending your next question.", ex);
                    }
                    throw new RuntimeException(errorMsg, ex);
                }
            }
        }
        throw new RuntimeException("Failed after retries due to rate limit.");
    }

    @FunctionalInterface
    private interface SupplierWithException<T> {
        T get() throws Exception;
    }
}
