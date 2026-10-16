package com.smartresearch.assistant.service.doc;

import com.smartresearch.assistant.exception.FileProcessingException;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Text extractor for Word DOCX files using Apache POI.
 */
@Component
public class DocxTextExtractor {

    public Map<Integer, String> extractText(File file) {
        Map<Integer, String> pageTextMap = new HashMap<>();

        try (FileInputStream fis = new FileInputStream(file);
             XWPFDocument document = new XWPFDocument(fis);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {

            String fullText = extractor.getText().trim();
            if (!fullText.isEmpty()) {
                pageTextMap.put(1, fullText);
            }
        } catch (IOException e) {
            throw new FileProcessingException("Failed to extract text from DOCX file: " + file.getName(), e);
        }

        return pageTextMap;
    }
}
