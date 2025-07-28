import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    // Mock sign in - always successful for demo
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      user_metadata: {
        full_name: 'Demo User'
      }
    };
    setUser(mockUser);
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Mock sign up - always successful for demo
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      user_metadata: {
        full_name: fullName || 'Demo User'
      }
    };
    setUser(mockUser);
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mock_auth_user');
    navigate('/auth');
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('mock_auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mock_auth_user');
      }
    }
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}