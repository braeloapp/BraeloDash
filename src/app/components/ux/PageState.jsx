"use client";

import React from "react";

export default function PageState({
  status = "empty",
  title,
  description,
  onRetry,
  retryLabel = "Retry",
}) {
  const isError = status === "error";
  const heading =
    title ||
    (status === "loading"
      ? "Loading..."
      : isError
        ? "Unable to load this page"
        : "Nothing to show");

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-[240px] py-12 px-6 text-center"
      role={isError ? "alert" : "status"}
      aria-live="polite"
    >
      {status === "loading" ? (
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#D8B039] border-t-transparent"
          aria-hidden
        />
      ) : (
        <div className="mb-4 rounded-2xl bg-[#F6F8FB] p-6 text-[#ACB6BE]">
          <p className="text-sm uppercase tracking-wide">
            {isError ? "Error" : "Empty"}
          </p>
        </div>
      )}
      <p className="mt-4 text-lg font-semibold text-[#78828A]">{heading}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#ACB6BE]">
          {description}
        </p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-md bg-[#CD9403] px-4 py-2 text-sm font-medium text-white hover:bg-[#b37f02] focus:outline-none focus:ring-2 focus:ring-[#CD9403] focus:ring-offset-2 disabled:opacity-50"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
