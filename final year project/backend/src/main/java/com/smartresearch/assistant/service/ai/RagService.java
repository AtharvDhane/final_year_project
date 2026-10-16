package com.smartresearch.assistant.service.ai;

import com.smartresearch.assistant.dto.ChatRequest;
import com.smartresearch.assistant.dto.ChatResponse;
import com.smartresearch.assistant.dto.DocumentChunk;
import com.smartresearch.assistant.model.ChatSession;
import com.smartresearch.assistant.model.ChatSession.ChatMessage;
import com.smartresearch.assistant.model.ChatSession.Citation;
import com.smartresearch.assistant.model.Document;
import com.smartresearch.assistant.model.Document.ProcessingStatus;
import com.smartresearch.assistant.repository.ChatSessionRepository;
import com.smartresearch.assistant.repository.DocumentRepository;
import com.smartresearch.assistant.service.DocumentService;
import com.smartresearch.assistant.service.doc.DocumentProcessorService;
import com.smartresearch.assistant.service.qdrant.QdrantService;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Enterprise RAG Engine Service orchestrating document indexing, semantic search, Gemini LLM generation, and citations.
 */
@Service
public class RagService {

    private static final Logger logger = LoggerFactory.getLogger(RagService.class);

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final DocumentProcessorService documentProcessor;
    private final AiService aiService;
    private final QdrantService qdrantService;

    public RagService(DocumentService documentService,
                      DocumentRepository documentRepository,
                      ChatSessionRepository chatSessionRepository,
                      DocumentProcessorService documentProcessor,
                      AiService aiService,
                      QdrantService qdrantService) {
        this.documentService = documentService;
        this.documentRepository = documentRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.documentProcessor = documentProcessor;
        this.aiService = aiService;
        this.qdrantService = qdrantService;
    }

    public Document indexDocument(String documentId, String userId) {
        Document doc = documentService.findDocumentByIdAndUser(documentId, userId);

        try {
            File file = new File(doc.getFilePath());
            if (!file.exists()) {
                file = new File("uploads", file.getName());
            }
            if (!file.exists()) {
                file = new File("backend/uploads", file.getName());
            }
            if (!file.exists()) {
                file = new File(file.getName());
            }

            List<DocumentChunk> chunks = documentProcessor.processAndChunkDocument(file, doc.getFileType());
            logger.info("📄 Document '{}' extracted {} chunks from file: {}", doc.getFileName(), chunks.size(), file.getAbsolutePath());

            // Generate embeddings for all text chunks
            List<String> chunkTexts = chunks.stream().map(DocumentChunk::getText).collect(Collectors.toList());
            List<float[]> embeddings = aiService.generateEmbeddings(chunkTexts);

            float[][] vectorArray = new float[embeddings.size()][];
            for (int i = 0; i < embeddings.size(); i++) {
                vectorArray[i] = embeddings.get(i);
            }

            // Store in Qdrant Vector Database
            qdrantService.storeChunks(chunks, vectorArray, userId, documentId);
            logger.info("✅ Document '{}' indexed successfully: {} chunks, {} vectors stored", doc.getFileName(), chunks.size(), vectorArray.length);

            doc.setStatus(ProcessingStatus.INDEXED);
            doc.setChunkCount(chunks.size());
            return documentRepository.save(doc);
        } catch (Exception ex) {
            doc.setStatus(ProcessingStatus.FAILED);
            documentRepository.save(doc);
            throw ex;
        }
    }

