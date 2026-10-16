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
import java.util.List;

/**
 * MongoDB Entity storing AI-generated digital Flashcards for memorization.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "flashcard_sets")
public class FlashcardSet {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String documentId;

    private String title;

    private List<Flashcard> cards;

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Flashcard {
        private String front;
        private String back;
    }
}
