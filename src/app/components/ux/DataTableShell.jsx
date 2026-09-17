"use client";

import React from "react";
import PageState from "./PageState";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DataTableShell({
  loading = false,
  empty = false,
  error = false,
  emptyTitle = "No records yet",
  emptyDescription = "There are currently no records to display.",
  errorTitle = "Unable to load data",
  errorDescription = "Something went wrong while retrieving the latest data.",
  onRetry,
  children,
  className = "",
  footer,
}) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className={`px-4 py-6 sm:px-5 ${className}`.trim()}>
        <PageState status="loading" title={t("common.loadingEllipsis")} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`px-4 py-6 sm:px-5 ${className}`.trim()}>
        <PageState
          status="error"
          title={errorTitle}
          description={errorDescription}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`px-4 py-6 sm:px-5 ${className}`.trim()}>
        <PageState
          status="empty"
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="table-scroll-wrapper mx-4 mb-4 sm:mx-5">{children}</div>
      {footer ? <div className="px-4 pb-4 sm:px-5">{footer}</div> : null}
    </div>
  );
}
