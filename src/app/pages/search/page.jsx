"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import { getData } from "@/app/API/method";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FiSearch } from "react-icons/fi";

function ResultGroup({ title, items, empty }) {
  return (
    <section className="app-card space-y-3">
      <h2 className="section-title">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-brand-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
            <li key={`${title}-${item.id}`} className="py-2.5">
              <Link
                href={item.href}
                className="group flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-ink group-hover:text-brand-gold">
                    {item.name || item.title}
                  </p>
                  <p className="truncate text-xs text-brand-muted">
                    {item.email ||
                      item.category ||
                      item.city_hint ||
                      item.phone ||
                      ""}
                  </p>
                </div>
                <span className="text-xs text-brand-faint">#{item.id}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function GlobalSearchPage() {
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState(null);

  const runSearch = useCallback(async (query) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults(null);
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await getData(
        `/admin-panel/search?q=${encodeURIComponent(trimmed)}`,
        { bypass: true, ttlMs: 0 }
      );
      setResults(res?.data || res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => runSearch(q), 320);
    return () => window.clearTimeout(handle);
  }, [q, runSearch]);

  return (
    <div className="page-shell">
      <PageHeader
        title={t("pages.search.title", "Global search")}
        description={t(
          "pages.search.description",
          "Find users, businesses, and listings from one place."
        )}
      />
      <div className="space-y-5 p-4 sm:p-5">
        <div className="relative max-w-xl">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            size={16}
          />
          <input
            className="field-control pl-10"
            placeholder={t("pages.search.placeholder", "Search by name, email, phone, title…")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
        </div>

        {loading ? (
          <PageState status="loading" title="Searching…" />
        ) : error ? (
          <PageState
            status="error"
            title="Search failed"
            onRetry={() => runSearch(q)}
          />
        ) : results ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ResultGroup
              title={t("nav.items.Users", "Users")}
              items={results.users || []}
              empty="No users matched."
            />
            <ResultGroup
              title={t("nav.items.Business", "Business")}
              items={results.businesses || []}
              empty="No businesses matched."
            />
            <ResultGroup
              title={t("nav.items.Listing", "Listings")}
              items={results.listings || []}
              empty="No listings matched."
            />
          </div>
        ) : (
          <PageState
            status="empty"
            title={t("pages.search.hint", "Type at least 2 characters")}
            description={t(
              "pages.search.hintDesc",
              "Results update as you type across users, businesses, and listings."
            )}
          />
        )}
      </div>
    </div>
  );
}
