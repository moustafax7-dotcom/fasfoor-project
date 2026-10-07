import api, { adminApi } from './api';
export const getCategories = () => api.get('/categories').then((r) => r.data);
export const createCategory = (data) => adminApi.post('/categories', data).then((r) => r.data);
export const updateCategory = (id, data) => adminApi.put(`/categories/${id}`, data).then((r) => r.data);
