import api from './api';

export const documentService = {
  async uploadDocument(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });
  },

  async getDocuments() {
    return await api.get('/documents');
  },

  async getDocumentById(id) {
    return await api.get(`/documents/${id}`);
  },

  // Returns a blob URL for authenticated document file preview (no token in URL)
  async getDocumentFileBlob(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/documents/${id}/file`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to load document file');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  async renameDocument(id, newFileName) {
    return await api.put(`/documents/${id}/rename`, { newFileName });
  },

  async deleteDocument(id) {
    return await api.delete(`/documents/${id}`);
  }
};
