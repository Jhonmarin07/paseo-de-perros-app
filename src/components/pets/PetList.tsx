'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PetList() {
  const { user } = useUser();
  const [pets, setPets] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'pets'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsData: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        petsData.push({ id: doc.id, ...doc.data() });
      });
      setPets(petsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>Cargando mascotas...</div>;
  }

  if (pets.length === 0) {
    return <p>No tienes mascotas registradas.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pets.map((pet) => (
        <Card key={pet.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {pet.name} <Badge variant={
                pet.energyLevel === 'low' ? 'default' : 
                pet.energyLevel === 'medium' ? 'secondary' : 'destructive'
              }>{pet.energyLevel}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Raza:</strong> {pet.breed}</p>
            <p><strong>Edad:</strong> {pet.age} años</p>
            <p><strong>Tamaño:</strong> {pet.size}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
