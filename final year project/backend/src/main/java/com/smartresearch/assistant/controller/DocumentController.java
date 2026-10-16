package com.smartresearch.assistant.controller;

import com.smartresearch.assistant.dto.ApiResponse;
import com.smartresearch.assistant.dto.DocumentResponse;
import com.smartresearch.assistant.dto.RenameDocumentRequest;
import com.smartresearch.assistant.model.Document.ProcessingStatus;
import com.smartresearch.assistant.security.UserPrincipal;
import com.smartresearch.assistant.service.DocumentService;
import com.smartresearch.assistant.service.ai.RagService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for Document upload, auto-indexing, file streaming preview, listing, rename, and deletion.
 */
@RestController
@RequestMapping("/documents")
public class DocumentController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);

    private final DocumentService documentService;
    private final RagService ragService;

    public DocumentController(DocumentService documentService, RagService ragService) {
        this.documentService = documentService;
        this.ragService = ragService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DocumentResponse response = documentService.uploadDocument(file, userPrincipal.getId());
        
        // Fast synchronous indexing with local embeddings (~100ms)
        try {
            ragService.indexDocument(response.getId(), userPrincipal.getId());
        } catch (Exception ex) {
            logger.error("Failed to index document '{}' after upload: {}", response.getFileName(), ex.getMessage(), ex);
        }

        DocumentResponse updated = documentService.getDocumentById(response.getId(), userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", updated));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getUserDocuments(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<DocumentResponse> documents = documentService.getUserDocuments(userPrincipal.getId());
        
        // Log documents that need re-indexing (done lazily on first chat, not blocking list)
        long pendingCount = documents.stream()
                .filter(doc -> doc.getStatus() != ProcessingStatus.INDEXED || doc.getChunkCount() == 0)
                .count();
        if (pendingCount > 0) {
            logger.info("{} document(s) pending indexing for user {}", pendingCount, userPrincipal.getId());
        }

        return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", documents));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocumentById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DocumentResponse document = documentService.getDocumentById(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Document fetched successfully", document));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getDocumentFile(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Resource fileResource = documentService.getDocumentFileResource(id, userPrincipal.getId());
        DocumentResponse doc = documentService.getDocumentById(id, userPrincipal.getId());

        String contentType = "application/octet-stream";
        if ("PDF".equalsIgnoreCase(doc.getFileType())) {
            contentType = MediaType.APPLICATION_PDF_VALUE;
        } else if ("TXT".equalsIgnoreCase(doc.getFileType())) {
            contentType = MediaType.TEXT_PLAIN_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(fileResource);
    }

    @PutMapping("/{id}/rename")
    public ResponseEntity<ApiResponse<DocumentResponse>> renameDocument(
            @PathVariable("id") String id,
            @Valid @RequestBody RenameDocumentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DocumentResponse updated = documentService.renameDocument(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Document renamed successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        documentService.deleteDocument(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully"));
    }
}
