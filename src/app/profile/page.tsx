'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Nombre:</strong> {userProfile?.name}</p>
          <p><strong>Email:</strong> {userProfile?.email}</p>
          <p><strong>Teléfono:</strong> {userProfile?.phone}</p>
          <p><strong>Dirección:</strong> {userProfile?.address}</p>
          <p><strong>Rol:</strong> <span className="capitalize">{userProfile?.role}</span></p>
          <p><strong>Estado:</strong> <span className="capitalize">{userProfile?.status}</span></p>
          {userProfile?.role === 'paseador' && userProfile?.status === 'pendiente' && (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-bold">En revisión</p>
              <p>Tu perfil de paseador está siendo revisado por nuestros administradores. Te notificaremos cuando sea aprobado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
