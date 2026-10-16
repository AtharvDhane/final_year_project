package com.smartresearch.assistant.repository;

import com.smartresearch.assistant.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Mongo Repository interface for AI Quizzes.
 */
@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {

    List<Quiz> findByUserIdAndDocumentId(String userId, String documentId);

    Optional<Quiz> findByIdAndUserId(String id, String userId);

    void deleteByDocumentId(String documentId);
}
