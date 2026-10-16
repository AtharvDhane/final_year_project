package com.smartresearch.assistant.repository;

import com.smartresearch.assistant.model.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Mongo Repository interface for Document metadata.
 */
@Repository
public interface DocumentRepository extends MongoRepository<Document, String> {

    List<Document> findByUserIdOrderByUploadedAtDesc(String userId);

    Optional<Document> findByIdAndUserId(String id, String userId);

    long countByUserId(String userId);
}
