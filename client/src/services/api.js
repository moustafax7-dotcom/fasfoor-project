import axios from 'axios';

const baseURL = import.meta.env?.VITE_API_URL || '/api';

export function createApiClient(audience, options = {}) {
  const { storage = globalThis.localStorage, ...configOptions } = options;
  const client = axios.create({ baseURL, timeout: 20000, ...configOptions });
  client.interceptors.request.use((config) => {
    const key = audience === 'admin' ? 'fasfoor_admin_token' : 'fasfoor_customer_token';
    const token = storage?.getItem(key);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return client;
}

export const adminApi = createApiClient('admin');
const api = createApiClient('customer');
export default api;
