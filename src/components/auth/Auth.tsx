'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Auth } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importar Select
import { useToast } from '@/hooks/use-toast';
import { FaGoogle } from 'react-icons/fa';

const RegisterSchema = z.object({
  name: z.string().min(3, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Email no válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  phone: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  address: z.string().min(5, { message: 'La dirección es requerida' }),
  role: z.enum(['propietario', 'paseador'], { message: 'Debes seleccionar un rol' }),
});

const LoginSchema = z.object({
  email: z.string().email({ message: 'Email no válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;
type LoginFormValues = z.infer<typeof LoginSchema>;

export function AuthComponent() {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm<RegisterFormValues | LoginFormValues>({
    resolver: zodResolver(isLogin ? LoginSchema : RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      ...( !isLogin && {
        name: '',
        phone: '',
        address: '',
        role: 'propietario',
      })
    },
  });

  const onSubmit = async (values: RegisterFormValues | LoginFormValues) => {
    try {
      if (isLogin) {
        const loginValues = values as LoginFormValues;
        await signInWithEmailAndPassword(auth, loginValues.email, loginValues.password);
        toast({ title: '¡Bienvenido de vuelta!', description: 'Has iniciado sesión correctamente.' });
      } else {
        const registerValues = values as RegisterFormValues;
        const userCredential = await createUserWithEmailAndPassword(auth, registerValues.email, registerValues.password);
        const user = userCredential.user;

        const userProfile = {
          name: registerValues.name,
          email: user.email,
          phone: registerValues.phone,
          address: registerValues.address,
          role: registerValues.role,
          status: registerValues.role === 'paseador' ? 'pendiente' : 'activo',
          createdAt: serverTimestamp(),
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        toast({ title: '¡Registro exitoso!', description: 'Tu cuenta ha sido creada.' });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
  // ... (el resto del componente sigue igual)

  return (
    <Card className="w-full max-w-md mx-auto">
       <CardHeader>
        <CardTitle>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
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
                        <Input placeholder="3001234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Chapinero, Bogotá" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiero ser</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="propietario">Propietario de Mascota</SelectItem>
                          <SelectItem value="paseador">Paseador de Perros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLogin ? 'Entrar' : 'Crear Cuenta'}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">O continuar con</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => { /* ... handleGoogleSignIn ... */ }}>
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>

        <p className="mt-6 text-center text-sm">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-primary hover:underline">
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
