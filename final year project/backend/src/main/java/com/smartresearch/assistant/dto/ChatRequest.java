package com.smartresearch.assistant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for asking a question in a document RAG chat session.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @NotBlank(message = "Document ID is required")
    private String documentId;

    private String sessionId; // Optional: null or blank to start a new chat session

    @NotBlank(message = "Question message cannot be empty")
    private String message;
}
