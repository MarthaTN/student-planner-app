// ============================================================
// TaskPulse — DB Layer (compiled from db.ts)
// ============================================================

const DB_KEY = "taskpulse_db";
const SESSION_KEY = "taskpulse_session";
const SEED_URL = "db.json";

const SEED_DATA = {
  users: [
    {
      id: "u1",
      name: "Demo Student",
      email: "demo@taskpulse.com",
      password: "demo123",
      avatar: "DS",
      theme: "dark",
      friends: ["u2"],
      friendRequests: [],
      joinedAt: "2025-01-01T00:00:00Z"
    },
    {
      id: "u2",
      name: "Anna Johnson",
      email: "anna@gmail.com",
      password: "pass123",
      avatar: "AJ",
      theme: "dark",
      friends: ["u1"],
      friendRequests: [],
      joinedAt: "2025-01-05T00:00:00Z"
    },
    {
      id: "u3",
      name: "Alex Johnson",
      email: "alex@gmail.com",
      password: "pass123",
      avatar: "AJ",
      theme: "dark",
      friends: ["u1"],
      friendRequests: [],
      joinedAt: "2025-01-05T00:00:00Z"
    },
    {
      id: "u4",
      name: "Shaun Johnson",
      email: "shaun@gmail.com",
      password: "pass123",
      avatar: "AJ",
      theme: "dark",
      friends: ["u1"],
      friendRequests: [],
      joinedAt: "2025-01-05T00:00:00Z"
    }
  ],
  tasks: [
    {
      id: "t1",
      userId: "u1",
      title: "Math Final Exam",
      subject: "Mathematics",
      description: "Chapters 1-8, focus on calculus and linear algebra",
      dueDate: "2026-05-10T09:00:00Z",
      priority: "high",
      status: "in-progress",
      isPublic: true,
      tags: ["exam", "math"],
      progress: 45,
      createdAt: "2026-04-20T10:00:00Z"
    },
    {
      id: "t2",
      userId: "u1",
      title: "CS Assignment 3",
      subject: "Computer Science",
      description: "Implement a binary search tree in TypeScript",
      dueDate: "2026-05-02T23:59:00Z",
      priority: "high",
      status: "in-progress",
      isPublic: true,
      tags: ["assignment", "coding"],
      progress: 70,
      createdAt: "2026-04-22T08:00:00Z"
    },
    {
      id: "t3",
      userId: "u1",
      title: "History Essay",
      subject: "History",
      description: "2000 word essay on the causes of WWI",
      dueDate: "2026-05-15T17:00:00Z",
      priority: "medium",
      status: "not-started",
      isPublic: false,
      tags: ["essay", "history"],
      progress: 0,
      createdAt: "2026-04-23T14:00:00Z"
    },
    {
      id: "t4",
      userId: "u1",
      title: "Physics Lab Report",
      subject: "Physics",
      description: "Write up results from the pendulum experiment",
      dueDate: "2026-05-05T12:00:00Z",
      priority: "medium",
      status: "in-progress",
      isPublic: true,
      tags: ["lab", "report"],
      progress: 30,
      createdAt: "2026-04-24T09:00:00Z"
    },
    {
      id: "t5",
      userId: "u2",
      title: "Biology Presentation",
      subject: "Biology",
      description: "Group presentation on cellular respiration",
      dueDate: "2026-05-08T10:00:00Z",
      priority: "high",
      status: "in-progress",
      isPublic: true,
      tags: ["presentation", "group"],
      progress: 60,
      createdAt: "2026-04-21T11:00:00Z"
    },
    {
      id: "t6",
      userId: "u2",
      title: "English Literature Quiz",
      subject: "English",
      description: "Quiz on Shakespeare's Hamlet Acts 1-3",
      dueDate: "2026-05-03T14:00:00Z",
      priority: "high",
      status: "not-started",
      isPublic: true,
      tags: ["quiz", "literature"],
      progress: 10,
      createdAt: "2026-04-25T16:00:00Z"
    }
  ],
  notifications: [
    {
      id: "n1",
      userId: "u1",
      type: "reminder",
      message: "CS Assignment 3 is due in 3 days!",
      read: false,
      createdAt: "2026-04-29T08:00:00Z"
    },
    {
      id: "n2",
      userId: "u1",
      type: "friend",
      message: "Alex Johnson completed their Biology Presentation!",
      read: false,
      createdAt: "2026-04-28T15:00:00Z"
    },
    {
      id: "n3",
      userId: "u1",
      type: "suggestion",
      message: "You have 3 tasks due this week. Consider starting History Essay today.",
      read: true,
      createdAt: "2026-04-27T09:00:00Z"
    }
  ]
};

