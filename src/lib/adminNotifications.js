const READ_KEY = "braelo_admin_read_notifications";
export const NOTIFICATIONS_CHANGED = "braelo-notifications-changed";

export function getLocallyReadIds() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw.map(String) : []);
  } catch {
    return new Set();
  }
}

function persistReadIds(ids) {
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
}

export function markNotificationLocallyRead(id) {
  if (id == null || id === "") return;
  const ids = getLocallyReadIds();
  ids.add(String(id));
  persistReadIds(ids);
}

export function markNotificationLocallyUnread(id) {
  if (id == null || id === "") return;
  const ids = getLocallyReadIds();
  ids.delete(String(id));
  persistReadIds(ids);
}

export function isNotificationUnread(notif) {
  const apiId = notif?.id ?? notif?._id ?? notif?.apiId;
  if (notif?.is_read) return false;
  if (apiId == null) return !notif?.is_read;
  return !getLocallyReadIds().has(String(apiId));
}

export function countUnread(list = []) {
  return list.filter((item) => item.unread ?? isNotificationUnread(item)).length;
}
