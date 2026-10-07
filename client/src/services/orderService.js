import api, { adminApi } from './api';
export const createOrder = (data) => api.post('/orders', data).then((r) => r.data);
export const getOrders = (params) => adminApi.get('/orders', { params }).then((r) => r.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const updateOrderStatus = (id, status, cancelReason) =>
  adminApi.patch(`/orders/${id}/status`, { status, cancelReason }).then((r) => r.data);
