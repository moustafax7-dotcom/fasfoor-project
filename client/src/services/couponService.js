import api from './api';
export const getCoupons = (params) => api.get('/coupons', { params }).then((r) => r.data);
export const createCoupon = (data) => api.post('/coupons', data).then((r) => r.data);
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data).then((r) => r.data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`).then((r) => r.data);
export const validateCoupon = (code, branch) => api.get('/coupons/validate', { params: { code, branch } }).then((r) => r.data);
