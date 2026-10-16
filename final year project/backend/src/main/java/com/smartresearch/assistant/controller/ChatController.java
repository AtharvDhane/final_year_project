package com.smartresearch.assistant.controller;

import com.smartresearch.assistant.dto.ApiResponse;
import com.smartresearch.assistant.dto.ChatRequest;
import com.smartresearch.assistant.dto.ChatResponse;
import com.smartresearch.assistant.model.ChatSession;
import com.smartresearch.assistant.model.Document;
import com.smartresearch.assistant.repository.ChatSessionRepository;
import com.smartresearch.assistant.security.UserPrincipal;
import com.smartresearch.assistant.service.ai.RagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller exposing RAG Chat capabilities, session management, and document indexing.
 */
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final RagService ragService;
    private final ChatSessionRepository chatSessionRepository;

    public ChatController(RagService ragService, ChatSessionRepository chatSessionRepository) {
        this.ragService = ragService;
        this.chatSessionRepository = chatSessionRepository;
    }

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<ChatResponse>> askQuestion(
            @Valid @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ChatResponse response = ragService.askQuestion(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Question answered successfully", response));
    }

    @PostMapping("/index/{documentId}")
    public ResponseEntity<ApiResponse<Document>> indexDocument(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Document doc = ragService.indexDocument(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Document indexed successfully", doc));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<ChatSession>>> getUserChatSessions(
            @RequestParam(value = "documentId", required = false) String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ChatSession> sessions;
        if (documentId != null && !documentId.isBlank()) {
            sessions = chatSessionRepository.findByUserIdAndDocumentIdOrderByUpdatedAtDesc(userPrincipal.getId(), documentId);
        } else {
            sessions = chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(userPrincipal.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Chat sessions fetched successfully", sessions));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<ChatSession>> getChatSessionById(
            @PathVariable("sessionId") String sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(sessionId, userPrincipal.getId())
                .orElseThrow(() -> new com.smartresearch.assistant.exception.ResourceNotFoundException("Chat session not found"));
        return ResponseEntity.ok(ApiResponse.success("Chat session details fetched", session));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> deleteChatSession(
            @PathVariable("sessionId") String sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(sessionId, userPrincipal.getId())
                .orElseThrow(() -> new com.smartresearch.assistant.exception.ResourceNotFoundException("Chat session not found"));
        chatSessionRepository.delete(session);
        return ResponseEntity.ok(ApiResponse.success("Chat session deleted successfully"));
    }
}
