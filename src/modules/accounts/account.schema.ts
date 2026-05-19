import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brand: z.string().optional().nullable(),
  color: z.string().min(1, "El color es requerido"),
  type: z.enum(["CREDIT_CARD", "PERSONAL", "BANK"]).default("CREDIT_CARD"),
  dueDay: z.number().int().min(1).max(31).optional().nullable(),
  closingDay: z.number().int().min(1).max(31).optional().nullable(),
});

export type Account = z.infer<typeof accountSchema>;