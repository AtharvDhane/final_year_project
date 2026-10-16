package com.smartresearch.assistant.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresearch.assistant.dto.TeacherRequest;
import com.smartresearch.assistant.service.ai.AiService;
import com.smartresearch.assistant.service.qdrant.QdrantService;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import com.smartresearch.assistant.model.AiGeneration;
import com.smartresearch.assistant.repository.AiGenerationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    private final AiService aiService;
    private final QdrantService qdrantService;
    private final DataAnalysisService dataAnalysisService;
    private final AiGenerationRepository aiGenerationRepository;
    private final ObjectMapper objectMapper;

    public TeacherService(AiService aiService, QdrantService qdrantService, DataAnalysisService dataAnalysisService, AiGenerationRepository aiGenerationRepository) {
        this.aiService = aiService;
        this.qdrantService = qdrantService;
        this.dataAnalysisService = dataAnalysisService;
        this.aiGenerationRepository = aiGenerationRepository;
        this.objectMapper = new ObjectMapper();
    }

    private String getDocumentContext(String documentId, String userId, String query) {
        if (documentId == null || documentId.isBlank()) return "";
        try {
            float[] queryVector = aiService.generateEmbedding(query);
            List<EmbeddingMatch<TextSegment>> matches = qdrantService.searchSimilarChunks(queryVector, userId, documentId, 15);
            return matches.stream().map(m -> m.embedded().text()).collect(Collectors.joining("\n\n"));
        } catch (Exception e) {
            return "Could not retrieve context.";
        }
    }

    public String generateQuestionPaper(TeacherRequest.QuestionPaper request, String userId) {
        String context = getDocumentContext(request.getDocumentId(), userId, request.getSubject() + " " + request.getQuestionTypes());
        String prompt = String.format(
            "You are an expert Teacher. Generate a question paper for the subject '%s'.\n" +
            "Difficulty level: %s.\n" +
            "Include these types of questions: %s.\n" +
            "Total number of questions: %d.\n" +
            "Base the questions STRICTLY on the following syllabus/context if provided:\n" +
            "Context: %s",
            request.getSubject(), request.getDifficulty(), request.getQuestionTypes(), request.getNumberOfQuestions(), context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Question Paper Generator")
                .inputSummary("Subject: " + request.getSubject() + " | Difficulty: " + request.getDifficulty())
                .outputResult(result)
                .build());
        return result;
    }

    public String generateAssignment(TeacherRequest.Assignment request, String userId) {
        String context = getDocumentContext(request.getDocumentId(), userId, request.getTopic());
        String prompt = String.format(
            "You are an expert Teacher. Generate a detailed student assignment based on the topic '%s'.\n" +
            "Include Assignment Title, Instructions, a set of Questions, and Marks distribution.\n" +
            "Base it strictly on this context if provided:\n%s",
            request.getTopic(), context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Assignment Generator")
                .inputSummary("Topic: " + request.getTopic())
                .outputResult(result)
                .build());
        return result;
    }

    public String generateLessonPlan(TeacherRequest.LessonPlan request, String userId) {
        String prompt = String.format(
            "Generate a highly detailed Lesson Plan for:\n" +
            "Subject: %s\n" +
            "Topic: %s\n" +
            "Target Class/Grade: %s\n" +
            "Duration: %s\n" +
            "Structure it with: Learning Objectives, Topics/Concepts, Teaching Flow, Examples, Classroom Questions, Assessment, and Homework.",
            request.getSubject(), request.getTopic(), request.getTargetClass(), request.getDuration()
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Lesson Plan Generator")
                .inputSummary("Subject: " + request.getSubject() + " | Topic: " + request.getTopic())
                .outputResult(result)
                .build());
        return result;
    }

    public Map<String, Object> analyzePerformance(MultipartFile file, String userId) throws Exception {
        Map<String, Object> dataStats = dataAnalysisService.analyzeData(file);
        
        String statsJson = objectMapper.writeValueAsString(dataStats);
        String prompt = "You are an educational data analyst. I am providing you basic statistics extracted from a student marks dataset in JSON format.\n" +
                "Based ONLY on this data, provide a short summary of the Strong Areas and Weak Areas of the class.\n" +
                "Data: " + statsJson;
        
        String aiAnalysis = aiService.generateCompletion(prompt);
        dataStats.put("aiInsights", aiAnalysis);
        
        // Convert to markdown for saving history
        StringBuilder markdownStr = new StringBuilder();
        markdownStr.append("### Performance Analysis Overview\n\n");
        markdownStr.append("- **Total Rows**: ").append(dataStats.get("totalRows")).append("\n");
        markdownStr.append("- **Total Columns**: ").append(dataStats.get("totalColumns")).append("\n\n");
        markdownStr.append("#### AI Insights (Strong & Weak Areas)\n\n").append(aiAnalysis).append("\n\n");
        
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Student Performance Analyzer")
                .inputSummary("Analyzed dataset file: " + file.getOriginalFilename())
                .outputResult(markdownStr.toString())
                .build());
        
        return dataStats;
    }

    public String evaluateAnswer(TeacherRequest.Evaluation request, String userId) {
        String context = getDocumentContext(request.getDocumentId(), userId, request.getStudentAnswer());
        String prompt = String.format(
            "You are a Teacher evaluating a student's answer. \n" +
            "Student's Answer:\n%s\n\n" +
            "Reference Material/Context:\n%s\n\n" +
            "Task: Evaluate the answer. Suggest marks out of 10. Explain any mistakes. Identify missing concepts. Generate constructive feedback.",
            request.getStudentAnswer(), context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Automatic Evaluation")
                .inputSummary("Evaluated an answer snippet.")
                .outputResult(result)
                .build());
        return result;
    }

    public String generateTeachingMaterial(TeacherRequest.TeachingMaterial request, String userId) {
        String context = getDocumentContext(request.getDocumentId(), userId, "key concepts summary lecture notes");
        String prompt = String.format(
            "You are a Teacher. Based on the provided study material, generate comprehensive Teaching Material including:\n" +
            "1. Lecture Notes\n" +
            "2. Key Points\n" +
            "3. Examples\n" +
            "4. Classroom Questions\n" +
            "5. Revision Material\n\n" +
            "Context Material:\n%s",
            context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Teaching Material Generator")
                .inputSummary("Generated material from document.")
                .outputResult(result)
                .build());
        return result;
    }
}
