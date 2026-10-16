package com.smartresearch.assistant.repository;

import com.smartresearch.assistant.model.FlashcardSet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Mongo Repository interface for AI Flashcard sets.
 */
@Repository
public interface FlashcardSetRepository extends MongoRepository<FlashcardSet, String> {

    List<FlashcardSet> findByUserIdAndDocumentId(String userId, String documentId);

    Optional<FlashcardSet> findByIdAndUserId(String id, String userId);

    void deleteByDocumentId(String documentId);
}
