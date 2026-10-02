import api from './api';
export const createOrder = (data) => api.post('/orders', data).then((r) => r.data);
export const getOrders = (params) => api.get('/orders', { params }).then((r) => r.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const updateOrderStatus = (id, status, cancelReason) =>
  api.patch(`/orders/${id}/status`, { status, cancelReason }).then((r) => r.data);
