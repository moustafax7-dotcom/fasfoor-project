import api from './api';
export const addAddress = (data) => api.post('/customers/auth/addresses', data).then((r) => r.data);
export const updateAddress = (id, data) => api.put(`/customers/auth/addresses/${id}`, data).then((r) => r.data);
export const deleteAddress = (id) => api.delete(`/customers/auth/addresses/${id}`).then((r) => r.data);
