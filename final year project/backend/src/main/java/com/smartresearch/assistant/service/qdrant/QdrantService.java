package com.smartresearch.assistant.service.qdrant;

import com.smartresearch.assistant.dto.DocumentChunk;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.store.embedding.filter.Filter;
import dev.langchain4j.store.embedding.filter.comparison.IsEqualTo;
import dev.langchain4j.store.embedding.filter.logical.And;
import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service managing Vector Database indexing and similarity search with Qdrant and automatic In-Memory fallback.
 */
@Service
public class QdrantService {

    private static final Logger logger = LoggerFactory.getLogger(QdrantService.class);

    @Value("${qdrant.host:localhost}")
    private String host;

    @Value("${qdrant.port:6334}")
    private int port;

    @Value("${qdrant.collection-name:document_embeddings}")
    private String collectionName;

    @Value("${qdrant.api-key:}")
    private String apiKey;

    private EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingStore<TextSegment> fallbackStore = new InMemoryEmbeddingStore<>();
    private volatile boolean usingFallback = false;

    @PostConstruct
    public void init() {
        try {
            var builder = QdrantEmbeddingStore.builder()
                    .host(host)
                    .port(port)
                    .collectionName(collectionName);

            if (apiKey != null && !apiKey.isBlank()) {
                builder.apiKey(apiKey);
            }

            this.embeddingStore = builder.build();
            logger.info("✅ Connected to Qdrant vector database at {}:{}", host, port);
        } catch (Exception ex) {
            logger.warn("⚠️ Qdrant unavailable, using in-memory fallback: {}", ex.getMessage());
            this.embeddingStore = fallbackStore;
            this.usingFallback = true;
        }
    }

    public synchronized void storeChunks(List<DocumentChunk> chunks, float[][] vectors, String userId, String documentId) {
        List<Embedding> embeddings = new ArrayList<>();
        List<TextSegment> textSegments = new ArrayList<>();

        for (int i = 0; i < chunks.size(); i++) {
            DocumentChunk chunk = chunks.get(i);
            float[] vector = vectors[i];

            Metadata metadata = new Metadata();
            metadata.put("userId", userId);
            metadata.put("documentId", documentId);
            metadata.put("chunkIndex", String.valueOf(chunk.getChunkIndex()));
            metadata.put("pageNumber", String.valueOf(chunk.getPageNumber()));

            TextSegment textSegment = TextSegment.from(chunk.getText(), metadata);
            Embedding embedding = Embedding.from(vector);

            embeddings.add(embedding);
            textSegments.add(textSegment);
        }

        // Try primary Qdrant store first
        if (!usingFallback) {
            try {
                embeddingStore.addAll(embeddings, textSegments);
                return; // Success — no need for fallback
            } catch (Exception ex) {
                logger.warn("Qdrant store failed, switching to in-memory fallback: {}", ex.getMessage());
                this.embeddingStore = fallbackStore;
                this.usingFallback = true;
            }
        }

        // Store in fallback in-memory store
        fallbackStore.addAll(embeddings, textSegments);
    }

    public synchronized List<EmbeddingMatch<TextSegment>> searchSimilarChunks(float[] queryVector, String userId, String documentId, int topK) {
        // First try primary embedding store if configured
        if (!usingFallback) {
            try {
                Filter filter = new And(
                        new IsEqualTo("userId", userId),
                        new IsEqualTo("documentId", documentId)
                );

                EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()
                        .queryEmbedding(Embedding.from(queryVector))
                        .filter(filter)
                        .maxResults(topK)
                        .minScore(0.0)
                        .build();

                EmbeddingSearchResult<TextSegment> result = embeddingStore.search(request);
                if (result != null && result.matches() != null && !result.matches().isEmpty()) {
                    return result.matches();
                }
            } catch (Exception ex) {
                logger.warn("Qdrant search failed, falling back to in-memory: {}", ex.getMessage());
                this.embeddingStore = fallbackStore;
                this.usingFallback = true;
            }
        }

        // Search Fallback Store (InMemoryEmbeddingStore) with userId + documentId filtering
        try {
            EmbeddingSearchRequest fallbackRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(Embedding.from(queryVector))
                    .maxResults(topK * 20)
                    .minScore(0.0)
                    .build();

            EmbeddingSearchResult<TextSegment> fallbackResult = fallbackStore.search(fallbackRequest);
            if (fallbackResult != null && fallbackResult.matches() != null) {
                return fallbackResult.matches().stream()
                        .filter(m -> {
                            if (m.embedded() == null || m.embedded().metadata() == null) return false;
                            String docId = m.embedded().metadata().get("documentId");
                            String uid = m.embedded().metadata().get("userId");
                            return documentId.equals(docId) && userId.equals(uid);
                        })
                        .limit(topK)
                        .collect(java.util.stream.Collectors.toList());
            }
        } catch (Exception ex) {
            logger.error("Fallback in-memory search failed: {}", ex.getMessage());
        }

        return List.of();
    }
}
