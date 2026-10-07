import api, { adminApi } from './api';
export const getBranches = () => api.get('/branches').then((r) => r.data);
export const getBranchById = (id) => api.get(`/branches/${id}`).then((r) => r.data);
export const updateBranch = (id, data) => adminApi.put(`/branches/${id}`, data).then((r) => r.data);
