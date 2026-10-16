package com.smartresearch.assistant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

/**
 * MongoDB Document Entity storing metadata for uploaded files (PDF, DOCX, PPTX, TXT).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@org.springframework.data.mongodb.core.mapping.Document(collection = "documents")
public class Document {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String fileName;

    private String fileType; // PDF, DOCX, PPTX, TXT

    private long fileSize; // Size in bytes

    private String filePath; // Disk storage path

    @Builder.Default
    private ProcessingStatus status = ProcessingStatus.PROCESSING;

    private int chunkCount;

    @CreatedDate
    private Instant uploadedAt;

    public enum ProcessingStatus {
        PROCESSING,
        INDEXED,
        FAILED
    }
}
