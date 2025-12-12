import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for testing without Firebase
const DEMO_USER: User = {
  uid: 'demo-user-123',
  email: 'demo@niepale.app',
  displayName: 'Użytkownik Demo',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedIsDemo = await AsyncStorage.getItem('isDemo');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsDemo(storedIsDemo === 'true');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.signIn(email, password);
      setUser(userData);
      setIsDemo(false);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('isDemo', 'false');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.signUp(email, password, name);
      setUser(userData);
      setIsDemo(false);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('isDemo', 'false');
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsDemo = async () => {
    setIsLoading(true);
    try {
      setUser(DEMO_USER);
      setIsDemo(true);
      await AsyncStorage.setItem('user', JSON.stringify(DEMO_USER));
      await AsyncStorage.setItem('isDemo', 'true');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (!isDemo) {
        await authService.signOut();
      }
      setUser(null);
      setIsDemo(false);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isDemo');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemo,
        signIn,
        signUp,
        signOut,
        resetPassword,
        signInAsDemo,
      }}
    >
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
