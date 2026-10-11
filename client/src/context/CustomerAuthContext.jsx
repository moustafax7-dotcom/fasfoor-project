import { createContext, useContext, useState } from 'react';
import { verifyOtp as verifyOtpApi } from '../services/customerAuthService.js';
import { sessionStore } from '../services/sessionStorage.js';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => sessionStore.restore('customer'));

  const persist = (token, customerData) => {
    sessionStore.save('customer', token, customerData);
    setCustomer(customerData);
  };

  // الطريقة الوحيدة للدخول/التسجيل: تحقق فعلي من ملكية رقم الهاتف عبر كود OTP
  const loginWithOtp = async (phone, otp) => {
    const res = await verifyOtpApi(phone, otp);
    persist(res.token, res.customer);
    return res.customer;
  };

  const logout = () => {
    sessionStore.clear('customer');
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, loginWithOtp, logout, isAuthenticated: !!customer }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
