"use client";

import React from "react";

export default function Card({ className = "", children, as: Tag = "div", ...props }) {
  return (
    <Tag className={`app-card ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
