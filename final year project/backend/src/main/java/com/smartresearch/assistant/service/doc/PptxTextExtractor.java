package com.smartresearch.assistant.service.doc;

import com.smartresearch.assistant.exception.FileProcessingException;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Text extractor for PowerPoint PPTX files using Apache POI, mapping slides to 1-based page numbers.
 */
@Component
public class PptxTextExtractor {

    public Map<Integer, String> extractTextBySlide(File file) {
        Map<Integer, String> slideTextMap = new HashMap<>();

        try (FileInputStream fis = new FileInputStream(file);
             XMLSlideShow ppt = new XMLSlideShow(fis)) {

            int slideIndex = 1;
            for (var slide : ppt.getSlides()) {
                StringBuilder slideText = new StringBuilder();
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFTextShape textShape) {
                        slideText.append(textShape.getText()).append("\n");
                    }
                }
                String text = slideText.toString().trim();
                if (!text.isEmpty()) {
                    slideTextMap.put(slideIndex, text);
                }
                slideIndex++;
            }
        } catch (IOException e) {
            throw new FileProcessingException("Failed to extract text from PPTX file: " + file.getName(), e);
        }

        return slideTextMap;
    }
}
