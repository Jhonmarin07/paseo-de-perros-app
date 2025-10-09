'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MyWalk extends DocumentData {
  id: string;
  petName?: string;
  ownerName?: string;
  status: 'accepted' | 'completed';
}

export function MyWalks() {
  const { user } = useUser();
  const [walks, setWalks] = useState<MyWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'walkRequests'), where('walkerId', '==', user.uid), where('status', 'in', ['accepted', 'completed']));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const walksData: MyWalk[] = [];
      for (const walkDoc of querySnapshot.docs) {
        const walk = { id: walkDoc.id, ...walkDoc.data() } as MyWalk;

        const petDocRef = doc(db, 'pets', walk.petId);
        const petDoc = await getDoc(petDocRef);
        if (petDoc.exists()) {
          walk.petName = petDoc.data().name;
        }

        const ownerDocRef = doc(db, 'users', walk.ownerId);
        const ownerDoc = await getDoc(ownerDocRef);
        if (ownerDoc.exists()) {
          walk.ownerName = ownerDoc.data().name;
        }

        walksData.push(walk);
      }
      setWalks(walksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleComplete = async (walkId: string) => {
    const walkDocRef = doc(db, 'walkRequests', walkId);

    try {
      await updateDoc(walkDocRef, {
        status: 'completed',
      });
      toast({ title: '¡Paseo completado!', description: 'Has marcado el paseo como completado.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo completar el paseo. Inténtalo de nuevo.' });
    }
  };

  if (loading) {
    return <div>Cargando mis paseos...</div>;
  }

  if (walks.length === 0) {
    return <p>No tienes paseos aceptados.</p>;
  }

  return (
    <div className="space-y-4">
      {walks.map((walk) => (
        <Card key={walk.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Paseo para {walk.petName}
              <Badge
                variant={walk.status === 'completed' ? 'default' : 'secondary'}
                className={walk.status === 'completed' ? 'bg-green-500 text-white' : ''}
              >
                {walk.status === 'completed' ? 'Completado' : 'Aceptado'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Propietario:</strong> {walk.ownerName}</p>
            <p><strong>Fecha:</strong> {new Date(walk.date).toLocaleDateString()}</p>
            <p><strong>Duración:</strong> {walk.duration} minutos</p>
            {walk.notes && <p><strong>Notas:</strong> {walk.notes}</p>}
          </CardContent>
          {walk.status === 'accepted' && (
            <CardFooter>
              <Button onClick={() => handleComplete(walk.id)}>Marcar como Completado</Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
