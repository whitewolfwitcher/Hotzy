import crypto from 'crypto';
import { getOrderUploadTokenSecret } from '@/lib/env';

const base64Url = (input: Buffer) =>
  input
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const timingSafeEqual = (a: string, b: string) => {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
};

export const createOrderUploadToken = (
  orderId: string,
  expiresInSeconds = 15 * 60
) => {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `${orderId}.${expiresAt}`;
  const signature = base64Url(
    crypto.createHmac('sha256', getOrderUploadTokenSecret()).update(payload).digest()
  );
  return `${payload}.${signature}`;
};

export const verifyOrderUploadToken = (
  token: string,
  orderId: string
) => {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [tokenOrderId, expiresAtRaw, signature] = parts;
  if (tokenOrderId !== orderId) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${tokenOrderId}.${expiresAt}`;
  const expected = base64Url(
    crypto.createHmac('sha256', getOrderUploadTokenSecret()).update(payload).digest()
  );
  return timingSafeEqual(signature, expected);
};
