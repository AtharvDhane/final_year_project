package com.smartresearch.assistant.service.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresearch.assistant.exception.FileProcessingException;
import com.smartresearch.assistant.model.Document;
import com.smartresearch.assistant.model.FlashcardSet;
import com.smartresearch.assistant.model.FlashcardSet.Flashcard;
import com.smartresearch.assistant.model.Note;
import com.smartresearch.assistant.model.Quiz;
import com.smartresearch.assistant.model.Quiz.Question;
import com.smartresearch.assistant.repository.FlashcardSetRepository;
import com.smartresearch.assistant.repository.NoteRepository;
import com.smartresearch.assistant.repository.QuizRepository;
import com.smartresearch.assistant.service.DocumentService;
import com.smartresearch.assistant.service.doc.DocumentProcessorService;
import com.smartresearch.assistant.dto.DocumentChunk;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service providing AI Study Tools: Summaries, Notes, MCQs, Flashcards, Mind Maps, ELI5, and Translation.
 */
@Service
public class AiToolsService {

    private final DocumentService documentService;
    private final DocumentProcessorService documentProcessor;
    private final AiService aiService;
    private final NoteRepository noteRepository;
    private final QuizRepository quizRepository;
    private final FlashcardSetRepository flashcardSetRepository;
    private final ObjectMapper objectMapper;

    public AiToolsService(DocumentService documentService,
                          DocumentProcessorService documentProcessor,
                          AiService aiService,
                          NoteRepository noteRepository,
                          QuizRepository quizRepository,
                          FlashcardSetRepository flashcardSetRepository,
                          ObjectMapper objectMapper) {
        this.documentService = documentService;
        this.documentProcessor = documentProcessor;
        this.aiService = aiService;
        this.noteRepository = noteRepository;
        this.quizRepository = quizRepository;
        this.flashcardSetRepository = flashcardSetRepository;
        this.objectMapper = objectMapper;
    }

    private String getDocumentFullText(String documentId, String userId) {
        Document doc = documentService.findDocumentByIdAndUser(documentId, userId);
        File file = resolveDocumentFile(doc);
        List<DocumentChunk> chunks = documentProcessor.processAndChunkDocument(file, doc.getFileType());
        
        String fullText = chunks.stream().map(DocumentChunk::getText).collect(Collectors.joining("\n\n"));
        if (fullText.length() > 25000) {
            fullText = fullText.substring(0, 25000) + "\n...[truncated for context limit]";
        }
        return fullText;
    }

    private File resolveDocumentFile(Document doc) {
        File file = new File(doc.getFilePath());
        if (file.exists()) return file;

        file = new File("uploads", new File(doc.getFilePath()).getName());
        if (file.exists()) return file;

        file = new File("backend/uploads", new File(doc.getFilePath()).getName());
        if (file.exists()) return file;

        // Last resort: just the filename
        file = new File(new File(doc.getFilePath()).getName());
        return file;
    }

    public String generateSummary(String documentId, String userId) {
        String docText = getDocumentFullText(documentId, userId);
        String prompt = String.format(PromptTemplates.SUMMARIZER_PROMPT, docText);
        return aiService.generateCompletion(prompt);
    }

    public Note generateNotes(String documentId, String userId) {
        String docText = getDocumentFullText(documentId, userId);
        Document doc = documentService.findDocumentByIdAndUser(documentId, userId);
        
        String prompt = String.format(PromptTemplates.NOTES_GENERATOR_PROMPT, docText);
        String markdownNotes = aiService.generateCompletion(prompt);

        Note note = Note.builder()
                .userId(userId)
                .documentId(documentId)
                .title("Study Notes: " + doc.getFileName())
                .contentMarkdown(markdownNotes)
                .build();

        return noteRepository.save(note);
    }

    public Quiz generateQuiz(String documentId, String userId) {
        String docText = getDocumentFullText(documentId, userId);
        Document doc = documentService.findDocumentByIdAndUser(documentId, userId);

        String prompt = String.format(PromptTemplates.QUIZ_GENERATOR_PROMPT, docText);
        String jsonOutput = aiService.generateCompletion(prompt);

        try {
            String cleanJson = extractJson(jsonOutput);
            List<Question> questions = objectMapper.readValue(cleanJson, new TypeReference<List<Question>>() {});

            Quiz quiz = Quiz.builder()
                    .userId(userId)
                    .documentId(documentId)
                    .title("Practice Quiz: " + doc.getFileName())
                    .questions(questions)
                    .build();

            return quizRepository.save(quiz);
        } catch (Exception e) {
            throw new FileProcessingException("Failed to parse AI Quiz JSON response", e);
        }
    }

    public FlashcardSet generateFlashcards(String documentId, String userId) {
        String docText = getDocumentFullText(documentId, userId);
        Document doc = documentService.findDocumentByIdAndUser(documentId, userId);

        String prompt = String.format(PromptTemplates.FLASHCARD_GENERATOR_PROMPT, docText);
        String jsonOutput = aiService.generateCompletion(prompt);

        try {
            String cleanJson = extractJson(jsonOutput);
            List<Flashcard> cards = objectMapper.readValue(cleanJson, new TypeReference<List<Flashcard>>() {});

            FlashcardSet flashcardSet = FlashcardSet.builder()
                    .userId(userId)
                    .documentId(documentId)
                    .title("Flashcards: " + doc.getFileName())
                    .cards(cards)
                    .build();

            return flashcardSetRepository.save(flashcardSet);
        } catch (Exception e) {
            throw new FileProcessingException("Failed to parse AI Flashcards JSON response", e);
        }
    }

    public String generateMindMap(String documentId, String userId) {
        String docText = getDocumentFullText(documentId, userId);
        String prompt = String.format(PromptTemplates.MIND_MAP_PROMPT, docText);
        return aiService.generateCompletion(prompt);
    }

    public String explainLikeImFive(String documentId, String userId) {
        String docText = getDocumentFullText(documentId, userId);
        String prompt = String.format(PromptTemplates.ELI5_PROMPT, docText);
        return aiService.generateCompletion(prompt);
    }

    public String translateDocument(String documentId, String userId, String targetLanguage) {
        String docText = getDocumentFullText(documentId, userId);
        String prompt = String.format(PromptTemplates.TRANSLATION_PROMPT, targetLanguage, docText);
        return aiService.generateCompletion(prompt);
    }

    private String extractJson(String text) {
        int firstBracket = text.indexOf('[');
        int lastBracket = text.lastIndexOf(']');
        if (firstBracket != -1 && lastBracket != -1 && lastBracket > firstBracket) {
            return text.substring(firstBracket, lastBracket + 1);
        }
        return text;
    }
}
