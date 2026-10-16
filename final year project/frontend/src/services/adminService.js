import api from './api';

export const adminService = {
  async getAllUsers() {
    return await api.get('/admin/users');
  },
  async getStats() {
    return await api.get('/admin/stats');
  },
  async deleteUser(id) {
    return await api.delete(`/admin/users/${id}`);
  },
  async suspendUser(id) {
    return await api.put(`/admin/users/${id}/suspend`);
  },
  async activateUser(id) {
    return await api.put(`/admin/users/${id}/activate`);
  },
  async changeUserRole(id, newRole) {
    return await api.put(`/admin/users/${id}/role?newRole=${newRole}`);
  },
  async getDocuments() {
    return await api.get('/admin/documents');
  },
  async deleteDocument(id) {
    return await api.delete(`/admin/documents/${id}`);
  }
};
