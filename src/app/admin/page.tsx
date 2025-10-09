'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { functions, db } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Definimos la interfaz para el objeto de usuario
interface User {
  id: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'superadmin' | 'paseador' | 'propietario';
  status?: 'pendiente' | 'verificado';
  [key: string]: any; // Para otras propiedades que puedan venir de la base de datos
}

const AdminDashboard = () => {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!loading && userProfile && (userProfile.role === 'admin' || userProfile.role === 'superadmin')) {
      const fetchUsers = async () => {
        const usersCollection = await getDocs(collection(db, 'users'));
        setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      };
      fetchUsers();
    }
  }, [loading, userProfile]);

  const handleVerifyWalker = async (uid: string) => {
    const verifyWalkerFunction = httpsCallable(functions, 'verifyWalker');
    try {
      await verifyWalkerFunction({ uid });
      toast({ title: 'Paseador verificado', description: 'El estado del paseador ha sido actualizado.' });
      // Actualizar la lista de usuarios para reflejar el cambio
      setUsers(users.map(u => u.id === uid ? { ...u, status: 'verificado' } : u));
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || (userProfile?.role !== 'admin' && userProfile?.role !== 'superadmin')) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      <p className="text-lg mb-8">Bienvenido, {userProfile?.name}.</p>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.role === 'paseador' && u.status === 'pendiente' && (
                    <Button onClick={() => handleVerifyWalker(u.id)}>Verificar</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
