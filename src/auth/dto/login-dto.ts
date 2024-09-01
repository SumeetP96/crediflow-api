import { z } from 'zod';

export const signInSchema = z
  .object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
  })
  .required();

export type SignInDto = z.infer<typeof signInSchema>;
