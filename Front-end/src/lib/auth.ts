
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
};

export type LoginCredentials = {
  email: string;
  password: string;
  role?: 'student' | 'instructor' | 'admin';
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  specialization?: string;
  isSpecialist?: boolean;
  departmentId?: number;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (data: RegisterData, role: 'student' | 'instructor' | 'admin') => Promise<void>;
  logout: () => void;
};

export const useAuth = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (credentials) => {
        try {
          const response = await api.post('http://localhost:4002/api/auth/login', credentials);
          const { token, data } = response.data;
          
          set({
            isAuthenticated: true,
            user: data,
            token,
          });
          
          localStorage.setItem('token', token);
          return data; // Return data including role for redirection
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      register: async (data, role) => {
        try {
          const response = await api.post(`/auth/register/${role}`, data);
          const { token, data: userData } = response.data;
          
          set({
            isAuthenticated: true,
            user: userData,
            token,
          });
          
          localStorage.setItem('token', token);
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
