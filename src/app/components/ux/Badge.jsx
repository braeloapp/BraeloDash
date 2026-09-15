"use client";

import React from "react";

const TONE_CLASS = {
  success: "badge-success",
  warning: "badge-warning",
  pending: "badge-pending",
  danger: "badge-danger",
  failed: "badge-failed",
  info: "badge-info",
  processing: "badge-processing",
  neutral: "badge-neutral",
  inactive: "badge-inactive",
  cancelled: "badge-cancelled",
  active: "badge-active",
  brand: "badge-brand",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  const toneClass = TONE_CLASS[tone] || TONE_CLASS.neutral;
  return <span className={`badge ${toneClass} ${className}`.trim()}>{children}</span>;
}
