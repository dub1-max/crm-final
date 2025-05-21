import { z } from "zod";

export const createCustomerSchema = z.object({
  company: z.string().min(1),
  primaryContact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  phone: z.string().min(1),
  active: z.boolean(),
  groups: z.array(z.string()).optional(),
});

export const importCustomerSchema = z.array(createCustomerSchema);
