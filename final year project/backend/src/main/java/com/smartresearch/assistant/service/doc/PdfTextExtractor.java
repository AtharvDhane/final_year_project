package com.smartresearch.assistant.service.doc;

import com.smartresearch.assistant.exception.FileProcessingException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

/**
 * Text extractor for PDF documents using Apache PDFBox 3.x with page-by-page mapping.
 */
@Component
public class PdfTextExtractor {

    public Map<Integer, String> extractTextByPage(File file) {
        Map<Integer, String> pageTextMap = new TreeMap<>();

        try (PDDocument document = Loader.loadPDF(file)) {
            int totalPages = document.getNumberOfPages();
            PDFTextStripper stripper = new PDFTextStripper();

            for (int page = 1; page <= totalPages; page++) {
                stripper.setStartPage(page);
                stripper.setEndPage(page);
                String text = stripper.getText(document).trim();
                if (!text.isEmpty()) {
                    pageTextMap.put(page, text);
                }
            }
        } catch (IOException e) {
            throw new FileProcessingException("Failed to extract text from PDF file: " + file.getName(), e);
        }

        return pageTextMap;
    }
}
