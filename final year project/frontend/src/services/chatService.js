import api from './api';

export const chatService = {
  async askQuestion(documentId, sessionId, message) {
    return await api.post('/chat/ask', {
      documentId,
      sessionId: sessionId || null,
      message,
    });
  },

  async indexDocument(documentId) {
    return await api.post(`/chat/index/${documentId}`);
  },

  async getChatSessions(documentId = null) {
    const url = documentId ? `/chat/sessions?documentId=${documentId}` : '/chat/sessions';
    return await api.get(url);
  },

  async getChatSessionById(sessionId) {
    return await api.get(`/chat/sessions/${sessionId}`);
  },

  async deleteChatSession(sessionId) {
    return await api.delete(`/chat/sessions/${sessionId}`);
  }
};
