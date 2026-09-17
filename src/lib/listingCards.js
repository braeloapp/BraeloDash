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

/**
 * Resolve display money from category-specific fields.
 * Services → service_fee, Events → ticket_price, Jobs → salary_range,
 * else → price.
 */
export function listingPriceValue(listing) {
  if (!listing || typeof listing !== "object") return null;
  const candidates = [
    listing.price,
    listing.service_fee,
    listing.ticket_price,
    listing.salary_range,
    listing.salary,
  ];
  for (const value of candidates) {
    if (value == null || value === "") continue;
    return value;
  }
  return null;
}

export function formatListingPrice(listing) {
  const value = listingPriceValue(listing);
  if (value == null || value === "") return "";
  // Jobs salary_range is often a free-text band (e.g. "$40k-$50k")
  if (
    listing?.salary_range != null &&
    listing.salary_range !== "" &&
    (listing.price == null || listing.price === "") &&
    (listing.service_fee == null || listing.service_fee === "") &&
    (listing.ticket_price == null || listing.ticket_price === "")
  ) {
    const asNum = Number(listing.salary_range);
    if (!Number.isFinite(asNum)) return String(listing.salary_range);
  }
  const num = Number(value);
  if (Number.isFinite(num)) return `$${num.toFixed(2)}`;
  return String(value);
}
