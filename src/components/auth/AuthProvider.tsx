"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { User, AuthContextType } from '@/types';
import { setToken, clearToken, getToken, setRefreshToken, clearRefreshToken, getRefreshToken } from '@/lib/auth';
import { api } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setAuthState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const loadUserFromToken = useCallback(() => {
    setLoading(true);
    const storedToken = getToken();
    if (storedToken) {
      const decodedJwt = parseJwt(storedToken);
      if (decodedJwt && decodedJwt.exp * 1000 > Date.now()) {
        setUser({
          email: decodedJwt.sub,
          roles: decodedJwt.roles,
        });
        setAuthState(storedToken);
      } else {
        // Token expired or invalid
        clearToken();
        clearRefreshToken();
      }
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token: newToken, refreshToken, roles } = response;
    
    setToken(newToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    
    setUser({
      email: email, // Use the email from the form
      roles: roles,   // Use the roles from the API response
    });
    setAuthState(newToken);
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
    isAuthenticated: !!token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
