package com.smartresearch.assistant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_generations")
public class AiGeneration {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String toolName;

    private String inputSummary;

    private String outputResult;

    @CreatedDate
    @Builder.Default
    private Instant createdAt = Instant.now();
}
