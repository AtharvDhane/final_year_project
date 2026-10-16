package com.smartresearch.assistant.repository;

import com.smartresearch.assistant.model.AiGeneration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiGenerationRepository extends MongoRepository<AiGeneration, String> {
    List<AiGeneration> findByUserIdOrderByCreatedAtDesc(String userId);
}
