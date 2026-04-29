import { v4 as uuid } from 'uuid';
import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage';
import type { Session } from '@/types/auth';

export { getSession, clearSession };

type AuthResult = { ok: true; session: Session } | { ok: false; error: string };

export function signUp(email: string, password: string): AuthResult {
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: 'User already exists' };
  }
  const user = {
    id: uuid(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  const session: Session = { userId: user.id, email };
  saveSession(session);
  return { ok: true, session };
}

export function logIn(email: string, password: string): AuthResult {
  const user = getUsers().find(
    (u) => u.email === email && u.password === password
  );
  if (!user) return { ok: false, error: 'Invalid email or password' };
  const session: Session = { userId: user.id, email };
  saveSession(session);
  return { ok: true, session };
}

export function logOut(): void {
  clearSession();
}
