import bcrypt from 'bcrypt';

export const generateSalt = async () => {
  return await bcrypt.genSalt(12);
};

export const encryptPassword = async (plainText: string, salt: string) => {
  return await bcrypt.hash(plainText, salt);
};

export const isDecryptionValid = async (
  text: string,
  salt: string,
  hash: string,
) => {
  return (await encryptPassword(text, salt)) === hash;
};
