import { z } from "zod";

export const SuggestWalkerSchema = z.object({
  dogBreed: z.string().min(2, { message: "La raza debe tener al menos 2 caracteres." }),
  dogEnergyLevel: z.enum(['low', 'medium', 'high'], { errorMap: () => ({ message: "Por favor, seleccione un nivel de energía." }) }),
  dogSize: z.enum(['small', 'medium', 'large'], { errorMap: () => ({ message: "Por favor, seleccione un tamaño." }) }),
  walkDuration: z.enum(['30', '60', '90'], { errorMap: () => ({ message: "Por favor, seleccione una duración." }) }),
  ownerPreferences: z.string().min(10, { message: "Las preferencias deben tener al menos 10 caracteres." }),
  location: z.string().min(3, { message: "La ubicación debe tener al menos 3 caracteres." }),
});

export type SuggestWalkerFormValues = z.infer<typeof SuggestWalkerSchema>;

export const BecomeWalkerSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor, ingrese un email válido." }),
    phone: z.string().min(8, { message: "El teléfono debe tener al menos 8 caracteres." }),
    experience: z.string().min(2, { message: "La experiencia debe tener al menos 2 caracteres." }),
});

export type BecomeWalkerFormValues = z.infer<typeof BecomeWalkerSchema>;