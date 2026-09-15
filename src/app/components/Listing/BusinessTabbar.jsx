"use client";

import React, { useState } from "react";
import TotalBusiListing from "./TotalListing";
import ActiveBusiListing from "./ActiveLsiting";
import InactiveBusiListing from "./InactiveListing";

const TABS = [
  { id: 1, label: "Total Listings" },
  { id: 2, label: "Active Listings" },
  { id: 3, label: "Inactive Listings" },
];

const BusinessTabbar = ({ businessId }) => {
  const [activeButton, setActiveButton] = useState(1);

  const buttonClasses = (index) =>
    `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition duration-300 ${
      activeButton === index
        ? "border-[#CD9403] text-[#78828A]"
        : "border-transparent text-[#ACB6BE] hover:text-[#78828A]"
    }`;

  return (
    <div className="mt-2">
      <div
        className="flex gap-1 overflow-x-auto border-b px-3 sm:justify-start sm:gap-2 sm:px-5"
        style={{ borderColor: "var(--color-border)" }}
        role="tablist"
        aria-label="Business listings"
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
        {activeButton === 1 && <TotalBusiListing user_id={businessId} />}
        {activeButton === 2 && <ActiveBusiListing user_id={businessId} />}
        {activeButton === 3 && <InactiveBusiListing user_id={businessId} />}
      </div>
    </div>
  );
};

export default BusinessTabbar;