    public ChatResponse askQuestion(ChatRequest request, String userId) {
        Document doc = documentService.findDocumentByIdAndUser(request.getDocumentId(), userId);

        // Auto-index document if processing is pending
        if (doc.getStatus() == ProcessingStatus.PROCESSING) {
            indexDocument(doc.getId(), userId);
        }

        // 1. Generate query vector embedding
        float[] queryVector = aiService.generateEmbedding(request.getMessage());

        // 2. Perform similarity search in Qdrant
        List<EmbeddingMatch<TextSegment>> matches = qdrantService.searchSimilarChunks(
                queryVector, userId, request.getDocumentId(), 10
        );
        logger.info("🔍 Vector search returned {} matches for query: '{}'", matches.size(), request.getMessage().substring(0, Math.min(50, request.getMessage().length())));

        // Auto re-index document if vector store has no matches (e.g. model change or fresh start)
        if (matches.isEmpty()) {
            try {
                indexDocument(request.getDocumentId(), userId);
                queryVector = aiService.generateEmbedding(request.getMessage());
                matches = qdrantService.searchSimilarChunks(queryVector, userId, request.getDocumentId(), 10);
            } catch (Exception ignored) {
            }
        }

        // 3. Construct context string and citation details
        StringBuilder contextBuilder = new StringBuilder();
        List<Citation> citations = new ArrayList<>();

        for (EmbeddingMatch<TextSegment> match : matches) {
            TextSegment segment = match.embedded();
            String pageStr = segment.metadata().get("pageNumber");
            int pageNum = 1;
            try {
                if (pageStr != null) pageNum = Integer.parseInt(pageStr);
            } catch (NumberFormatException ignored) {
                // Default to page 1 if metadata is non-numeric
            }

            contextBuilder.append(String.format("[Page %d]: %s\n\n", pageNum, segment.text()));

            citations.add(Citation.builder()
                    .pageNumber(pageNum)
                    .textSnippet(segment.text())
                    .similarityScore(match.score())
                    .build());
        }

        String contextText = contextBuilder.toString();
        logger.info("📝 RAG context length: {} chars, {} citations assembled", contextText.length(), citations.size());
        if (contextText.isBlank()) {
            contextText = "No relevant document chunks found for this query.";
            logger.warn("⚠️ No context found for query: '{}'", request.getMessage());
        }

        // 4. Prompt Gemini LLM with RAG System Prompt
        String systemPrompt = String.format(PromptTemplates.RAG_SYSTEM_PROMPT, contextText);
        String aiAnswer = aiService.generateAnswer(systemPrompt, request.getMessage());

        // 5. Manage Chat Session persistence
        ChatSession chatSession;
        if (request.getSessionId() != null && !request.getSessionId().isBlank()) {
            chatSession = chatSessionRepository.findByIdAndUserId(request.getSessionId(), userId)
                    .orElseGet(() -> createNewChatSession(userId, doc.getId(), request.getMessage()));
        } else {
            chatSession = createNewChatSession(userId, doc.getId(), request.getMessage());
        }

        ChatMessage userMsg = ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .sender(ChatMessage.MessageSender.USER)
                .content(request.getMessage())
                .timestamp(Instant.now())
                .build();

        ChatMessage aiMsg = ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .sender(ChatMessage.MessageSender.AI)
                .content(aiAnswer)
                .citations(citations)
                .timestamp(Instant.now())
                .build();

        chatSession.getMessages().add(userMsg);
        chatSession.getMessages().add(aiMsg);
        chatSessionRepository.save(chatSession);

        // 6. Generate AI-powered suggested follow-up questions
        List<String> suggestedQuestions;
        try {
            String suggestPrompt = String.format(PromptTemplates.SUGGESTED_QUESTIONS_PROMPT, contextText);
            String suggestJson = aiService.generateCompletion(suggestPrompt);
            // Try to parse JSON array of strings
            int firstBracket = suggestJson.indexOf('[');
            int lastBracket = suggestJson.lastIndexOf(']');
            if (firstBracket != -1 && lastBracket > firstBracket) {
                String cleanJson = suggestJson.substring(firstBracket, lastBracket + 1);
                suggestedQuestions = new com.fasterxml.jackson.databind.ObjectMapper()
                        .readValue(cleanJson, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
            } else {
                suggestedQuestions = getDefaultSuggestions();
            }
        } catch (Exception ex) {
            logger.warn("Failed to generate AI follow-up questions: {}", ex.getMessage());
            suggestedQuestions = getDefaultSuggestions();
        }

        return ChatResponse.builder()
                .sessionId(chatSession.getId())
                .userMessage(request.getMessage())
                .aiAnswer(aiAnswer)
                .citations(citations)
                .suggestedQuestions(suggestedQuestions)
                .build();
    }

    private ChatSession createNewChatSession(String userId, String documentId, String initialQuery) {
        String title = initialQuery.length() > 30 ? initialQuery.substring(0, 30) + "..." : initialQuery;
        ChatSession session = ChatSession.builder()
                .userId(userId)
                .documentId(documentId)
                .title(title)
                .messages(new ArrayList<>())
                .build();
        return chatSessionRepository.save(session);
    }

    private List<String> getDefaultSuggestions() {
        return List.of(
                "Can you summarize the main findings of this document?",
                "What are the key definitions mentioned on this topic?",
                "What are the practical applications described here?"
        );
    }
}
