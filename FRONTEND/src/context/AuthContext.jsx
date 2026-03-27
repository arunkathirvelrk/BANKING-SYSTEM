import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('username');
      if (token) {
        try {
          await api.get(`/auth/validate?token=${token}`);
          setIsAuthenticated(true);
          setUsername(user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
