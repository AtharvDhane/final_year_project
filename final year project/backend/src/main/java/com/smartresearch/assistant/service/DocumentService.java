package com.smartresearch.assistant.service;

import com.smartresearch.assistant.dto.DocumentResponse;
import com.smartresearch.assistant.dto.RenameDocumentRequest;
import com.smartresearch.assistant.exception.BadRequestException;
import com.smartresearch.assistant.exception.ResourceNotFoundException;
import com.smartresearch.assistant.model.Document;
import com.smartresearch.assistant.model.Document.ProcessingStatus;
import com.smartresearch.assistant.repository.ChatSessionRepository;
import com.smartresearch.assistant.repository.DocumentRepository;
import com.smartresearch.assistant.repository.FlashcardSetRepository;
import com.smartresearch.assistant.repository.NoteRepository;
import com.smartresearch.assistant.repository.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service managing document upload, file storage, file preview, rename, and deletion operations.
 */
@Service
public class DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "pptx", "txt");

    private final DocumentRepository documentRepository;
    private final FileStorageService fileStorageService;
    private final ChatSessionRepository chatSessionRepository;
    private final NoteRepository noteRepository;
    private final QuizRepository quizRepository;
    private final FlashcardSetRepository flashcardSetRepository;

    public DocumentService(DocumentRepository documentRepository,
                           FileStorageService fileStorageService,
                           ChatSessionRepository chatSessionRepository,
                           NoteRepository noteRepository,
                           QuizRepository quizRepository,
                           FlashcardSetRepository flashcardSetRepository) {
        this.documentRepository = documentRepository;
        this.fileStorageService = fileStorageService;
        this.chatSessionRepository = chatSessionRepository;
        this.noteRepository = noteRepository;
        this.quizRepository = quizRepository;
        this.flashcardSetRepository = flashcardSetRepository;
    }

    public DocumentResponse uploadDocument(MultipartFile file, String userId) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new BadRequestException("Invalid file name format");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file format. Supported formats: PDF, DOCX, PPTX, TXT");
        }

        // Store file on local filesystem
        String storedFilePath = fileStorageService.storeFile(file);

        // Save Document metadata in MongoDB
        Document document = Document.builder()
                .userId(userId)
                .fileName(originalFilename)
                .fileType(extension.toUpperCase())
                .fileSize(file.getSize())
                .filePath(storedFilePath)
                .status(ProcessingStatus.PROCESSING)
                .chunkCount(0)
                .build();

        Document savedDoc = documentRepository.save(document);

        return mapToResponse(savedDoc);
    }

    public List<DocumentResponse> getUserDocuments(String userId) {
        return documentRepository.findByUserIdOrderByUploadedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DocumentResponse getDocumentById(String documentId, String userId) {
        Document document = findDocumentByIdAndUser(documentId, userId);
        return mapToResponse(document);
    }

    public Resource getDocumentFileResource(String documentId, String userId) {
        Document document = findDocumentByIdAndUser(documentId, userId);
        try {
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on disk");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found or unreadable");
        }
    }

    public DocumentResponse renameDocument(String documentId, String userId, RenameDocumentRequest request) {
        Document document = findDocumentByIdAndUser(documentId, userId);

        String newFileName = request.getNewFileName();
        if (newFileName == null || newFileName.trim().isEmpty()) {
            throw new BadRequestException("New file name cannot be empty");
        }
        newFileName = newFileName.trim();

        // Preserve original file extension
        String originalExt = document.getFileType().toLowerCase(); // e.g. "pdf"
        if (!newFileName.toLowerCase().endsWith("." + originalExt)) {
            newFileName = newFileName + "." + originalExt;
        }

        document.setFileName(newFileName);
        Document updatedDoc = documentRepository.save(document);
        return mapToResponse(updatedDoc);
    }

    public void deleteDocument(String documentId, String userId) {
        Document document = findDocumentByIdAndUser(documentId, userId);
        
        // Remove physical file from disk
        fileStorageService.deleteFile(document.getFilePath());
        
        // Cascade delete related data
        try {
            chatSessionRepository.deleteByDocumentId(documentId);
            noteRepository.deleteByDocumentId(documentId);
            quizRepository.deleteByDocumentId(documentId);
            flashcardSetRepository.deleteByDocumentId(documentId);
            logger.info("Cascade deleted related data for document: {}", documentId);
        } catch (Exception ex) {
            logger.warn("Failed to cascade delete some related data for document {}: {}", documentId, ex.getMessage());
        }
        
        // Remove metadata from Mongo
        documentRepository.delete(document);
    }

    public Document findDocumentByIdAndUser(String documentId, String userId) {
        return documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
    }

    public List<DocumentResponse> getAllDocumentsAsAdmin() {
        return documentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteDocumentAsAdmin(String documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        fileStorageService.deleteFile(document.getFilePath());
        
        try {
            chatSessionRepository.deleteByDocumentId(documentId);
            noteRepository.deleteByDocumentId(documentId);
            quizRepository.deleteByDocumentId(documentId);
            flashcardSetRepository.deleteByDocumentId(documentId);
            logger.info("Cascade deleted related data for document: {}", documentId);
        } catch (Exception ex) {
            logger.warn("Failed to cascade delete some related data for document {}: {}", documentId, ex.getMessage());
        }
        
        documentRepository.delete(document);
    }

    private DocumentResponse mapToResponse(Document doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .fileName(doc.getFileName())
                .fileType(doc.getFileType())
                .fileSize(doc.getFileSize())
                .status(doc.getStatus())
                .chunkCount(doc.getChunkCount())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}
