import { z } from 'zod';

export const signInSchema = z
  .object({
    username: z.string().min(4).max(20),
    password: z.string().min(6).max(40),
  })
  .required();

export type SignInDto = z.infer<typeof signInSchema>;
