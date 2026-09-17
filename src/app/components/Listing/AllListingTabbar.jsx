"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AppLoader from "@/app/components/ux/AppLoader";

const panelFallback = (
  <div className="flex min-h-[240px] items-center justify-center py-10">
    <AppLoader showLabel={false} />
  </div>
);

const Vehicles = dynamic(() => import("./Vehicles"), { loading: () => panelFallback });
const RealState = dynamic(() => import("./realstate"), { loading: () => panelFallback });
const Services = dynamic(() => import("./services"), { loading: () => panelFallback });
const Events = dynamic(() => import("./events"), { loading: () => panelFallback });
const Job = dynamic(() => import("./job"), { loading: () => panelFallback });
const Electronics = dynamic(() => import("./electronics"), {
  loading: () => panelFallback,
});
const Furniture = dynamic(() => import("./furniture"), { loading: () => panelFallback });
const Kids = dynamic(() => import("./kids"), { loading: () => panelFallback });
const Fashion = dynamic(() => import("./fashion"), { loading: () => panelFallback });
const Sports = dynamic(() => import("./sport&hobby"), { loading: () => panelFallback });

const TABS = [
  { id: 1, label: "Vehicles", Component: Vehicles },
  { id: 2, label: "Real Estate", Component: RealState },
  { id: 3, label: "Services", Component: Services },
  { id: 4, label: "Events", Component: Events },
  { id: 5, label: "Jobs", Component: Job },
  { id: 6, label: "Electronics", Component: Electronics },
  { id: 7, label: "Furniture", Component: Furniture },
  { id: 8, label: "Fashion", Component: Fashion },
  { id: 9, label: "Kids", Component: Kids },
  { id: 10, label: "Sports & Hobby", Component: Sports },
];

const SCROLL_STEP = 220;

const AllListingTabbar = () => {
  const [activeId, setActiveId] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef(null);
  const ActivePanel =
    TABS.find((tab) => tab.id === activeId)?.Component || Vehicles;

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < max - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return undefined;
    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const activeBtn = scrollerRef.current?.querySelector(
      `[data-tab-id="${activeId}"]`
    );
    activeBtn?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeId]);

  const scrollByDir = (dir) => {
    scrollerRef.current?.scrollBy({
      left: dir * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className="listing-tabs-shell border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          type="button"
          className="listing-tabs-nav listing-tabs-nav--prev"
          aria-label="Scroll categories left"
          disabled={!canScrollLeft}
          onClick={() => scrollByDir(-1)}
        >
          <FiChevronLeft size={16} />
        </button>

        <div
          ref={scrollerRef}
          className="listing-tabs-scroller"
          role="tablist"
          aria-label="Listing categories"
        >
          {TABS.map((tab) => {
            const active = activeId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-tab-id={tab.id}
                aria-selected={active}
                onClick={() => setActiveId(tab.id)}
                className={`listing-tab-btn whitespace-nowrap px-3.5 py-2.5 text-sm transition ${
                  active
                    ? "listing-tab-btn--active font-semibold text-brand-ink"
                    : "font-medium text-brand-muted hover:text-brand-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="listing-tabs-nav listing-tabs-nav--next"
          aria-label="Scroll categories right"
          disabled={!canScrollRight}
          onClick={() => scrollByDir(1)}
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      <div className="mt-4">
        <ActivePanel />
      </div>
    </>
  );
};

export default AllListingTabbar;
