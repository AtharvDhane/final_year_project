package com.smartresearch.assistant.controller;

import com.smartresearch.assistant.dto.ApiResponse;
import com.smartresearch.assistant.model.FlashcardSet;
import com.smartresearch.assistant.model.Note;
import com.smartresearch.assistant.model.Quiz;
import com.smartresearch.assistant.security.UserPrincipal;
import com.smartresearch.assistant.service.ai.AiToolsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for AI Study Tools suite.
 */
@RestController
@RequestMapping("/ai-tools")
public class AiToolsController {

    private final AiToolsService aiToolsService;

    public AiToolsController(AiToolsService aiToolsService) {
        this.aiToolsService = aiToolsService;
    }

    @PostMapping("/summary/{documentId}")
    public ResponseEntity<ApiResponse<String>> generateSummary(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String summary = aiToolsService.generateSummary(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Summary generated successfully", summary));
    }

    @PostMapping("/notes/{documentId}")
    public ResponseEntity<ApiResponse<Note>> generateNotes(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Note note = aiToolsService.generateNotes(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Study notes generated successfully", note));
    }

    @PostMapping("/quiz/{documentId}")
    public ResponseEntity<ApiResponse<Quiz>> generateQuiz(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Quiz quiz = aiToolsService.generateQuiz(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Quiz generated successfully", quiz));
    }

    @PostMapping("/flashcards/{documentId}")
    public ResponseEntity<ApiResponse<FlashcardSet>> generateFlashcards(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FlashcardSet flashcards = aiToolsService.generateFlashcards(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Flashcards generated successfully", flashcards));
    }

    @PostMapping("/mindmap/{documentId}")
    public ResponseEntity<ApiResponse<String>> generateMindMap(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String mindmap = aiToolsService.generateMindMap(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Mind map generated successfully", mindmap));
    }

    @PostMapping("/eli5/{documentId}")
    public ResponseEntity<ApiResponse<String>> explainLikeImFive(
            @PathVariable("documentId") String documentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String eli5 = aiToolsService.explainLikeImFive(documentId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("ELI5 explanation generated", eli5));
    }

    @PostMapping("/translate/{documentId}")
    public ResponseEntity<ApiResponse<String>> translateDocument(
            @PathVariable("documentId") String documentId,
            @RequestParam(value = "language", defaultValue = "Spanish") String language,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String translation = aiToolsService.translateDocument(documentId, userPrincipal.getId(), language);
        return ResponseEntity.ok(ApiResponse.success("Translation generated successfully", translation));
    }
}
