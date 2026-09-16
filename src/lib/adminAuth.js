import { resolveProfileAvatar } from "@/lib/avatar";

/** Admin account photo used in the sidebar + Admin Profile. */
export const ADMIN_DEFAULT_AVATAR = "/images/profile (1).png";

/**
 * Admin profile prefers the branded admin photo when no real upload exists.
 * User detail pages should use `resolveProfileAvatar` (silhouette fallback).
 */
export function resolveAdminAvatar(url) {
  if (!url || typeof url !== "string" || !url.trim()) {
    return ADMIN_DEFAULT_AVATAR;
  }
  const resolved = resolveProfileAvatar(url);
  // Dead Azure defaults resolve to the user silhouette; for admin UI keep the
  // dedicated admin photo instead.
  if (resolved === "/images/profile-avatar.svg") {
    return ADMIN_DEFAULT_AVATAR;
  }
  return resolved;
}

const SESSION_COOKIE = "braelo_admin_session";

export function setAdminSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=1; Path=/; SameSite=Lax; Max-Age=604800`;
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("admin_role");
  localStorage.removeItem("admin_name");
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function persistAdminSession({ token, role, name }) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("token", token);
  if (role) localStorage.setItem("admin_role", role);
  if (name) localStorage.setItem("admin_name", name);
  setAdminSessionCookie();
}

export function adminRoleLabel(role) {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Administrator";
  return "Administrator";
}
