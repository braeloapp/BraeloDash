/**
 * Normalize list payloads from getData() — axios already returns response.data,
 * but backends vary: { data: { results } }, { results }, { data: [] },
 * or dict-keyed maps like { data: { "<id>": listing, ... } } (user/all, get-save).
 */
export function extractResultsList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const nested = payload.data?.results ?? payload.results;
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;

  // Dict-keyed listing maps (admin user listings / saved items)
  const dictCandidate =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    payload.data.results === undefined
      ? payload.data
      : payload && typeof payload === "object" && !Array.isArray(payload)
        ? payload
        : null;

  if (dictCandidate) {
    const values = Object.values(dictCandidate).filter(
      (item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        (item.id != null ||
          item.listing_id != null ||
          item.title != null ||
          item.pictures != null)
    );
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
