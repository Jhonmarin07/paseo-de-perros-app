'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'propietario' | 'paseador' | 'admin' | 'superadmin';
  name?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  documentURL?: string;
  backgroundCheckURL?: string;
  status?: 'activo' | 'pendiente' | 'rechazado' | 'desactivado';
  createdAt?: Timestamp;
  createdBy?: string;
  permissions?: string[];
}

export function useUser() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setLoading(false);
      setUserProfile(null);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserProfile({ uid: doc.id, ...doc.data() } as UserProfile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  return { user, userProfile, loading };
}
