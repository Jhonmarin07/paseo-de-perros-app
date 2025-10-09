'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalkRequest extends DocumentData {
  id: string;
  petName?: string;
  ownerName?: string;
}

export function AvailableWalks() {
  const { user } = useUser();
  const [walks, setWalks] = useState<WalkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'walkRequests'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const walksData: WalkRequest[] = [];
      for (const walkDoc of querySnapshot.docs) {
        const walk = { id: walkDoc.id, ...walkDoc.data() } as WalkRequest;

        // Get pet and owner info
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
  }, []);

  const handleAccept = async (walkId: string) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para aceptar un paseo.' });
      return;
    }

    const walkDocRef = doc(db, 'walkRequests', walkId);

    try {
      await updateDoc(walkDocRef, {
        status: 'accepted',
        walkerId: user.uid,
      });
      toast({ title: '¡Paseo aceptado!', description: 'El paseo ha sido asignado a tu panel.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aceptar el paseo. Inténtalo de nuevo.' });
    }
  };

  if (loading) {
    return <div>Cargando paseos disponibles...</div>;
  }

  if (walks.length === 0) {
    return <p>No hay paseos disponibles en este momento.</p>;
  }

  return (
    <div className="space-y-4">
      {walks.map((walk) => (
        <Card key={walk.id}>
          <CardHeader>
            <CardTitle>Paseo para {walk.petName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Propietario:</strong> {walk.ownerName}</p>
            <p><strong>Fecha:</strong> {new Date(walk.date).toLocaleDateString()}</p>
            <p><strong>Duración:</strong> {walk.duration} minutos</p>
            {walk.notes && <p><strong>Notas:</strong> {walk.notes}</p>}
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleAccept(walk.id)}>Aceptar Paseo</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
