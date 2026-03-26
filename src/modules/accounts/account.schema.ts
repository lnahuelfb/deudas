import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  color: z.string().min(1, "El color es requerido"),
  dueDay: z.number().int().min(1, "El día de cierre debe ser entre 1 y 31").max(31, "El día de cierre debe ser entre 1 y 31"),
  closingDay: z.number().int().min(1, "El día de vencimiento debe ser entre 1 y 31").max(31, "El día de vencimiento debe ser entre 1 y 31"),
});

export type Account = z.infer<typeof accountSchema>;