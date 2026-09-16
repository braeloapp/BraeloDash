import { FormData as FormStructure } from "@/app/components/Listing/FormData";

const CATEGORY_FORM_KEYS = {
  Vehicles: "Vehicles",
  vehicles: "Vehicles",
  "Real Estate": "realestate",
  realestate: "realestate",
  Services: "services",
  services: "services",
  Events: "events",
  events: "events",
  Jobs: "jobs",
  jobs: "jobs",
  Electronics: "electronics",
  electronics: "electronics",
  Furniture: "furniture",
  furniture: "furniture",
  Fashion: "fashion",
  fashion: "fashion",
  Kids: "kids",
  kids: "kids",
  "Sports & Hobby": "sportsandhobby",
  sportsandhobby: "sportsandhobby",
  "Sports and Hobby": "sportsandhobby",
};

function resolveCategoryKey(category) {
  if (!category) return null;
  if (FormStructure[category]) return category;
  return CATEGORY_FORM_KEYS[category] || CATEGORY_FORM_KEYS[String(category).toLowerCase()] || null;
}

function resolveSubKey(categoryObj, subcategory) {
  if (!categoryObj || !subcategory) return null;
  const raw = String(subcategory).trim();
  const keys = Object.keys(categoryObj).filter((k) => k !== "commonFields");
  return (
    keys.find((k) => k === raw) ||
    keys.find((k) => k.toLowerCase() === raw.toLowerCase()) ||
    keys.find((k) => k.toLowerCase().replace(/[\s&]+/g, "") === raw.toLowerCase().replace(/[\s&]+/g, "")) ||
    null
  );
}

const SKIP_LISTING_VALUE_KEYS = new Set([
  "id",
  "listing_id",
  "user_id",
  "pictures",
  "listing_coordinates",
  "created_at",
  "updated_at",
  "is_saved",
  "is_active",
  "listing_clicks",
  "from_business",
  "originalData",
  "image",
  "icons",
  "status",
  "title", // often shown separately; still included via commonFields when present
]);

function humanizeFieldName(name) {
  return String(name)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Flatten FormData common + subcategory fields/chips into edit-form field defs.
 * Matches Flutter/backend listing keys used on add-listing.
 * Pass `listingValues` so any extra API keys on the listing also appear in edit.
 */
export function getEditFieldsForListing(
  category,
  subcategory,
  listingValues = null,
  { excludeLocation = false } = {}
) {
  const catKey = resolveCategoryKey(category);
  const categoryObj = catKey ? FormStructure[catKey] : null;
  if (!categoryObj) return [];

  const fields = [];
  const seen = new Set();

  const push = (field) => {
    if (!field?.name || field.name === "image" || seen.has(field.name)) return;
    if (excludeLocation && field.name === "location") return;
    seen.add(field.name);
    const options = Array.isArray(field.options) ? [...field.options] : field.options;
    // Keep current listing value selectable even if casing/alias differs
    if (
      listingValues &&
      options &&
      listingValues[field.name] != null &&
      listingValues[field.name] !== "" &&
      !options.includes(listingValues[field.name])
    ) {
      options.unshift(String(listingValues[field.name]));
    }
    fields.push({
      name: field.name,
      label: field.label || humanizeFieldName(field.name),
      type: field.type || "text",
      required: Boolean(field.required),
      options,
    });
  };

  push({ name: "category", label: "Category", type: "text", required: true });
  push({
    name: "subcategory",
    label: "Subcategory",
    type: "text",
    required: true,
  });

  (categoryObj.commonFields || []).forEach(push);

  const subKey = resolveSubKey(categoryObj, subcategory);
  const sub = subKey ? categoryObj[subKey] : null;
  (sub?.fields || []).forEach(push);
  (sub?.chips || []).forEach((chipGroup) => {
    push({
      name: chipGroup.name || chipGroup.label,
      label: chipGroup.label,
      type: "select",
      required: Boolean(chipGroup.required),
      options: chipGroup.options || [],
    });
  });

  if (!seen.has("keywords")) {
    push({
      name: "keywords",
      label: "Keywords (comma separated)",
      type: "text",
      required: false,
    });
  }

  // Surface any other populated API keys so edit matches detail/lookup
  if (listingValues && typeof listingValues === "object") {
    Object.keys(listingValues).forEach((key) => {
      if (seen.has(key) || SKIP_LISTING_VALUE_KEYS.has(key)) return;
      if (excludeLocation && key === "location") return;
      const value = listingValues[key];
      if (value == null || value === "") return;
      if (typeof value === "object" && !Array.isArray(value)) return;
      push({
        name: key,
        label: humanizeFieldName(key),
        type: Array.isArray(value) ? "text" : typeof value === "number" ? "number" : "text",
        required: false,
      });
    });
  }

  return fields;
}

/**
 * Build Update_data-style field list (union of all subcategories) for a category.
 */
export function getAllEditFieldsForCategory(category) {
  const catKey = resolveCategoryKey(category);
  const categoryObj = catKey ? FormStructure[catKey] : null;
  if (!categoryObj) return [];

  const fields = [];
  const seen = new Set();
  const push = (field, forceRequired) => {
    if (!field?.name || field.name === "image" || seen.has(field.name)) {
      if (field?.name && seen.has(field.name) && forceRequired) {
        const existing = fields.find((f) => f.name === field.name);
        if (existing && field.required) existing.required = true;
      }
      return;
    }
    seen.add(field.name);
    fields.push({
      name: field.name,
      label: field.label || field.name,
      type: field.type === "file" ? "text" : field.type || "text",
      required: Boolean(forceRequired ?? field.required),
      options: field.options,
    });
  };

  push({ name: "category", label: "Category", type: "text", required: true });
  push({ name: "subcategory", label: "Subcategory", type: "text", required: true });
  (categoryObj.commonFields || []).forEach((f) => push(f));

  Object.keys(categoryObj)
    .filter((k) => k !== "commonFields")
    .forEach((subKey) => {
      const sub = categoryObj[subKey] || {};
      (sub.fields || []).forEach((f) => push({ ...f, required: false }));
      (sub.chips || []).forEach((chipGroup) => {
        push({
          name: chipGroup.name || chipGroup.label,
          label: chipGroup.label,
          type: "select",
          required: false,
          options: chipGroup.options || [],
        });
      });
    });

  return fields;
}

export default getEditFieldsForListing;
