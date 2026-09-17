/**
 * Short-lived GET cache + in-flight dedupe.
 * Cuts duplicate Azure round-trips when AuthGate, Sidebar, and pages
 * hit the same endpoints during navigation.
 */

const DEFAULT_TTL_MS = 30_000;
const cache = new Map();
const inflight = new Map();

function normalizeKey(endpoint) {
  return String(endpoint || "").trim();
}

export function getCachedGet(endpoint) {
  const key = normalizeKey(endpoint);
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return hit.data;
}

export function setCachedGet(endpoint, data, ttlMs = DEFAULT_TTL_MS) {
  const key = normalizeKey(endpoint);
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

export function invalidateGetCache(match) {
  if (!match) {
    cache.clear();
    return;
  }
  const needle = String(match);
  for (const key of cache.keys()) {
    if (key.includes(needle)) cache.delete(key);
  }
}

/**
 * Deduplicate concurrent identical GETs and optionally serve cache.
 */
export async function cachedGet(endpoint, fetcher, { ttlMs = DEFAULT_TTL_MS, bypass = false } = {}) {
  const key = normalizeKey(endpoint);
  if (!bypass) {
    const cached = getCachedGet(key);
    if (cached !== undefined) return cached;
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      setCachedGet(key, data, ttlMs);
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}
