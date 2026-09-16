"use client";

import React from "react";

const SIZE_CLASS = {
  sm: "braelo-wave-loader--sm",
  md: "braelo-wave-loader--md",
  lg: "braelo-wave-loader--lg",
};

function WaveMark({ size = "md", tone = "brand" }) {
  return (
    <div
      className={`braelo-wave-loader ${SIZE_CLASS[size] || SIZE_CLASS.md} ${
        tone === "light" ? "braelo-wave-loader--light" : ""
      }`}
      aria-hidden
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

/**
 * Universal Braelo loader — gold wave bars (matches mobile app loader).
 * Visual label text is hidden by default; `label` stays for screen readers.
 */
export default function AppLoader({
  label = "Loading",
  size = "md",
  full = true,
  overlay = false,
  showLabel = false,
  tone = "brand",
}) {
  const mark = <WaveMark size={overlay ? "lg" : size} tone={tone} />;

  const body = (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {mark}
      <span className="sr-only">{label || "Loading"}</span>
      {showLabel && label ? (
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
      <span
        className="inline-flex items-center justify-center gap-2"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {mark}
        <span className="sr-only">{label || "Loading"}</span>
      </span>
    );
  }

  return (
    <div className="flex min-h-[240px] w-full flex-col items-center justify-center py-10">
      {body}
    </div>
  );
}
