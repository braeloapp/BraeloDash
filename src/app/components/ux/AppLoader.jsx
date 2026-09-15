"use client";

import React from "react";

const SIZE = {
  sm: "h-4 w-4 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-12 w-12 border-[3px]",
};

export default function AppLoader({
  label = "Loading...",
  size = "md",
  full = true,
}) {
  const spinner = (
    <div
      className={`${SIZE[size] || SIZE.md} animate-spin rounded-full border-[#D8B039] border-t-transparent`}
      aria-hidden
    />
  );

  if (!full) {
    return (
      <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
        {spinner}
        {label ? <span className="sr-only">{label}</span> : null}
      </span>
    );
  }

  return (
    <div
      className="flex min-h-[240px] w-full flex-col items-center justify-center gap-3 py-10"
      role="status"
      aria-live="polite"
    >
      {spinner}
      {label ? (
        <p className="text-sm font-medium text-[#78828A]">{label}</p>
      ) : null}
    </div>
  );
}
