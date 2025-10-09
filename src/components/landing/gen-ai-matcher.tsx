'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, UserCheck } from 'lucide-react';

import { SuggestWalkerSchema, type SuggestWalkerFormValues } from '@/lib/types';
import { getWalkerSuggestion } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

export function GenAiMatcher() {
  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<SuggestWalkerFormValues>({
    resolver: zodResolver(SuggestWalkerSchema),
    defaultValues: {
      dogBreed: '',
      dogEnergyLevel: undefined,
      dogSize: undefined,
      ownerPreferences: '',
      location: '',
      walkDuration: undefined,
    },
  });

  const onSubmit = (values: SuggestWalkerFormValues) => {
    setSuggestion(null);
    startTransition(async () => {
      const result = await getWalkerSuggestion(values);
      if (result.success) {
        setSuggestion(result.suggestion ?? null);
        const basePrice = values.walkDuration === '30' ? 15 : values.walkDuration === '60' ? 25 : 35;
        const sizeMultiplier = values.dogSize === 'small' ? 1 : values.dogSize === 'medium' ? 1.2 : 1.5;
        setPrice(basePrice * sizeMultiplier);
      } else {
        toast({
          variant: "destructive",
          title: "Error de IA",
          description: result.error,
        });
      }
    });
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
              <Sparkles className="w-8 h-8 inline-block mr-2 text-primary" />
              Encuentra el Paseador Perfecto con IA
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Utiliza nuestro algoritmo de coincidencia patentado para localizar al paseador de perros perfecto. Simplemente ingrese las características de su perro y las preferencias del dueño para comenzar.
            </p>
            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle>Detalles de tu Mascota</CardTitle>
                <CardDescription>Completa el formulario para recibir una sugerencia personalizada.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dogBreed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Raza del Perro</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Golden Retriever" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ubicación</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Palermo, Buenos Aires" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dogEnergyLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nivel de Energía</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un nivel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Bajo</SelectItem>
                                <SelectItem value="medium">Medio</SelectItem>
                                <SelectItem value="high">Alto</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dogSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamaño del Perro</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un tamaño" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">Pequeño</SelectItem>
                                <SelectItem value="medium">Mediano</SelectItem>
                                <SelectItem value="large">Grande</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="walkDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duración del Paseo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una duración" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30">30 minutos</SelectItem>
                              <SelectItem value="60">60 minutos</SelectItem>
                              <SelectItem value="90">90 minutos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferencias del Dueño</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe qué buscas en un paseador..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Obtener Sugerencia
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 lg:mt-0">
            {isPending && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 bg-card rounded-lg shadow-lg">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground">Buscando el paseador ideal...</h3>
                <p className="text-muted-foreground mt-2 text-center">Nuestra IA está analizando los perfiles.</p>
              </div>
            )}
            {suggestion && !isPending && (
              <Card className="bg-accent/50 shadow-xl border-primary/50 animate-in fade-in-50 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="w-6 h-6 mr-2 text-primary"/>
                    ¡Paseador Recomendado!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-foreground">{suggestion}</p>
                  {price && <p className="text-lg text-foreground font-bold mt-4">Precio: ${price.toFixed(2)}</p>}
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Contactar a este Paseador</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
