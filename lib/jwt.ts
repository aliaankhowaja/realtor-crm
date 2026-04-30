import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
);
const alg = 'HS256';

export interface JWTPayload {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

export async function signToken(payload: JWTPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
