'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isBlogger: boolean;
  loading: boolean;
  login: (formData: Record<string, any>) => Promise<{ success: boolean; user?: User; error?: string }>;
  checkIsAdmin: () => boolean;
  checkIsBlogger: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlogger, setIsBlogger] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (token && role) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser({ role });
          setIsAdmin(role === 'ADMIN');
          setIsBlogger(role === 'BLOGGER');
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
          setIsAdmin(false);
          setIsBlogger(false);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (formData: Record<string, any>) => {
    try {
      const response = await axios.post(`${apiUrl}/api/login`, formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setIsAdmin(user.role === 'ADMIN');
      setIsBlogger(user.role === 'BLOGGER');

      return { success: true, user };
    } catch (error: any) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const checkIsAdmin = () => isAdmin;
  const checkIsBlogger = () => isBlogger;

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isBlogger, loading, login, checkIsAdmin, checkIsBlogger }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
