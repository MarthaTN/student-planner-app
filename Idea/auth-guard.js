// ============================================================
// TaskPulse — Auth Guard
// ============================================================

import { getCurrentUser } from "./db.js";

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

export { getCurrentUser };
