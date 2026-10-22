import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('clearimpact_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setNgo(res.data.ngo || null);
      } catch (err) {
        console.warn('Session expired or invalid token');
        localStorage.removeItem('clearimpact_token');
        setUser(null);
        setNgo(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('clearimpact_token', res.data.token);
    setUser(res.data.user);
    setNgo(res.data.ngo || null);
    return res.data;
  };

  const register = async (name, email, password, role = 'DONOR', ngoData = null) => {
    const res = await api.post('/auth/register', { name, email, password, role, ngoData });
    localStorage.setItem('clearimpact_token', res.data.token);
    setUser(res.data.user);
    setNgo(res.data.ngo || null);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('clearimpact_token');
    setUser(null);
    setNgo(null);
  };

  const updatePreferences = async (preferences) => {
    const res = await api.put('/auth/preferences', preferences);
    setUser((prev) => ({ ...prev, preferences: res.data.preferences }));
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, ngo, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
