package com.smartresearch.assistant.dto;

import com.smartresearch.assistant.model.Document.ProcessingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO representing document metadata returned to the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {

    private String id;

    private String fileName;

    private String fileType;

    private long fileSize;

    private ProcessingStatus status;

    private int chunkCount;

    private Instant uploadedAt;
}
