package com.smartresearch.assistant.service.doc;

import com.smartresearch.assistant.dto.DocumentChunk;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Text chunker implementation splitting document text into overlapping segments with page attributions.
 */
@Component
public class RecursiveTextChunker {

    private static final int DEFAULT_CHUNK_SIZE = 1500; // Characters per chunk (~300 words)
    private static final int DEFAULT_CHUNK_OVERLAP = 200; // Overlap characters to preserve context

    public List<DocumentChunk> chunkDocument(Map<Integer, String> pageTextMap) {
        List<DocumentChunk> chunks = new ArrayList<>();
        int globalChunkIndex = 0;

        for (Map.Entry<Integer, String> entry : pageTextMap.entrySet()) {
            int pageNumber = entry.getKey();
            String pageText = entry.getValue() != null ? entry.getValue().trim() : "";

            if (pageText.isBlank()) continue;

            if (pageText.length() <= DEFAULT_CHUNK_SIZE) {
                chunks.add(DocumentChunk.builder()
                        .chunkIndex(globalChunkIndex++)
                        .text(pageText)
                        .pageNumber(pageNumber)
                        .build());
            } else {
                int start = 0;
                int textLen = pageText.length();

                while (start < textLen) {
                    int end = Math.min(start + DEFAULT_CHUNK_SIZE, textLen);

                    // Adjust end boundary to last space, but ensure chunk is at least 300 chars long
                    if (end < textLen) {
                        int lastSpace = pageText.lastIndexOf(' ', end);
                        if (lastSpace > start + 300) {
                            end = lastSpace;
                        }
                    }

                    String chunkText = pageText.substring(start, end).trim();
                    if (!chunkText.isEmpty()) {
                        chunks.add(DocumentChunk.builder()
                                .chunkIndex(globalChunkIndex++)
                                .text(chunkText)
                                .pageNumber(pageNumber)
                                .build());
                    }

                    // Next start position with overlap, strictly ensuring forward progress
                    int nextStart = end - DEFAULT_CHUNK_OVERLAP;
                    if (nextStart <= start) {
                        nextStart = end;
                    }
                    start = nextStart;
                }
            }
        }

        return chunks;
    }
}
