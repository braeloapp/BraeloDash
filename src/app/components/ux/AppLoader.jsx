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
  overlay = false,
}) {
  const spinner = (
    <div
      className={`${SIZE[overlay ? "lg" : size] || SIZE.md} animate-spin rounded-full border-[#D8B039] border-t-transparent`}
      aria-hidden
    />
  );

  const body = (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      {spinner}
      {label ? (
        <p className="text-sm font-medium text-[#78828A]">{label}</p>
      ) : null}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#3a4248]/20 backdrop-blur-[2px]">
        <div className="rounded-[24px] border border-[#F0E2B3] bg-white px-10 py-8 shadow-[0_20px_60px_rgba(58,66,72,0.16)]">
          {body}
        </div>
      </div>
    );
  }

  if (!full) {
    return (
      <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
        {spinner}
        {label ? <span className="sr-only">{label}</span> : null}
      </span>
    );
  }

  return (
    <div className="flex min-h-[240px] w-full flex-col items-center justify-center py-10">
      {body}
    </div>
  );
}
