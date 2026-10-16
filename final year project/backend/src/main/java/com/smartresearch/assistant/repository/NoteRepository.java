package com.smartresearch.assistant.repository;

import com.smartresearch.assistant.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Mongo Repository interface for AI Notes.
 */
@Repository
public interface NoteRepository extends MongoRepository<Note, String> {

    List<Note> findByUserIdAndDocumentId(String userId, String documentId);

    Optional<Note> findByIdAndUserId(String id, String userId);

    void deleteByDocumentId(String documentId);
}
