import { adminApi as api } from './api';
export const getOverview = (branch) => api.get('/admin/reports/overview', { params: branch ? { branch } : {} }).then((r) => r.data);
export const getBranchPerformance = () => api.get('/admin/reports/branch-performance').then((r) => r.data);
