// utils/auth-utils.ts
import crypto from 'crypto';

// utils/auth-utils.ts
export type AuthHeaders = Record<string, string>;

export const generateAuthHeaders = (accessKey: string, secretKey: string): AuthHeaders => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const dataToSign = `${accessKey}|${timestamp}`;
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('hex');

  return {
    'Authorization': `Fo ${accessKey}:${signature}:${timestamp}`,
    'Content-Type': 'application/json'
  };
};