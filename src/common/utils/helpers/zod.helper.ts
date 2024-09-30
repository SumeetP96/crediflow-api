import { ZodIssue } from 'zod';

export interface ICustomZodIssue {
  issues: ZodIssue[];
}

export const customFieldIssue = <T = Record<string, any>>(
  path: keyof T,
  message: string,
  exceptionMessage?: string,
): ICustomZodIssue => {
  return {
    issues: [
      {
        code: 'custom',
        path: [path as string],
        message,
      },
    ],
    ...(exceptionMessage ? { message: exceptionMessage } : {}),
  };
};
