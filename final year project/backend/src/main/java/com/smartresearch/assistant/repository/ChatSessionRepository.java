package com.smartresearch.assistant.repository;

import com.smartresearch.assistant.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Mongo Repository interface for RAG Chat Sessions.
 */
@Repository
public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {

    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(String userId);

    List<ChatSession> findByUserIdAndDocumentIdOrderByUpdatedAtDesc(String userId, String documentId);

    Optional<ChatSession> findByIdAndUserId(String id, String userId);

    long countByUserId(String userId);

    void deleteByDocumentId(String documentId);
}
