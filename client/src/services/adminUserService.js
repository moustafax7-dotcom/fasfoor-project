import api from './api';
export const getAdminUsers = () => api.get('/admin/users').then((r) => r.data);
export const createAdminUser = (data) => api.post('/admin/users', data).then((r) => r.data);
export const updateAdminUser = (id, data) => api.put(`/admin/users/${id}`, data).then((r) => r.data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
