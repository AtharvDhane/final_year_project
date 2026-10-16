package com.smartresearch.assistant.service.doc;

import com.smartresearch.assistant.dto.DocumentChunk;
import com.smartresearch.assistant.exception.FileProcessingException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * Service orchestrating text extraction and context chunking for multiple file formats.
 */
@Service
public class DocumentProcessorService {

    private final PdfTextExtractor pdfTextExtractor;
    private final DocxTextExtractor docxTextExtractor;
    private final PptxTextExtractor pptxTextExtractor;
    private final TxtTextExtractor txtTextExtractor;
    private final RecursiveTextChunker textChunker;

    public DocumentProcessorService(PdfTextExtractor pdfTextExtractor,
                                    DocxTextExtractor docxTextExtractor,
                                    PptxTextExtractor pptxTextExtractor,
                                    TxtTextExtractor txtTextExtractor,
                                    RecursiveTextChunker textChunker) {
        this.pdfTextExtractor = pdfTextExtractor;
        this.docxTextExtractor = docxTextExtractor;
        this.pptxTextExtractor = pptxTextExtractor;
        this.txtTextExtractor = txtTextExtractor;
        this.textChunker = textChunker;
    }

    public List<DocumentChunk> processAndChunkDocument(File file, String fileType) {
        Map<Integer, String> pageTextMap;

        switch (fileType.toUpperCase()) {
            case "PDF" -> pageTextMap = pdfTextExtractor.extractTextByPage(file);
            case "DOCX" -> pageTextMap = docxTextExtractor.extractText(file);
            case "PPTX" -> pageTextMap = pptxTextExtractor.extractTextBySlide(file);
            case "TXT" -> pageTextMap = txtTextExtractor.extractText(file);
            default -> throw new FileProcessingException("Unsupported file type for processing: " + fileType);
        }

        if (pageTextMap.isEmpty()) {
            throw new FileProcessingException("No readable text could be extracted from document: " + file.getName());
        }

        return textChunker.chunkDocument(pageTextMap);
    }
}
