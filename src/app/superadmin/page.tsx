'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { functions, db } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const SuperAdminDashboard = () => {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!loading && userProfile?.role === 'superadmin') {
      const fetchUsers = async () => {
        const usersCollection = await getDocs(collection(db, 'users'));
        setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      };
      fetchUsers();
    }
  }, [loading, userProfile]);

  const handleSetRole = async (uid: string, newRole: string) => {
    const setUserRoleFunction = httpsCallable(functions, 'setUserRole');
    try {
      await setUserRoleFunction({ uid, newRole });
      toast({ title: 'Rol actualizado', description: `El rol del usuario ha sido cambiado a ${newRole}.` });
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole as User['role'] } : u));
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || userProfile?.role !== 'superadmin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Super Administrador</h1>
      {/* ... (resto del componente similar al de Admin, pero con cambio de rol) */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select defaultValue={u.role} onValueChange={(newRole) => handleSetRole(u.id, newRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="propietario">Propietario</SelectItem>
                      <SelectItem value="paseador">Paseador</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{u.status}</td>
                 {/* ... (acciones como en el de Admin) */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
