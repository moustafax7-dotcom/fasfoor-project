import api from './api';
export const getPriceChangeLogs = (params) => api.get('/admin/price-logs', { params }).then((r) => r.data);
