/**
 * Admin API origin.
 *
 * Set NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_API_BASE_URL) per environment.
 * Local: http://127.0.0.1:8000
 * Staging/production: the same backend host the mobile app uses.
 *
 * In the browser we prefer the same-origin `/api-backend` rewrite
 * (see next.config.mjs) so CORS preflight does not stall every GET.
 */

export function getUpstreamApiUrl() {
  const fromEnv = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  ).trim();
  return fromEnv.replace(/\/$/, "");
}

export function getApiBaseUrl() {
  const upstream = getUpstreamApiUrl();
  if (typeof window !== "undefined" && upstream) {
    return "/api-backend";
  }
  return upstream;
}

export default getApiBaseUrl;
