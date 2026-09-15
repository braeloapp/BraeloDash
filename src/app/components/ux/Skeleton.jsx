"use client";

import React from "react";

export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`.trim()} aria-hidden />;
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-3 px-4 py-5 sm:px-5" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function CardGridSkeleton({ cards = 4 }) {
  return (
    <div className="listing-card-grid p-4 sm:p-5" aria-busy="true" aria-label="Loading">
      {Array.from({ length: cards }).map((_, index) => (
        <Skeleton key={index} className="h-48 w-full" />
      ))}
    </div>
  );
}

export function KpiSkeleton({ cards = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full" />
      ))}
    </div>
  );
}
