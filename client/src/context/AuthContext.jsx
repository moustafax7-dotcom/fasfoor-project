import { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('fasfoor_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    const res = await loginAdmin(username, password);
    localStorage.setItem('fasfoor_admin_token', res.token);
    localStorage.setItem('fasfoor_admin', JSON.stringify(res.admin));
    setAdmin(res.admin);
    return res.admin;
  };

  const logout = () => {
    localStorage.removeItem('fasfoor_admin_token');
    localStorage.removeItem('fasfoor_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