function mergeSeedData(existing, seed) {
  const merged = {
    users: Array.isArray(existing.users) ? [...existing.users] : [],
    tasks: Array.isArray(existing.tasks) ? [...existing.tasks] : [],
    notifications: Array.isArray(existing.notifications) ? [...existing.notifications] : [],
  };

  seed.users?.forEach(seedUser => {
    if (!merged.users.some(u => u.id === seedUser.id)) {
      merged.users.push(seedUser);
    }
  });

  seed.tasks?.forEach(seedTask => {
    if (!merged.tasks.some(t => t.id === seedTask.id)) {
      merged.tasks.push(seedTask);
    }
  });

  seed.notifications?.forEach(seedNotif => {
    if (!merged.notifications.some(n => n.id === seedNotif.id)) {
      merged.notifications.push(seedNotif);
    }
  });

  return merged;
}

function safeParseDB(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return { users: [], tasks: [], notifications: [] };
  }
}

async function loadSeedData() {
  try {
    const res = await fetch(SEED_URL, { cache: "reload" });
    if (res.ok) {
      return await res.json();
    }
  } catch (fetchError) {
    // ignore and try dynamic import
  }

  try {
    const module = await import("./db.json", { assert: { type: "json" } });
    return module.default;
  } catch (importError) {
    return SEED_DATA;
  }
}

export async function initDB() {
  const existingRaw = localStorage.getItem(DB_KEY);
  const hasExisting = Boolean(existingRaw);
  const seedData = await loadSeedData();

  if (!hasExisting) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedData));
    return;
  }

  const existing = safeParseDB(existingRaw);
  const merged = mergeSeedData(existing, seedData);
  localStorage.setItem(DB_KEY, JSON.stringify(merged));
}

export function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return { users: [], tasks: [], notifications: [] };

  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    };
  } catch {
    localStorage.removeItem(DB_KEY);
    return { users: [], tasks: [], notifications: [] };
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Session ───────────────────────────────────────────────

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, loginTime: new Date().toISOString() }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const db = getDB();
  return db.users.find(u => u.id === session.userId) ?? null;
}

// ── Users ─────────────────────────────────────────────────

export function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return getDB().users.find(u => u.email.trim().toLowerCase() === normalized);
}

export function createUser(name, email, password) {
  const db = getDB();
  const user = {
    id: "u" + Date.now(),
    name,
    email: email.trim().toLowerCase(),
    password,
    avatar: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    theme: "dark",
    friends: [],
    friendRequests: [],
    joinedAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB(db);
  return user;
}

export function updateUser(updated) {
  const db = getDB();
  const idx = db.users.findIndex(u => u.id === updated.id);
  if (idx !== -1) { db.users[idx] = updated; saveDB(db); }
}

// ── Tasks ─────────────────────────────────────────────────

export function getTasksForUser(userId) {
  return getDB().tasks.filter(t => t.userId === userId);
}

export function getPublicTasksForUser(userId) {
  return getDB().tasks.filter(t => t.userId === userId && t.isPublic);
}

export function createTask(task) {
  const db = getDB();
  const newTask = { ...task, id: "t" + Date.now(), createdAt: new Date().toISOString() };
  db.tasks.push(newTask);
  saveDB(db);
  return newTask;
}

export function updateTask(updated) {
  const db = getDB();
  const idx = db.tasks.findIndex(t => t.id === updated.id);
  if (idx !== -1) { db.tasks[idx] = updated; saveDB(db); }
}

export function deleteTask(taskId) {
  const db = getDB();
  db.tasks = db.tasks.filter(t => t.id !== taskId);
  saveDB(db);
}

// ── Notifications ─────────────────────────────────────────

export function getNotificationsForUser(userId) {
  return getDB().notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationRead(notifId) {
  const db = getDB();
  const n = db.notifications.find(n => n.id === notifId);
  if (n) { n.read = true; saveDB(db); }
}

export function markAllNotificationsRead(userId) {
  const db = getDB();
  db.notifications.filter(n => n.userId === userId).forEach(n => n.read = true);
  saveDB(db);
}

export function addNotification(userId, type, message) {
  const db = getDB();
  db.notifications.push({
    id: "n" + Date.now(), userId, type, message, read: false,
    createdAt: new Date().toISOString()
  });
  saveDB(db);
}

// ── Helpers ───────────────────────────────────────────────

export function getCountdown(dueDate) {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff <= 0) return "Overdue!";
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ${hours % 24}h left`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ${days % 7}d left`;
}

export function isUrgent(dueDate) {
  const diff = new Date(dueDate).getTime() - Date.now();
  return diff > 0 && diff < 48 * 3600000;
}