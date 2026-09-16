/**
 * Normalize list payloads from getData() — axios already returns response.data,
 * but backends vary:
 * - { data: { results: [] } }  (DRF pagination)
 * - { results: [] }
 * - { data: [] }
 * - { data: { "<id>": listing, ... } }  (admin user/all + get-save)
 */
export function extractResultsList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const nested = payload.data?.results ?? payload.results;
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;

  // Dict-keyed listing maps (user/all, get-save)
  const dict =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    payload.data.results == null
      ? payload.data
      : payload && typeof payload === "object" && !Array.isArray(payload)
        ? payload
        : null;

  if (dict && typeof dict === "object") {
    const reserved = new Set([
      "count",
      "next",
      "previous",
      "results",
      "page_size",
      "status",
      "message",
      "error",
    ]);
    const values = Object.entries(dict)
      .filter(([key, value]) => {
        if (reserved.has(key)) return false;
        return value && typeof value === "object" && !Array.isArray(value);
      })
      .map(([, value]) => value);
    if (values.length) return values;
  }

  return [];
}

/** Human-readable API error for axios errors */
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const d = error?.response?.data;
  if (!d) return error?.message || fallback;
  if (typeof d.detail === "string") return d.detail;
  if (Array.isArray(d.detail)) {
    const first = d.detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) return first.msg;
  }
  if (d.message) return d.message;
  if (typeof d === "string") return d;
  return fallback;
}
