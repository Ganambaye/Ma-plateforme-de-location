import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  const login = async (email, password) => { const res = await api.post('/auth/login', { email, password }); localStorage.setItem('token', res.data.token); setUser(res.data.user); return res; };
  const register = async (userData) => { const res = await api.post('/auth/register', userData); localStorage.setItem('token', res.data.token); setUser(res.data.user); return res; };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
