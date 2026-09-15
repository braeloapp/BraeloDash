"use client";

import React from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

/**
 * Shared selectable tile for Add Listing category + subcategory steps.
 */
export default function ListingCategoryTile({
  href,
  label,
  hint,
  icon,
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[72px] items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-[#f0e2b3] hover:bg-[#FFFBF0] hover:shadow-panel focus-visible:outline-none focus-visible:shadow-focus"
    >
      <span
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8] text-brand-gold transition group-hover:bg-brand-cream"
        aria-hidden
      >
        {icon || (
          <span className="text-sm font-semibold uppercase">
            {String(label || "?").charAt(0)}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-brand-ink sm:text-[15px]">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block truncate text-xs text-brand-faint">
            {hint}
          </span>
        ) : null}
      </span>
      <FiChevronRight
        className="h-5 w-5 shrink-0 text-brand-faint transition group-hover:translate-x-0.5 group-hover:text-brand-gold"
        aria-hidden
      />
    </Link>
  );
}
