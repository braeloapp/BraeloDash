"use client";

import React from "react";
import BackButton from "../BackButton";

export default function PageHeader({
  title,
  description,
  actions,
  showBack = false,
  onBack,
  className = "",
}) {
  return (
    <header className={`page-header ${className}`.trim()}>
      <div className="flex min-w-0 items-center gap-3">
        {showBack ? <BackButton onBack={onBack} /> : null}
        <div className="min-w-0">
          <h1 className="page-title">{title}</h1>
          {description ? <p className="page-desc">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}
