package com.smartresearch.assistant.controller;

import com.smartresearch.assistant.dto.TeacherRequest;
import com.smartresearch.assistant.security.UserPrincipal;
import com.smartresearch.assistant.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/generate-question-paper")
    public ResponseEntity<Map<String, String>> generateQuestionPaper(
            @RequestBody TeacherRequest.QuestionPaper request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = teacherService.generateQuestionPaper(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/generate-assignment")
    public ResponseEntity<Map<String, String>> generateAssignment(
            @RequestBody TeacherRequest.Assignment request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = teacherService.generateAssignment(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/generate-lesson-plan")
    public ResponseEntity<Map<String, String>> generateLessonPlan(
            @RequestBody TeacherRequest.LessonPlan request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = teacherService.generateLessonPlan(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/analyze-performance")
    public ResponseEntity<?> analyzePerformance(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            Map<String, Object> result = teacherService.analyzePerformance(file, userPrincipal.getId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/evaluate-answer")
    public ResponseEntity<Map<String, String>> evaluateAnswer(
            @RequestBody TeacherRequest.Evaluation request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = teacherService.evaluateAnswer(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/generate-teaching-material")
    public ResponseEntity<Map<String, String>> generateTeachingMaterial(
            @RequestBody TeacherRequest.TeachingMaterial request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String result = teacherService.generateTeachingMaterial(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("result", result));
    }
}
