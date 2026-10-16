import api from './api';

export const aiToolsService = {
  async generateSummary(documentId) {
    return await api.post(`/ai-tools/summary/${documentId}`);
  },

  async generateNotes(documentId) {
    return await api.post(`/ai-tools/notes/${documentId}`);
  },

  async generateQuiz(documentId) {
    return await api.post(`/ai-tools/quiz/${documentId}`);
  },

  async generateFlashcards(documentId) {
    return await api.post(`/ai-tools/flashcards/${documentId}`);
  },

  async generateMindMap(documentId) {
    return await api.post(`/ai-tools/mindmap/${documentId}`);
  },

  async generateEli5(documentId) {
    return await api.post(`/ai-tools/eli5/${documentId}`);
  },

  async translateDocument(documentId, language) {
    return await api.post(`/ai-tools/translate/${documentId}?language=${encodeURIComponent(language)}`);
  }
};
