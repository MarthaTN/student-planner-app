// ============================================================
// TaskPulse — Type Definitions
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  theme: "dark" | "light" | "ocean" | "sunset";
  friends: string[];
  friendRequests: string[];
  joinedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed";
  isPublic: boolean;
  tags: string[];
  progress: number; // 0–100
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "reminder" | "friend" | "suggestion";
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DB {
  users: User[];
  tasks: Task[];
  notifications: Notification[];
}

export interface Session {
  userId: string;
  loginTime: string;
}