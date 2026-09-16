"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import {
  formatListingPrice,
  listingIdFrom,
  shortListingId,
} from "@/lib/listingCards";

function MetaRow({ label, value }) {
  if (value == null || value === "") return null;
  const display =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return (
    <div className="listing-detail-meta">
      <span className="listing-detail-meta__label">{label}</span>
      <span className="listing-detail-meta__value">{display}</span>
    </div>
  );
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

  if (!open || !listing || !mounted) return null;

  const pictures = Array.isArray(listing.pictures) ? listing.pictures : [];
  const priceLabel = formatListingPrice(listing) || "Price not set";
  const created = listing.created_at
    ? new Date(listing.created_at).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;
  const keywords = Array.isArray(listing.keywords)
    ? listing.keywords.join(", ")
    : listing.keywords;
  const location =
    typeof listing.location === "string" && listing.location.trim()
      ? listing.location.trim()
      : null;

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
            <MetaRow label="Listing ID" value={shortListingId(listing)} />
            <MetaRow label="Full ID" value={listingIdFrom(listing)} />
            <MetaRow label="Category" value={listing.category} />
            <MetaRow label="Subcategory" value={listing.subcategory} />
            <MetaRow label="Location" value={location} />
            <MetaRow label="Keywords" value={keywords} />
            <MetaRow
              label="From Business"
              value={listing.from_business ? "Yes" : "No"}
            />
            <MetaRow
              label="Status"
              value={listing.is_active ? "Active" : "Inactive"}
            />
            <MetaRow label="Clicks" value={listing.listing_clicks ?? 0} />
            <MetaRow label="Created" value={created} />
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
