'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, DocumentData, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WalkRequest extends DocumentData {
  id: string;
  petName?: string;
  status: 'pending' | 'accepted' | 'completed';
}

// Mapeo de estados a texto y estilos
const statusMap = {
  pending: { text: 'Pendiente', variant: 'secondary' as const, className: '' },
  accepted: { text: 'Aceptado', variant: 'default' as const, className: 'bg-blue-500 text-white' },
  completed: { text: 'Completado', variant: 'default' as const, className: 'bg-green-500 text-white' },
};


export function WalkRequestList() {
  const { user } = useUser();
  const [walkRequests, setWalkRequests] = useState<WalkRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'walkRequests'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const requestsData: WalkRequest[] = [];
      for (const walkDoc of querySnapshot.docs) {
        const request = { id: walkDoc.id, ...walkDoc.data() } as WalkRequest;
        
        const petDocRef = doc(db, 'pets', request.petId);
        const petDoc = await getDoc(petDocRef);
        if (petDoc.exists()) {
          request.petName = petDoc.data().name;
        }

        requestsData.push(request);
      }
      // Ordenar por fecha, más recientes primero
      requestsData.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      setWalkRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>Cargando solicitudes...</div>;
  }

  if (walkRequests.length === 0) {
    return <p>No has solicitado ningún paseo.</p>;
  }

  return (
    <div className="space-y-4">
      {walkRequests.map((request) => {
        const statusInfo = statusMap[request.status] || { text: request.status, variant: 'destructive' as const, className: '' };
        return (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Paseo para {request.petName || 'mascota desconocida'}
                <Badge variant={statusInfo.variant} className={statusInfo.className}>
                  {statusInfo.text}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Fecha:</strong> {new Date(request.date).toLocaleDateString()}</p>
              <p><strong>Duración:</strong> {request.duration} minutos</p>
              {request.notes && <p><strong>Notas:</strong> {request.notes}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}
