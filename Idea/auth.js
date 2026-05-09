// ============================================================
// TaskPulse — Auth Logic (compiled from auth.ts)
// ============================================================

import { findUserByEmail, createUser, setSession, clearSession, getCurrentUser } from "./db.js";

export function handleLogin(email, password) {
  if (!email || !password) {
    showAuthError("Please fill in all fields.");
    return false;
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    showAuthError("Invalid email or password.");
    return false;
  }

  setSession(user.id);
  window.location.href = "dashboard.html";
  return true;
}

export function handleSignup(name, email, password) {
  if (!name || !email || !password) {
    showAuthError("Please fill in all fields.");
    return false;
  }

  if (password.length < 6) {
    showAuthError("Password must be at least 6 characters.");
    return false;
  }

  const existing = findUserByEmail(email);
  if (existing) {
    showAuthError("An account with this email already exists.");
    return false;
  }

  const user = createUser(name, email, password);
  setSession(user.id);
  window.location.href = "dashboard.html";
  return true;
}

export function handleLogout() {
  clearSession();
  window.location.href = "index.html";
}

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function showAuthError(msg) {
  const el = document.getElementById("authError");
  if (el) {
    el.textContent = msg;
    el.style.display = "block";
    setTimeout(() => (el.style.display = "none"), 4000);
  }
}

window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
