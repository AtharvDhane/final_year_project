package com.smartresearch.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a discrete text chunk extracted from a document with page attribution.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChunk {

    private int chunkIndex;

    private String text;

    private int pageNumber; // 1-based page index or slide index
}
