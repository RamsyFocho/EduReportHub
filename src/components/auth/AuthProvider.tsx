"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { User, AuthContextType } from '@/types';
import { setToken, clearToken, getToken } from '@/lib/auth';
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
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post('/auth/login', { username: email, password });
    const { token: newToken } = response;
    setToken(newToken);
    const decodedJwt = parseJwt(newToken);
    setUser({
      email: decodedJwt.sub,
      roles: decodedJwt.roles,
    });
    setAuthState(newToken);
  };

  const logout = () => {
    setUser(null);
    setAuthState(null);
    clearToken();
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
