
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { User, AuthContextType } from '@/types';
import { setToken, clearToken, getToken, setRefreshToken, clearRefreshToken } from '@/lib/auth';
import { api } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setAuthState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.get('/api/auth/me');
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
      setAuthState(null);
      clearToken();
      clearRefreshToken();
      return false;
    }
  }, []);

  const loadUserFromToken = useCallback(async () => {
    setLoading(true);
    const storedToken = getToken();
    if (storedToken) {
      setAuthState(storedToken);
      await fetchUser();
    }
    setLoading(false);
  }, [fetchUser]);


  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post('/api/auth/login', { email, password });
    const { accessToken: newToken, refreshToken } = response;
    
    setToken(newToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    setAuthState(newToken);
    await fetchUser();
  };

  const forgotPassword = async (email: string): Promise<void> => {
    await api.post('/api/auth/forgot-password', { email });
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await api.post('/api/auth/reset-password', { token, newPassword });
  };

  const logout = () => {
    setUser(null);
    setAuthState(null);
    clearToken();
    clearRefreshToken();
  };

  const authContextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    loading,
    fetchUser,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
