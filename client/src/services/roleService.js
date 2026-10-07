import { adminApi as api } from './api';
export const getRoles = () => api.get('/admin/roles').then((r) => r.data);
export const updatePermissions = (roles) => api.put('/admin/roles', { roles }).then((r) => r.data);
