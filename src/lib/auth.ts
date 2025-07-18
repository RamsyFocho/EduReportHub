"use client";

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'jwt_refresh_token';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};
  
export const setRefreshToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
};

export const clearRefreshToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};
