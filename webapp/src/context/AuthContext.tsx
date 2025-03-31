'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    favoriteCuisines: string[];
    favoriteNeighborhoods: string[];
    priceRange: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Sample user for demo purposes
const sampleUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  preferences: {
    favoriteCuisines: ['Italian', 'American'],
    favoriteNeighborhoods: ['West Village', 'SoHo'],
    priceRange: '$$'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test user credentials check
    if (email === 'test@example.com' && password === 'test') {
      setUser(sampleUser);
      localStorage.setItem('auth_user', JSON.stringify(sampleUser));
      return;
    }
    
    // For demo purposes, accept any other login too
    const newUser = {
      ...sampleUser,
      email,
      name: email.split('@')[0]
    };
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const signup = async (email: string, name: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new user based on inputs
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      preferences: {
        favoriteCuisines: ['American'],
        favoriteNeighborhoods: ['Midtown'],
        priceRange: '$$'
      }
    };
    
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  if (loading) {
    return null; // Don't render children until we've checked for a stored user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 