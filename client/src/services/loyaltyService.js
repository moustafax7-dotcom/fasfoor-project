import api, { adminApi } from './api';
export const getLoyaltyConfig = () => api.get('/loyalty/config').then((r) => r.data);
export const updateLoyaltyConfig = (data) => adminApi.put('/loyalty/config', data).then((r) => r.data);
