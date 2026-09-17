import { getApiBaseUrl } from "@/lib/apiConfig";
import { getAdminToken, persistAdminSession } from "@/lib/adminAuth";
import { cachedGet, invalidateGetCache } from "@/lib/apiCache";

const ME_ENDPOINT = "/admin-panel/me";

/**
 * Single shared /me fetch for AuthGate + Sidebar (cached 60s).
 */
export async function fetchAdminMe({ bypass = false } = {}) {
  const token = getAdminToken();
  if (!token) return null;

  return cachedGet(
    ME_ENDPOINT,
    async () => {
      const response = await fetch(`${getApiBaseUrl()}${ME_ENDPOINT}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401 || response.status === 403) {
        const err = new Error("Unauthorized");
        err.status = response.status;
        throw err;
      }
      if (!response.ok) {
        const err = new Error("Me request failed");
        err.status = response.status;
        throw err;
      }
      const payload = await response.json();
      const data = payload?.data || payload;
      const nextRole =
        data?.role === "super_admin" || data?.is_superuser
          ? "super_admin"
          : "admin";
      persistAdminSession({
        token,
        role: nextRole,
        name: data?.name,
      });
      return data;
    },
    { ttlMs: 60_000, bypass }
  );
}

export function invalidateAdminMe() {
  invalidateGetCache(ME_ENDPOINT);
}
