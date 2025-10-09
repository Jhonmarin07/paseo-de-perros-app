'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles: string[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Espera a que se cargue la información del usuario

    if (!user) {
      router.push('/'); // Redirige al inicio si no está autenticado
      return;
    }

    if (userProfile && !roles.includes(userProfile.role)) {
      router.push('/'); // Redirige si el rol no está permitido
    }
  }, [user, userProfile, loading, roles, router]);

  if (loading || !userProfile || !roles.includes(userProfile.role)) {
    // Muestra un loader o un mensaje mientras se verifica la autenticación
    return <div>Cargando...</div>; 
  }

  return <>{children}</>;
}
