import api from './api';

export const historyService = {
  getHistory: async () => {
    const response = await api.get('/history');
    return response;
  }
};
