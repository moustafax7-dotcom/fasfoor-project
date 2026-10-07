import { buildItemPayload } from './itemPayload.js';
import api, { adminApi } from './api';
export const getItems = (params) => api.get('/items', { params }).then((r) => r.data);
export const getItemById = (id) => api.get(`/items/${id}`).then((r) => r.data);
export const createItem = (data) => adminApi.post('/items', buildItemPayload(data)).then((r) => r.data);
export const updateItem = (id, data) => adminApi.put(`/items/${id}`, buildItemPayload(data)).then((r) => r.data);
export const toggleItemAvailability = (id) => adminApi.patch(`/items/${id}/toggle-availability`).then((r) => r.data);
export const approveItemPrice = (id) => adminApi.patch(`/items/${id}/approve-price`).then((r) => r.data);
export const deleteItem = (id) => adminApi.delete(`/items/${id}`).then((r) => r.data);
