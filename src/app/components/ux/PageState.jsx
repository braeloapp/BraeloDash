"use client";

import React from "react";
import AppLoader from "./AppLoader";
import Button from "./Button";

export default function PageState({
  status = "empty",
  title,
  description,
  onRetry,
  retryLabel = "Retry",
  action,
}) {
  if (status === "loading") {
    return <AppLoader />;
  }

  const isError = status === "error";
  const heading =
    title || (isError ? "Unable to load this page" : "Nothing to show");

  return (
    <div
      className="flex w-full min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center"
      role={isError ? "alert" : "status"}
      aria-live="polite"
    >
      <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-5 text-[var(--color-text-muted)]">
        <p className="text-xs font-semibold uppercase tracking-wide">
          {isError ? "Error" : "Empty"}
        </p>
      </div>
      <p className="section-title mt-2 !text-[var(--color-text-secondary)]">
        {heading}
      </p>
      {description ? (
        <p className="page-desc mx-auto mt-2 max-w-md">{description}</p>
      ) : null}
      {onRetry ? (
        <Button type="button" variant="primary" onClick={onRetry} className="mt-5">
          {retryLabel}
        </Button>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
