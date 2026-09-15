"use client";

import React from "react";
import PageHeader from "@/app/components/ux/PageHeader";

/**
 * Shared page chrome for listing admin surfaces:
 * page-shell + PageHeader wrapping body content.
 */
export default function ListingPageChrome({
  title,
  description,
  actions,
  showBack = false,
  onBack,
  children,
  bodyClassName = "p-4 sm:p-5",
  className = "",
}) {
  return (
    <div className={`page-shell ${className}`.trim()}>
      <PageHeader
        title={title}
        description={description}
        actions={actions}
        showBack={showBack}
        onBack={onBack}
      />
      {children != null ? (
        <div className={bodyClassName}>{children}</div>
      ) : null}
    </div>
  );
}
