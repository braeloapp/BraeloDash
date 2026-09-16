"use client";

import React, { useState } from "react";
import TotalListing from "./TotalListing";
import ActiveListing from "./ActiveLsiting";
import InactiveListing from "./InactiveListing";
import SaveListing from "./SaveLsiting";

const TABS = [
  { id: 1, label: "Total Listings" },
  { id: 2, label: "Active Listings" },
  { id: 3, label: "Inactive Listings" },
  { id: 5, label: "Saved Listings" },
];

const ListingTabbar = ({ userId }) => {
  const [activeButton, setActiveButton] = useState(1);

  const buttonClasses = (index) =>
    `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition duration-300 ${
      activeButton === index
        ? "border-[#CD9403] text-[#78828A]"
        : "border-transparent text-[#ACB6BE] hover:text-[#78828A]"
    }`;

  if (!userId) {
    return (
      <p className="px-5 py-8 text-sm text-brand-muted">
        Owner user id is missing, so listings cannot be loaded.
      </p>
    );
  }

  return (
    <div className="mt-2">
      <div
        className="flex gap-1 overflow-x-auto border-b px-3 sm:justify-start sm:gap-2 sm:px-5"
        style={{ borderColor: "var(--color-border)" }}
        role="tablist"
        aria-label="User listings"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeButton === tab.id}
            className={buttonClasses(tab.id)}
            onClick={() => setActiveButton(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 px-3 sm:px-5" role="tabpanel">
        {activeButton === 1 && <TotalListing user_id={userId} />}
        {activeButton === 2 && <ActiveListing user_id={userId} />}
        {activeButton === 3 && <InactiveListing user_id={userId} />}
        {activeButton === 5 && <SaveListing user_id={userId} />}
      </div>
    </div>
  );
};

export default ListingTabbar;
