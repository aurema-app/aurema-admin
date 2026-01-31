'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiClient } from '@/lib/api';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Wait a bit for the token to be fully ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (!mounted) return;
          
          // Fetch user profile to check isStaff
          const profile = await apiClient<UserProfile>('/users/current');
          
          if (!mounted) return;
          
          if (!profile.isStaff) {
            // User is not staff, sign them out
            await firebaseSignOut(auth);
            if (mounted) {
              setUser(null);
              setUserProfile(null);
              setError('Access denied. Staff privileges required.');
              setLoading(false);
            }
          } else {
            if (mounted) {
              setUserProfile(profile);
              setError(null);
              setLoading(false);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          if (mounted) {
            await firebaseSignOut(auth);
            setUser(null);
            setUserProfile(null);
            setError('Failed to verify staff status');
            setLoading(false);
          }
        }
      } else {
        if (mounted) {
          setUserProfile(null);
          setError(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Profile will be loaded by onAuthStateChanged
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signOut, error }}>
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
