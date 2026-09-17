"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getData } from "@/app/API/method";
import PageState from "@/app/components/ux/PageState";

export default function AuditHistoryPanel({
  targetType,
  targetId,
  title = "History",
  description = "Staff actions on this record from the audit trail.",
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    if (!targetType || !targetId) {
      setRows([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await getData(
        `/admin-panel/audit-logs?target_type=${encodeURIComponent(
          targetType
        )}&target_id=${encodeURIComponent(String(targetId))}&page_size=20`,
        { bypass: true, ttlMs: 0 }
      );
      const data = res?.data || res;
      setRows(data?.results || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="user-detail-listings">
      <div className="user-detail-listings__head">
        <h3 className="user-detail-listings__title">{title}</h3>
        <p className="user-detail-listings__desc">{description}</p>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3 sm:p-4">
        {loading ? (
          <PageState status="loading" title="Loading history…" />
        ) : error ? (
          <PageState
            status="error"
            title="Unable to load history"
            onRetry={load}
          />
        ) : rows.length === 0 ? (
          <PageState
            status="empty"
            title="No history yet"
            description="Admin edits, moderation, and deactivations will show here."
          />
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-ink">
                    {row.summary || row.action}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    {row.actor_email || "System"} ·{" "}
                    <span className="uppercase tracking-wide">{row.action}</span>
                  </p>
                  {row.reason ? (
                    <p className="mt-1 text-xs text-brand-faint">{row.reason}</p>
                  ) : null}
                </div>
                <time className="shrink-0 text-xs text-brand-muted">
                  {row.created_at
                    ? new Date(row.created_at).toLocaleString()
                    : "—"}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
