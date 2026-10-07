import api, { adminApi } from './api';
export const getCoupons = (params) => adminApi.get('/coupons', { params }).then((r) => r.data);
export const createCoupon = (data) => adminApi.post('/coupons', data).then((r) => r.data);
export const updateCoupon = (id, data) => adminApi.put(`/coupons/${id}`, data).then((r) => r.data);
export const deleteCoupon = (id) => adminApi.delete(`/coupons/${id}`).then((r) => r.data);
export const validateCoupon = (code, branch) => api.get('/coupons/validate', { params: { code, branch } }).then((r) => r.data);
