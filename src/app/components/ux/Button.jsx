"use client";

import React from "react";
import AppLoader from "./AppLoader";

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
          <AppLoader
            size="sm"
            full={false}
            label="Please wait"
            showLabel={false}
            tone={variant === "primary" || variant === "danger" ? "light" : "brand"}
          />
          <span>
            {typeof children === "string" ? "Please wait…" : children}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
