"use client";

import React from "react";

const TONE = {
  Active: "status-select--active",
  Resolved: "status-select--resolved",
  "On Hold": "status-select--hold",
  "In Progress": "status-select--progress",
  Pending: "status-select--pending",
  Inactive: "status-select--hold",
};

export default function StatusSelect({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder,
  className = "",
}) {
  const tone = TONE[value] || "";

  return (
    <select
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`status-select ${tone} ${className}`.trim()}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => {
        const item = typeof option === "string" ? { label: option, value: option } : option;
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}
