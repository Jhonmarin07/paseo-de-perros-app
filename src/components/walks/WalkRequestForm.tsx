'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WalkRequestSchema, WalkRequestFormValues } from '@/lib/schemas';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

interface WalkRequestFormProps {
  onWalkRequested?: () => void;
}

export function WalkRequestForm({ onWalkRequested }: WalkRequestFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [pets, setPets] = useState<{ id: string; name: string; }[]>([]);
  const form = useForm<WalkRequestFormValues>({
    resolver: zodResolver(WalkRequestSchema),
    defaultValues: {
      petId: '',
      date: '',
      duration: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (user) {
      const fetchPets = async () => {
        const q = query(collection(db, 'pets'), where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userPets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string; name: string; }));
        setPets(userPets);
      };
      fetchPets();
    }
  }, [user]);

  const onSubmit = async (values: WalkRequestFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para solicitar un paseo.' });
      return;
    }

    try {
      await addDoc(collection(db, 'walkRequests'), {
        ...values,
        ownerId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast({ title: '¡Solicitud enviada!', description: 'Tu solicitud de paseo ha sido enviada.' });
      form.reset();
      if (onWalkRequested) {
        onWalkRequested();
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="petId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mascota</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una mascota" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pets.map(pet => (
                    <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha del Paseo</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (en minutos)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Adicionales</FormLabel>
              <FormControl>
                <Textarea placeholder="Ej: Mi perro es muy amigable con otros perros." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Solicitar Paseo</Button>
      </form>
    </Form>
  );
}
