'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/axios';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('bagnest_admin');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.role === 'admin') setAdmin(parsed);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.role !== 'admin') throw new Error('Not authorized as admin');
    setAdmin(data);
    localStorage.setItem('bagnest_admin', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('bagnest_admin');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
