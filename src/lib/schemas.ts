import { z } from "zod";

export const PetSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  breed: z.string().min(2, { message: "La raza debe tener al menos 2 caracteres." }),
  age: z.string().refine(value => /^-?\d+$/.test(value) && parseInt(value) >= 0, { message: "La edad no puede ser negativa." }),
  energyLevel: z.enum(['low', 'medium', 'high'], { errorMap: () => ({ message: "Por favor, seleccione un nivel de energía." }) }),
  size: z.enum(['small', 'medium', 'large'], { errorMap: () => ({ message: "Por favor, seleccione un tamaño." }) }),
});

export type PetFormValues = z.infer<typeof PetSchema>;

export const WalkRequestSchema = z.object({
  petId: z.string({ required_error: "Por favor, seleccione una mascota." }),
  date: z.string().min(1, { message: "Por favor, seleccione una fecha." }),
  duration: z.string().min(1, { message: "Por favor, seleccione una duración." }),
  notes: z.string().optional(),
});

export type WalkRequestFormValues = z.infer<typeof WalkRequestSchema>;
