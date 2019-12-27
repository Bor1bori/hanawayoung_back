import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const privateKey = "mypassword";
const aesKey = crypto.randomBytes(32);

// jwt
export const jwtSign = (obj: any): string => {
  return jwt.sign(obj, privateKey);
};

export const jwtVerify = (token: string): string | any => {
  return jwt.verify(token, privateKey);
};

// crypt
export const hash = (plainText: string): string  => {
  return crypto.createHash('sha512').update(plainText).digest('base64');
};

export const aesEncrypt = (plainText: string) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, 'asdfqwerasdfqwer');
  let result = cipher.update(plainText, 'utf8', 'base64');
  result += cipher.final('base64');
  return result;
};

export const aesDecrypt = (encryptedText: string) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, 'asdfqwerasdfqwer');
    let result = decipher.update(encryptedText, 'base64', 'utf8'); 
    result += decipher.final('utf8'); 
    return result;
  } catch (err) {
    return null;
  }
};

export const randomAlphNum = (size: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < size; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;  
};
