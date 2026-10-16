package com.smartresearch.assistant.dto;

import lombok.Data;
import java.util.List;

public class ResearcherRequest {
    
    @Data
    public static class SingleDocument {
        private String documentId;
    }

    @Data
    public static class MultiDocument {
        private List<String> documentIds;
    }
}
