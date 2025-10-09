'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { BecomeWalkerSchema, type BecomeWalkerFormValues } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function BecomeWalkerForm() {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<BecomeWalkerFormValues>({
    resolver: zodResolver(BecomeWalkerSchema),
    defaultValues: {
        name: '',
        email: '',
        phone: '',
        experience: '',
    },
  });

  const onSubmit = async (values: BecomeWalkerFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error', 
        description: 'Debes iniciar sesión para registrarte como paseador.',
      });
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { ...values, role: 'paseador' });
      toast({
          title: "¡Registrado!",
          description: "Gracias por registrarte como paseador. Tu rol ha sido actualizado.",
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                <Sparkles className="w-8 h-8 inline-block mr-2 text-primary" />
                Conviértete en Paseador
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                Completa el formulario para registrarte como paseador de perros. Nos pondremos en contacto contigo en breve.
                </p>
                <Card className="mt-8 shadow-lg">
                <CardHeader>
                    <CardTitle>Regístrate como Paseador</CardTitle>
                    <CardDescription>Completa el formulario para comenzar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Juan Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: juan.perez@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 11-2233-4455" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Experiencia</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 5 años de experiencia" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Registrarse
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}
