package com.smartresearch.assistant.dto;

import lombok.Data;

public class TeacherRequest {
    
    @Data
    public static class QuestionPaper {
        private String documentId;
        private String subject;
        private String difficulty;
        private String questionTypes;
        private int numberOfQuestions;
    }

    @Data
    public static class Assignment {
        private String documentId;
        private String topic;
    }

    @Data
    public static class LessonPlan {
        private String subject;
        private String topic;
        private String targetClass;
        private String duration;
    }

    @Data
    public static class Evaluation {
        private String documentId;
        private String studentAnswer;
    }

    @Data
    public static class TeachingMaterial {
        private String documentId;
    }
}
