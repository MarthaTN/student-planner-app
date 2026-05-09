// ============================================================
// TaskPulse — DB Layer (localStorage-backed JSON store)
// ============================================================

import type { DB, User, Task, Notification, Session } from "./types.js";

const DB_KEY = "taskpulse_db";
const SESSION_KEY = "taskpulse_session";

// ── Seed data URL (relative) ──────────────────────────────
const SEED_URL = "db.json";

export async function initDB(): Promise<void> {
  if (localStorage.getItem(DB_KEY)) return;
  try {
    const res = await fetch(SEED_URL);
    const data: DB = await res.json();
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch {
    const empty: DB = { users: [], tasks: [], notifications: [] };
    localStorage.setItem(DB_KEY, JSON.stringify(empty));
  }
}

export function getDB(): DB {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return { users: [], tasks: [], notifications: [] };
  return JSON.parse(raw) as DB;
}

export function saveDB(db: DB): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Session ───────────────────────────────────────────────

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function setSession(userId: string): void {
  const session: Session = { userId, loginTime: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  const db = getDB();
  return db.users.find((u) => u.id === session.userId) ?? null;
}

// ── Users ─────────────────────────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return getDB().users.find((u) => u.email.trim().toLowerCase() === normalized);
}

export function createUser(
  name: string,
  email: string,
  password: string
): User {
  const db = getDB();
  const user: User = {
    id: "u" + Date.now(),
    name,
    email: email.trim().toLowerCase(),
    password,
    avatar: name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    theme: "dark",
    friends: [],
    friendRequests: [],
    joinedAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB(db);
  return user;
}

export function updateUser(updated: User): void {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    db.users[idx] = updated;
    saveDB(db);
  }
}

// ── Tasks ─────────────────────────────────────────────────

export function getTasksForUser(userId: string): Task[] {
  return getDB().tasks.filter((t) => t.userId === userId);
}

export function getPublicTasksForUser(userId: string): Task[] {
  return getDB()
    .tasks.filter((t) => t.userId === userId && t.isPublic);
}

export function createTask(task: Omit<Task, "id" | "createdAt">): Task {
  const db = getDB();
  const newTask: Task = {
    ...task,
    id: "t" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  db.tasks.push(newTask);
  saveDB(db);
  return newTask;
}

export function updateTask(updated: Task): void {
  const db = getDB();
  const idx = db.tasks.findIndex((t) => t.id === updated.id);
  if (idx !== -1) {
    db.tasks[idx] = updated;
    saveDB(db);
  }
}

export function deleteTask(taskId: string): void {
  const db = getDB();
  db.tasks = db.tasks.filter((t) => t.id !== taskId);
  saveDB(db);
}

// ── Notifications ─────────────────────────────────────────

export function getNotificationsForUser(userId: string): Notification[] {
  return getDB()
    .notifications.filter((n) => n.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function markNotificationRead(notifId: string): void {
  const db = getDB();
  const n = db.notifications.find((n) => n.id === notifId);
  if (n) {
    n.read = true;
    saveDB(db);
  }
}

export function markAllNotificationsRead(userId: string): void {
  const db = getDB();
  db.notifications
    .filter((n) => n.userId === userId)
    .forEach((n) => (n.read = true));
  saveDB(db);
}

export function addNotification(
  userId: string,
  type: Notification["type"],
  message: string
): void {
  const db = getDB();
  const notif: Notification = {
    id: "n" + Date.now(),
    userId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.push(notif);
  saveDB(db);
}

// ── Countdown helper ──────────────────────────────────────

export function getCountdown(dueDate: string): string {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff <= 0) return "Overdue!";
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ${hours % 24}h left`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ${days % 7}d left`;
}

export function isUrgent(dueDate: string): boolean {
  const diff = new Date(dueDate).getTime() - Date.now();
  return diff > 0 && diff < 48 * 3600000;
}