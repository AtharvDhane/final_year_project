package com.smartresearch.assistant.service.doc;

import com.smartresearch.assistant.exception.FileProcessingException;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

/**
 * Text extractor for plain TXT files.
 */
@Component
public class TxtTextExtractor {

    public Map<Integer, String> extractText(File file) {
        Map<Integer, String> pageTextMap = new HashMap<>();

        try {
            String fullText = Files.readString(file.toPath()).trim();
            if (!fullText.isEmpty()) {
                pageTextMap.put(1, fullText);
            }
        } catch (IOException e) {
            throw new FileProcessingException("Failed to read TXT file: " + file.getName(), e);
        }

        return pageTextMap;
    }
}
