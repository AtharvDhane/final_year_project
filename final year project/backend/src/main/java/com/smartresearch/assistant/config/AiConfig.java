package com.smartresearch.assistant.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Configuration defining LangChain4j Chat (Groq) and 100% Local Embedding Model (AllMiniLmL6V2).
 */
@Configuration
public class AiConfig {

    private static final Logger logger = LoggerFactory.getLogger(AiConfig.class);

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.model}")
    private String groqModel;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        logger.info("✅ Configuring Chat LLM: Groq ({})", groqModel);
        return OpenAiChatModel.builder()
                .apiKey(groqApiKey)
                .baseUrl("https://api.groq.com/openai/v1")
                .modelName(groqModel)
                .temperature(0.4)
                .build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        // 100% Local In-Memory Embedding Model - 0 HTTP requests, 0 rate limits, 100% free!
        return new AllMiniLmL6V2EmbeddingModel();
    }
}
