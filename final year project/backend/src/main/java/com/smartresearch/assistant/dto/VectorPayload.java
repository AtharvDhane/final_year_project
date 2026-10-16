package com.smartresearch.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing the payload metadata attached to each vector embedding in Qdrant.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VectorPayload {

    private String userId;

    private String documentId;

    private int chunkIndex;

    private int pageNumber;

    private String textSnippet;
}
