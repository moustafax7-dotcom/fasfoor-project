import api from './api';
export const createReview = (data) => api.post('/reviews', data).then((r) => r.data);
