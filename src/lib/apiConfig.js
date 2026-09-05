/**
 * Admin API origin.
 *
 * Set NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_API_BASE_URL) per environment.
 * Local: http://127.0.0.1:8000
 * Staging/production: the same backend host the mobile app uses.
 */
const PRODUCTION_API_URL =
  "https://braelo-v1-bdaqhdc4c7d9fdb7.canadacentral-01.azurewebsites.net";

export function getApiBaseUrl() {
  const fromEnv = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  ).trim();
  const raw = fromEnv || PRODUCTION_API_URL;
  return raw.replace(/\/$/, "");
}

export default getApiBaseUrl;
