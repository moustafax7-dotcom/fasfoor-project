import api from './api';
export const getOffers = (params) => api.get('/offers', { params }).then((r) => r.data);
