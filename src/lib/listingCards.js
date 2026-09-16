/**
 * Shared listing card / detail helpers for admin listing tabs.
 */

export function listingIdFrom(listing) {
  if (!listing || typeof listing !== "object") return "";
  const raw = listing.listing_id ?? listing.id ?? listing._id ?? "";
  return raw == null ? "" : String(raw);
}

export function shortListingId(listing) {
  const id = listingIdFrom(listing);
  if (!id) return "N/A";
  return id.slice(0, 8).toUpperCase();
}

export function formatListingPrice(listing) {
  if (!listing || typeof listing !== "object") return "";
  if (listing.salary_range) return String(listing.salary_range);
  if (listing.price == null || listing.price === "") return "";
  const num = Number(listing.price);
  if (Number.isFinite(num)) return `$${num.toFixed(2)}`;
  return String(listing.price);
}
