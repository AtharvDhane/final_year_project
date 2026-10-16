package com.smartresearch.assistant.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresearch.assistant.dto.ResearcherRequest;
import com.smartresearch.assistant.service.ai.AiService;
import com.smartresearch.assistant.service.qdrant.QdrantService;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import com.smartresearch.assistant.model.AiGeneration;
import com.smartresearch.assistant.repository.AiGenerationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResearcherService {

    private final AiService aiService;
    private final QdrantService qdrantService;
    private final DataAnalysisService dataAnalysisService;
    private final AiGenerationRepository aiGenerationRepository;
    private final ObjectMapper objectMapper;

    public ResearcherService(AiService aiService, QdrantService qdrantService, DataAnalysisService dataAnalysisService, AiGenerationRepository aiGenerationRepository) {
        this.aiService = aiService;
        this.qdrantService = qdrantService;
        this.dataAnalysisService = dataAnalysisService;
        this.aiGenerationRepository = aiGenerationRepository;
        this.objectMapper = new ObjectMapper();
    }

    private String getDocumentContext(String documentId, String userId, String query) {
        if (documentId == null || documentId.isBlank()) return "";
        try {
            float[] queryVector = aiService.generateEmbedding(query);
            List<EmbeddingMatch<TextSegment>> matches = qdrantService.searchSimilarChunks(queryVector, userId, documentId, 15);
            return matches.stream().map(m -> m.embedded().text()).collect(Collectors.joining("\n\n"));
        } catch (Exception e) {
            return "Could not retrieve context for document " + documentId;
        }
    }

    private String getMultiDocumentContext(List<String> documentIds, String userId, String query) {
        if (documentIds == null || documentIds.isEmpty()) return "";
        StringBuilder combinedContext = new StringBuilder();
        for (String docId : documentIds) {
            combinedContext.append("--- Document ").append(docId).append(" ---\n");
            combinedContext.append(getDocumentContext(docId, userId, query)).append("\n\n");
        }
        return combinedContext.toString();
    }

    public String analyzePaper(ResearcherRequest.SingleDocument request, String userId) {
        String context = getDocumentContext(request.getDocumentId(), userId, "research objective problem methodology dataset findings limitations conclusion");
        String prompt = String.format(
            "You are a Research Assistant. Analyze the following research paper context and extract the following sections clearly:\n" +
            "- Research Objective\n" +
            "- Research Problem\n" +
            "- Methodology\n" +
            "- Dataset\n" +
            "- Findings\n" +
            "- Limitations\n" +
            "- Conclusion\n" +
            "- Future Work\n\n" +
            "CRITICAL: Do NOT invent information that does not exist in the context.\n\n" +
            "Context:\n%s",
            context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Research Paper Analyzer")
                .inputSummary("Analyzed a research paper.")
                .outputResult(result)
                .build());
        return result;
    }

    public String literatureReview(ResearcherRequest.MultiDocument request, String userId) {
        String context = getMultiDocumentContext(request.getDocumentIds(), userId, "abstract findings methodology future research");
        String prompt = String.format(
            "You are a Research Assistant performing a Literature Review across multiple uploaded papers.\n" +
            "Generate a review that includes:\n" +
            "- Common themes\n" +
            "- Major findings\n" +
            "- Methodologies used\n" +
            "- Similarities & Differences\n" +
            "- Limitations\n" +
            "- Research gaps\n" +
            "- Future research directions\n\n" +
            "Context from papers:\n%s",
            context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Literature Review Assistant")
                .inputSummary("Reviewed " + request.getDocumentIds().size() + " papers.")
                .outputResult(result)
                .build());
        return result;
    }

    public String findResearchGaps(ResearcherRequest.MultiDocument request, String userId) {
        String context = getMultiDocumentContext(request.getDocumentIds(), userId, "limitations future work challenges gaps dataset methodology");
        String prompt = String.format(
            "Analyze the following research paper excerpts and identify possible research gaps based ONLY on the provided text.\n" +
            "Structure the output to identify:\n" +
            "- Methodological gaps\n" +
            "- Dataset gaps\n" +
            "- Population/sample gaps\n" +
            "- Geographic gaps\n" +
            "- Technology gaps\n\n" +
            "Context:\n%s",
            context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Research Gap Finder")
                .inputSummary("Found gaps from " + request.getDocumentIds().size() + " papers.")
                .outputResult(result)
                .build());
        return result;
    }

    public String comparePapers(ResearcherRequest.MultiDocument request, String userId) {
        String context = getMultiDocumentContext(request.getDocumentIds(), userId, "objective methodology dataset findings limitations contribution");
        String prompt = String.format(
            "Compare the provided research papers based on the excerpts below.\n" +
            "Compare them strictly on these criteria:\n" +
            "- Objective\n" +
            "- Methodology\n" +
            "- Dataset\n" +
            "- Findings\n" +
            "- Limitations\n" +
            "- Contribution\n" +
            "Present the result in a clean comparison format (e.g., Markdown table or clearly structured sections).\n\n" +
            "Context:\n%s",
            context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Paper Comparison")
                .inputSummary("Compared " + request.getDocumentIds().size() + " papers.")
                .outputResult(result)
                .build());
        return result;
    }

    public String generateCitations(ResearcherRequest.SingleDocument request, String userId) {
        String context = getDocumentContext(request.getDocumentId(), userId, "title authors journal year doi publication");
        String prompt = String.format(
            "Generate citations for the research paper based on the text below.\n" +
            "Provide the citation in APA, MLA, and IEEE formats.\n" +
            "CRITICAL: Never fabricate missing author, DOI, journal, year, or other bibliographic information. If it's missing from the text, state that it's unavailable.\n\n" +
            "Context:\n%s",
            context
        );
        String result = aiService.generateCompletion(prompt);
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Citation Assistant")
                .inputSummary("Generated citations.")
                .outputResult(result)
                .build());
        return result;
    }

    public Map<String, Object> analyzeData(MultipartFile file, String userId) throws Exception {
        Map<String, Object> res = dataAnalysisService.analyzeData(file);
        
        // Format to markdown to save in history
        StringBuilder markdownStr = new StringBuilder();
        markdownStr.append("### Research Dataset Overview\n\n");
        markdownStr.append("- **Total Rows**: ").append(res.get("totalRows")).append("\n");
        markdownStr.append("- **Total Columns**: ").append(res.get("totalColumns")).append("\n\n");
        markdownStr.append("#### Column Analysis\n\n");
        
        List<Map<String, Object>> columns = (List<Map<String, Object>>) res.get("columns");
        if (columns != null) {
            for (Map<String, Object> col : columns) {
                markdownStr.append("**").append(col.get("columnName")).append("** (").append(col.get("type")).append(")\n");
                markdownStr.append("- Missing Values: ").append(col.get("missingValues")).append("\n");
                if ("Numeric".equals(col.get("type"))) {
                    markdownStr.append("- Min: ").append(col.get("min")).append(", Max: ").append(col.get("max"))
                               .append(", Mean: ").append(col.get("mean")).append(", Median: ").append(col.get("median")).append("\n");
                } else {
                    markdownStr.append("- Unique Values: ").append(col.get("uniqueValuesCount")).append("\n");
                    if (col.get("topFrequencies") != null) {
                        markdownStr.append("- Top Freq: ").append(String.join(", ", (List<String>) col.get("topFrequencies"))).append("\n");
                    }
                }
                markdownStr.append("\n");
            }
        }
        
        aiGenerationRepository.save(AiGeneration.builder()
                .userId(userId)
                .toolName("Research Data Analyzer")
                .inputSummary("Analyzed dataset file: " + file.getOriginalFilename())
                .outputResult(markdownStr.toString())
                .build());
                
        return res;
    }
}
