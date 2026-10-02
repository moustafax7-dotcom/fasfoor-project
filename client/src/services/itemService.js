import api from './api';
export const getItems = (params) => api.get('/items', { params }).then((r) => r.data);
export const getItemById = (id) => api.get(`/items/${id}`).then((r) => r.data);
export const createItem = (data) => api.post('/items', data).then((r) => r.data);
export const updateItem = (id, data) => api.put(`/items/${id}`, data).then((r) => r.data);
export const toggleItemAvailability = (id) => api.patch(`/items/${id}/toggle-availability`).then((r) => r.data);
export const approveItemPrice = (id) => api.patch(`/items/${id}/approve-price`).then((r) => r.data);
export const deleteItem = (id) => api.delete(`/items/${id}`).then((r) => r.data);
