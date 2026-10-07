import { adminApi as api } from './api';
export const getInventoryItems = (params) => api.get('/admin/inventory', { params }).then((r) => r.data);
export const getMovements = (params) => api.get('/admin/inventory/movements', { params }).then((r) => r.data);
export const createInventoryItem = (data) => api.post('/admin/inventory', data).then((r) => r.data);
export const updateInventoryItem = (id, data) => api.put(`/admin/inventory/${id}`, data).then((r) => r.data);
export const deleteInventoryItem = (id) => api.delete(`/admin/inventory/${id}`).then((r) => r.data);
export const recordSupply = (id, data) => api.post(`/admin/inventory/${id}/supply`, data).then((r) => r.data);
export const recordStockCount = (id, data) => api.post(`/admin/inventory/${id}/count`, data).then((r) => r.data);
