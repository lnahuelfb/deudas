import {z} from 'zod';

export const debtSchema = z.object({
  title: z.string().min(1, "El nombre es requerido"),
  category: z.string().optional(),
  totalAmount: z.number().positive("El monto total debe ser un número positivo"),
  totalInstallments: z.number().int().positive("Las cuotas deben ser un número entero positivo").default(1),
  amountPerMonth: z.number().positive("El monto debe ser un número positivo"),
  isSubscription: z.boolean(),
  accountId: z.string().min(1, "La cuenta es requerida")
});

export type Debt = z.infer<typeof debtSchema>;