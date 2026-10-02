import { createContext, useContext, useState } from 'react';
import { verifyOtp as verifyOtpApi } from '../services/customerAuthService.js';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('fasfoor_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const persist = (token, customerData) => {
    localStorage.setItem('fasfoor_customer_token', token);
    localStorage.setItem('fasfoor_customer', JSON.stringify(customerData));
    setCustomer(customerData);
  };

  // الطريقة الوحيدة للدخول/التسجيل: تحقق فعلي من ملكية رقم الهاتف عبر كود OTP
  const loginWithOtp = async (phone, otp) => {
    const res = await verifyOtpApi(phone, otp);
    persist(res.token, res.customer);
    return res.customer;
  };

  const logout = () => {
    localStorage.removeItem('fasfoor_customer_token');
    localStorage.removeItem('fasfoor_customer');
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, loginWithOtp, logout, isAuthenticated: !!customer }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
