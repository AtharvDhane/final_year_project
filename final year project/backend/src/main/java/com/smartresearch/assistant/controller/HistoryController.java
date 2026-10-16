package com.smartresearch.assistant.controller;

import com.smartresearch.assistant.model.AiGeneration;
import com.smartresearch.assistant.repository.AiGenerationRepository;
import com.smartresearch.assistant.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {

    private final AiGenerationRepository aiGenerationRepository;

    public HistoryController(AiGenerationRepository aiGenerationRepository) {
        this.aiGenerationRepository = aiGenerationRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'RESEARCHER')")
    public ResponseEntity<List<AiGeneration>> getHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AiGeneration> history = aiGenerationRepository.findByUserIdOrderByCreatedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(history);
    }
}
