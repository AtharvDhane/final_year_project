package com.smartresearch.assistant.dto;

import com.smartresearch.assistant.model.ChatSession.Citation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for RAG chat answer response with citations and suggested questions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private String sessionId;

    private String userMessage;

    private String aiAnswer;

    private List<Citation> citations;

    private List<String> suggestedQuestions;
}
