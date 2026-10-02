import api from './api';
export const getFavorites = () => api.get('/customers/auth/favorites').then((r) => r.data);
export const toggleFavorite = (itemId) => api.post(`/customers/auth/favorites/${itemId}`).then((r) => r.data);
