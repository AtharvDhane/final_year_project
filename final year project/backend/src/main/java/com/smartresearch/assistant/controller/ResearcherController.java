package com.smartresearch.assistant.controller;

import com.smartresearch.assistant.dto.ResearcherRequest;
import com.smartresearch.assistant.security.UserPrincipal;
import com.smartresearch.assistant.service.ResearcherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/researcher")
@PreAuthorize("hasRole('RESEARCHER')")
public class ResearcherController {

    private final ResearcherService researcherService;

    public ResearcherController(ResearcherService researcherService) {
        this.researcherService = researcherService;
    }

    @PostMapping("/analyze-paper")
    public ResponseEntity<Map<String, String>> analyzePaper(
            @RequestBody ResearcherRequest.SingleDocument request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = researcherService.analyzePaper(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/literature-review")
    public ResponseEntity<Map<String, String>> literatureReview(
            @RequestBody ResearcherRequest.MultiDocument request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = researcherService.literatureReview(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/find-research-gaps")
    public ResponseEntity<Map<String, String>> findResearchGaps(
            @RequestBody ResearcherRequest.MultiDocument request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = researcherService.findResearchGaps(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/compare-papers")
    public ResponseEntity<Map<String, String>> comparePapers(
            @RequestBody ResearcherRequest.MultiDocument request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = researcherService.comparePapers(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/generate-citations")
    public ResponseEntity<Map<String, String>> generateCitations(
            @RequestBody ResearcherRequest.SingleDocument request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = researcherService.generateCitations(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/analyze-data")
    public ResponseEntity<?> analyzeData(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            Map<String, Object> result = researcherService.analyzeData(file, userPrincipal.getId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
