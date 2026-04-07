/**
 * Session management utilities for QQ OAuth
 * Uses signed cookies for secure session handling
 */

const SESSION_COOKIE_NAME = 'tm_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface User {
  id: string;
  nickname: string;
  figure?: string;
  figureurl?: string;
  figureurl_qq_1?: string;
  gender?: string;
}

export interface Session {
  user: User;
  createdAt: number;
  expiresAt: number;
}

// Simple hash-based signing (in production, use crypto.subtle or a library like iron-session)
function createHmac(data: string, secret: string): string {
  let hash = 0;
  const combined = data + secret;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function signSession(session: Session, secret: string): string {
  const payload = JSON.stringify(session);
  const signature = createHmac(payload, secret);
  return Buffer.from(`${payload}|${signature}`).toString('base64');
}

export function verifySession(token: string, secret: string): Session | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const lastBarIndex = decoded.lastIndexOf('|');
    if (lastBarIndex === -1) return null;

    const payload = decoded.substring(0, lastBarIndex);
    const signature = decoded.substring(lastBarIndex + 1);

    const expectedSignature = createHmac(payload, secret);
    if (signature !== expectedSignature) return null;

    const session: Session = JSON.parse(payload);
    if (session.expiresAt < Date.now()) return null;

    return session;
  } catch {
    return null;
  }
}

export function createSessionCookie(session: Session, secret: string): string {
  const signed = signSession(session, secret);
  return `${SESSION_COOKIE_NAME}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE / 1000}`;
}

export function parseSessionCookie(cookieHeader: string | null, secret: string): Session | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!sessionCookie) return null;

  const token = sessionCookie.substring(SESSION_COOKIE_NAME.length + 1);
  return verifySession(token, secret);
}

export function createLogoutCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSessionFromRequest(request: Request, secret: string): Session | null {
  const cookieHeader = request.headers.get('cookie');
  return parseSessionCookie(cookieHeader, secret);
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE };
