import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// إرفاق التوكن المناسب تلقائيًا (أدمن أو عميل حسب المسار)
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('fasfoor_admin_token');
  const customerToken = localStorage.getItem('fasfoor_customer_token');
  const isAdminRoute = config.url?.includes('/admin');
  const token = isAdminRoute ? adminToken : customerToken || adminToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;