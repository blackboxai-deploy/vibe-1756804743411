import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface User {
  id: number;
  clinic_id: number;
  username: string;
  email: string;
  phone: string;
  full_name: string;
  role: 'owner' | 'reception' | 'doctor' | 'pharmacy' | 'accountant';
  is_active: boolean;
}

export interface JWTPayload {
  userId: number;
  clinicId: number;
  username: string;
  role: string;
  exp: number;
}

// Sign JWT token
export async function signJWT(payload: Omit<JWTPayload, 'exp'>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Get current user from cookies
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }

    // Get user from database
    const db = getDb();
    const user = db.prepare(`
      SELECT id, clinic_id, username, email, phone, full_name, role, is_active
      FROM users 
      WHERE id = ? AND is_active = 1
    `).get(payload.userId) as User | undefined;

    return user || null;
  } catch (error) {
    console.error('Get current user failed:', error);
    return null;
  }
}

// Authenticate user
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const db = getDb();
    const user = db.prepare(`
      SELECT id, clinic_id, username, email, phone, full_name, role, is_active, password_hash
      FROM users 
      WHERE username = ? AND is_active = 1
    `).get(username) as (User & { password_hash: string }) | undefined;

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    // Remove password_hash from returned user
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

// Create session cookie
export async function createSession(user: User) {
  const token = await signJWT({
    userId: user.id,
    clinicId: user.clinic_id,
    username: user.username,
    role: user.role
  });

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return token;
}

// Clear session
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Audit log helper
export function createAuditLog(
  clinicId: number,
  userId: number | null,
  action: string,
  entityType: string,
  entityId: number | null,
  oldValues: any = null,
  newValues: any = null,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (clinic_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      clinicId,
      userId,
      action,
      entityType,
      entityId,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
      ipAddress || null,
      userAgent || null
    );
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

// Middleware helper for API routes
export async function requireAuth(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                req.headers.get('cookie')?.match(/auth-token=([^;]+)/)?.[1];

  if (!token) {
    throw new Error('Authentication required');
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    throw new Error('Invalid token');
  }

  const db = getDb();
  const user = db.prepare(`
    SELECT id, clinic_id, username, email, phone, full_name, role, is_active
    FROM users 
    WHERE id = ? AND is_active = 1
  `).get(payload.userId) as User | undefined;

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}