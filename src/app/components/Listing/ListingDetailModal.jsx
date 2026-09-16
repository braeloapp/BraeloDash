"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import {
  formatListingPrice,
  listingIdFrom,
  shortListingId,
} from "@/lib/listingCards";
import { getEditFieldsForListing } from "@/lib/listingFormFields";

function MetaRow({ label, value, showEmpty = false }) {
  const empty = value == null || value === "";
  if (empty && !showEmpty) return null;
  return (
    <div className="listing-detail-meta">
      <span className="listing-detail-meta__label">{label}</span>
      <span
        className={`listing-detail-meta__value${empty ? " listing-detail-meta__value--empty" : ""}`}
      >
        {empty ? "Not specified" : String(value)}
      </span>
    </div>
  );
}

const SYSTEM_KEYS = new Set([
  "id",
  "listing_id",
  "user_id",
  "pictures",
  "listing_coordinates",
  "created_at",
  "updated_at",
  "is_saved",
  "originalData",
  "image",
  "icons",
  "status",
  "toggle",
]);

const LABEL_OVERRIDES = {
  listing_id: "Listing ID",
  job_tittle: "Job Title",
  mileage: "Mileage",
  fuel_type: "Fuel Type",
  number_of_doors: "Number of Doors",
  Load_capacity: "Load Capacity",
  service_fee: "Service Fee",
  ticket_price: "Ticket Price",
  expected_audience: "Expected Audience",
  special_feature: "Special Feature",
  event_date: "Event Date",
  event_type: "Event Type",
  property_type: "Property Type",
  parking_and_cost: "Parking / Cost",
  maintenance_policy: "Maintenance Policy",
  renters_insurance_requirement: "Renters Insurance",
  bedroom_additional_Fees: "Bedroom Fees",
  material_furniture_Selection: "Material / Furniture Selection",
  personalised_fitness_plan: "Personalized Fitness Plan",
  ac_Services: "AC Services",
  item_type: "Item Type",
  activity_type: "Activity Type",
  age_range: "Age Range",
  from_business: "From Business",
  is_active: "Status",
  listing_clicks: "Clicks",
  gem_stone: "Gem Stone",
  shoe_type: "Shoe Type",
  skin_type: "Skin Type",
  expiry_date: "Expiry Date",
  metal_type: "Metal Type",
  operating_system: "Operating System",
  carrier_lock: "Carrier Lock",
  storage_type: "Storage Type",
  energy_rating: "Energy Rating",
  compatible_model: "Compatible Model",
  mattress_included: "Mattress Included",
  seating_capacity: "Seating Capacity",
  upholstery_material: "Upholstery",
  weight_capacity: "Weight Capacity",
  accessories_type: "Accessories Type",
  babysitter_experience: "Babysitter Experience",
  activities_offered: "Activities Offered",
  equipment_required: "Equipment Required",
  no_of_children: "No. of Children",
  required_skills: "Required Skills",
  experience_level: "Experience Level",
  employment_type: "Employment Type",
  salary_range: "Salary Range",
  working_hours: "Working Hours",
  benefits_offered: "Benefits",
  remote_work_tools: "Remote Work Tools",
  helper_pay: "Helper Pay",
  jenry: "Genre",
  dimension: "Dimensions",
  dimensions: "Dimensions",
  size: "Size",
};

function humanizeKey(key) {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  return String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDetailValue(key, value) {
  if (value == null || value === "") return null;
  if (key === "from_business") return value ? "Yes" : "No";
  if (key === "is_active") return value ? "Active" : "Inactive";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function buildDetailRows(listing) {
  const rows = [];
  const seen = new Set();

  const push = (key, label, value, { always = false } = {}) => {
    if (seen.has(key)) return;
    const display = formatDetailValue(key, value);
    if ((display == null || display === "") && !always) return;
    seen.add(key);
    rows.push({
      key,
      label,
      value: display == null || display === "" ? null : display,
      showEmpty: always,
    });
  };

  push("listing_id_short", "Listing ID", shortListingId(listing));
  push("listing_id_full", "Full ID", listingIdFrom(listing));
  push("category", "Category", listing.category);
  push("subcategory", "Subcategory", listing.subcategory);
  push("location", "Location", listing.location);
  push("description", "Description", listing.description);

  const schemaFields = getEditFieldsForListing(
    listing.category,
    listing.subcategory
  );
  schemaFields.forEach((field) => {
    if (
      ["category", "subcategory", "location", "description", "image"].includes(
        field.name
      )
    ) {
      return;
    }
    // Always show category schema fields (e.g. mileage) even when empty
    push(
      field.name,
      field.label || humanizeKey(field.name),
      listing[field.name],
      { always: true }
    );
  });

  // Any remaining API keys not covered by schema (keeps detail complete)
  Object.keys(listing || {}).forEach((key) => {
    if (SYSTEM_KEYS.has(key)) return;
    if (
      [
        "category",
        "subcategory",
        "location",
        "description",
        "title",
        "keywords",
      ].includes(key)
    ) {
      return;
    }
    push(key, humanizeKey(key), listing[key]);
  });

  push(
    "keywords",
    "Keywords",
    Array.isArray(listing.keywords)
      ? listing.keywords.join(", ")
      : listing.keywords
  );
  push("from_business", "From Business", listing.from_business, {
    always: true,
  });
  push("is_active", "Status", listing.is_active, { always: true });
  push("listing_clicks", "Clicks", listing.listing_clicks ?? 0, {
    always: true,
  });

  if (listing.created_at) {
    push(
      "created_at",
      "Created",
      new Date(listing.created_at).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  }

  return rows;
}

/**
 * Premium listing details overlay shared by business listing tabs.
 * Portaled to document.body so page-shell overflow cannot clip the mask.
 */
export default function ListingDetailModal({ open, listing, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const detailRows = useMemo(
    () => (listing ? buildDetailRows(listing) : []),
    [listing]
  );

  if (!open || !listing || !mounted) return null;

  const pictures = Array.isArray(listing.pictures) ? listing.pictures : [];
  const priceLabel = formatListingPrice(listing) || "Price not set";

  return createPortal(
    <div
      className="listing-detail-mask"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="listing-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="listing-detail-hero">
          {pictures[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pictures[0]} alt="" className="listing-detail-hero__img" />
          ) : (
            <div className="listing-detail-hero__fallback" />
          )}
          <div className="listing-detail-hero__shade" />
          <button
            type="button"
            className="listing-detail-close"
            aria-label="Close"
            onClick={onClose}
          >
            <FiX size={16} />
          </button>
          <div className="listing-detail-hero__copy">
            <p className="listing-detail-kicker">Listing Details</p>
            <h2 id="listing-detail-title" className="listing-detail-title">
              {listing.title || "Untitled listing"}
            </h2>
            <p className="listing-detail-price">{priceLabel}</p>
          </div>
        </div>

        <div className="listing-detail-body">
          <div className="listing-detail-grid">
            {detailRows.map((row) => (
              <MetaRow
                key={row.key}
                label={row.label}
                value={row.value}
                showEmpty={row.showEmpty}
              />
            ))}
          </div>

          {pictures.length > 0 ? (
            <div className="listing-detail-gallery">
              <h3 className="listing-detail-gallery__title">Images</h3>
              <div className="listing-detail-gallery__row">
                {pictures.map((img, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${img}-${index}`}
                    src={img}
                    alt={`Listing ${index + 1}`}
                    className="listing-detail-gallery__img"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
