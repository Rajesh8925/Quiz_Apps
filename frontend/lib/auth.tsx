'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from './api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadUser(authToken: string) {
    try {
      const data = await authApi.getProfile();
      setUser(data);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      const data = await authApi.login({ username, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } | string };
      let errorMessage = 'Login failed';
      
      if (typeof error.data === 'string') {
        errorMessage = error.data;
      } else if (error.data && typeof error.data === 'object' && 'error' in error.data) {
        errorMessage = (error.data as { error?: string }).error || 'Login failed';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Handle common error cases
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('401')) {
        errorMessage = 'Invalid username or password';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Login service not available';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Server error, please try again later';
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string, passwordConfirm: string) => {
    try {
      setError(null);
      const data = await authApi.register({ username, email, password, password_confirm: passwordConfirm });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err: unknown) {
      const error = err as { data?: Record<string, string[]> };
      const errorMessage = error.data
        ? Object.values(error.data).flat().join(', ')
        : 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
