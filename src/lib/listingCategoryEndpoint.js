/** Map listing category labels → admin update URL segment. */
export const CATEGORY_ENDPOINTS = {
  Fashion: "fashion",
  fashion: "fashion",
  "Sports & Hobby": "sportshobby",
  "sports & hobby": "sportshobby",
  SportsHobby: "sportshobby",
  Furniture: "furniture",
  furniture: "furniture",
  Electronics: "electronics",
  electronics: "electronics",
  Jobs: "jobs",
  jobs: "jobs",
  Vehicles: "vehicles",
  vehicles: "vehicles",
  Kids: "kids",
  kids: "kids",
  Events: "events",
  events: "events",
  "Real Estate": "realestate",
  "real estate": "realestate",
  RealEstate: "realestate",
  Services: "services",
  services: "services",
};

/**
 * Resolve admin-panel category path segment for listing update/delete URLs.
 * Handles Title Case, lowercase, and spaced labels from the API.
 */
export function getCategoryEndpoint(category) {
  const raw = String(category || "").trim();
  if (!raw) return "";
  if (CATEGORY_ENDPOINTS[raw]) return CATEGORY_ENDPOINTS[raw];
  const lower = raw.toLowerCase();
  if (CATEGORY_ENDPOINTS[lower]) return CATEGORY_ENDPOINTS[lower];
  const match = Object.keys(CATEGORY_ENDPOINTS).find(
    (key) => key.toLowerCase() === lower
  );
  if (match) return CATEGORY_ENDPOINTS[match];
  return lower.replace(/\s+/g, "").replace(/&/g, "");
}
