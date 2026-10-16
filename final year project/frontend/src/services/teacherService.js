import api from './api';

export const teacherService = {
  generateQuestionPaper: async (data) => {
    const response = await api.post('/teacher/generate-question-paper', data);
    return response;
  },
  generateAssignment: async (data) => {
    const response = await api.post('/teacher/generate-assignment', data);
    return response;
  },
  generateLessonPlan: async (data) => {
    const response = await api.post('/teacher/generate-lesson-plan', data);
    return response;
  },
  analyzePerformance: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/teacher/analyze-performance', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
  evaluateAnswer: async (data) => {
    const response = await api.post('/teacher/evaluate-answer', data);
    return response;
  },
  generateTeachingMaterial: async (data) => {
    const response = await api.post('/teacher/generate-teaching-material', data);
    return response;
  }
};
