/** Generic silhouette used when a user has no usable profile photo. */
export const DEFAULT_PROFILE_AVATAR = "/images/profile-avatar.svg";

/**
 * Legacy signup defaults that no longer exist on Azure Blob Storage (404).
 * Treat them as "no photo" so the UI can show the local placeholder.
 */
const DEAD_DEFAULT_AVATAR_MARKERS = [
  "braelos3.blob.core.windows.net/braelo/business_listings/Vehicles/8/profile-",
  "/report.png",
];

export function isUsableProfileImage(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  return !DEAD_DEFAULT_AVATAR_MARKERS.some((marker) =>
    lower.includes(marker.toLowerCase())
  );
}

/**
 * Return a displayable avatar URL. Falls back to the silhouette placeholder
 * when the stored value is missing or known-dead.
 */
export function resolveProfileAvatar(url) {
  if (!isUsableProfileImage(url)) return DEFAULT_PROFILE_AVATAR;
  return url.trim();
}
