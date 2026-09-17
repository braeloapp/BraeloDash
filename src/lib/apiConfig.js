/**
 * Admin API origin — from Braelo-web `.env.local` only:
 *   NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_BASE_URL
 *
 * Browser calls hit that absolute URL by default.
 * Set NEXT_PUBLIC_API_USE_PROXY=true only if you need the Next.js
 * same-origin rewrite (`/api-backend` → upstream) for CORS.
 */

export function getUpstreamApiUrl() {
  const fromEnv = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  ).trim();
  return fromEnv.replace(/\/$/, "");
}

function useProxy() {
  const flag = (process.env.NEXT_PUBLIC_API_USE_PROXY || "")
    .trim()
    .toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}

export function getApiBaseUrl() {
  const upstream = getUpstreamApiUrl();
  if (typeof window !== "undefined" && upstream && useProxy()) {
    return "/api-backend";
  }
  return upstream;
}

export default getApiBaseUrl;
