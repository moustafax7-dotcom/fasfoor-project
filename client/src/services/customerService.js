import { adminApi as api } from './api';
export const getCustomers = () => api.get('/admin/customers').then((r) => r.data);
export const getCustomerOrders = (id) => api.get(`/admin/customers/${id}/orders`).then((r) => r.data);
