import {z} from 'zod';

export const debtSchema = z.object({
  title: z.string().min(1, "El nombre es requerido"),
  category: z.string().optional(),
  totalAmount: z.number().positive("El monto total debe ser un número positivo"),
  totalInstallments: z.number().int().positive("Las cuotas deben ser un número entero positivo").default(1),
  amountPerMonth: z.number().positive("El monto debe ser un número positivo"),
  isSubscription: z.boolean(),
  initialPaidInstallments: z.number().int().min(0, "Las cuotas pagadas no pueden ser negativas").default(0),
  payments: z.array(z.object({
    amount: z.number().positive("El monto del pago debe ser un número positivo"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), "La fecha debe ser una cadena de texto con formato de fecha válida")
  })).optional(),
  accountId: z.string().min(1, "La cuenta es requerida")
});

export type Debt = z.infer<typeof debtSchema>;