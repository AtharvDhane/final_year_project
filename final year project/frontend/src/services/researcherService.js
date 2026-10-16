import api from './api';

export const researcherService = {
  analyzePaper: async (data) => {
    const response = await api.post('/researcher/analyze-paper', data);
    return response;
  },
  literatureReview: async (data) => {
    const response = await api.post('/researcher/literature-review', data);
    return response;
  },
  findResearchGaps: async (data) => {
    const response = await api.post('/researcher/find-research-gaps', data);
    return response;
  },
  comparePapers: async (data) => {
    const response = await api.post('/researcher/compare-papers', data);
    return response;
  },
  generateCitations: async (data) => {
    const response = await api.post('/researcher/generate-citations', data);
    return response;
  },
  analyzeData: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/researcher/analyze-data', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  }
};
