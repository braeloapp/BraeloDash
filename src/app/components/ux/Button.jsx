"use client";

import React from "react";

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
  icon: "btn-icon",
  table: "btn-table",
};

export default function Button({
  variant = "primary",
  type = "button",
  className = "",
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  const base = VARIANT_CLASS[variant] || VARIANT_CLASS.primary;
  return (
    <button
      type={type}
      className={`${base} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden
          />
          <span>{typeof children === "string" ? "Please wait…" : children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
