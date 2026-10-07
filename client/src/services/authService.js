import { adminApi as api } from './api';
export const loginAdmin = (username, password) => api.post('/admin/auth/login', { username, password }).then((r) => r.data);
