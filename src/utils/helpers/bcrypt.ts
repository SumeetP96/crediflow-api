import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  plaintextPassword: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plaintextPassword, salt);
};

export const checkPassword = async (
  plaintextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};
