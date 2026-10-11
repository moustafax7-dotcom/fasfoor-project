import { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../services/authService';
import { sessionStore } from '../services/sessionStorage.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => sessionStore.restore('admin'));

  const login = async (username, password) => {
    const res = await loginAdmin(username, password);
    sessionStore.save('admin', res.token, res.admin);
    setAdmin(res.admin);
    return res.admin;
  };

  const logout = () => {
    sessionStore.clear('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
