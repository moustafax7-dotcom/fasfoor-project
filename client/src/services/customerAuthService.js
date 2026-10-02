import api from './api';
export const getMyProfile = () => api.get('/customers/auth/me').then((r) => r.data);
export const sendOtp = (phone, name, referralCode) =>
  api.post('/customers/auth/otp/send', { phone, name, referralCode }).then((r) => r.data);
export const verifyOtp = (phone, otp) => api.post('/customers/auth/otp/verify', { phone, otp }).then((r) => r.data);
