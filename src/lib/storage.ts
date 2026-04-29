import { STORAGE_KEYS } from './constants';
import type { User, Session } from '@/types/auth';
import type { Habit } from '@/types/habit';

const HABIT_CHANGE_EVENT = 'habit-store-update';

function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(HABIT_CHANGE_EVENT));
}

export const getUsers = (): User[] => read<User[]>(STORAGE_KEYS.USERS) ?? [];
export const saveUsers = (users: User[]) => write(STORAGE_KEYS.USERS, users);

export const getSession = (): Session | null =>
  read<Session>(STORAGE_KEYS.SESSION);
export const saveSession = (s: Session | null) =>
  write(STORAGE_KEYS.SESSION, s);
export const clearSession = () => saveSession(null);

export const getHabits = (): Habit[] =>
  read<Habit[]>(STORAGE_KEYS.HABITS) ?? [];
export const saveHabits = (habits: Habit[]) =>
  write(STORAGE_KEYS.HABITS, habits);

export { HABIT_CHANGE_EVENT };
