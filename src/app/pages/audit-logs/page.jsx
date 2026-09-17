"use client";

import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import { getData } from "@/app/API/method";

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getData(
        `/admin-panel/audit-logs?page=${page}&page_size=25`,
        { bypass: true, ttlMs: 0 }
      );
      const data = res?.data || res;
      setRows(data?.results || []);
      setCount(data?.count || 0);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Audit Logs"
        description="Real staff actions: who changed what, when, and the before/after state."
      />
      <div className="p-4 sm:p-5">
        {loading ? (
          <PageState status="loading" title="Loading audit trail…" />
        ) : error ? (
          <PageState
            status="error"
            title="Unable to load audit logs"
            onRetry={load}
          />
        ) : rows.length === 0 ? (
          <PageState
            status="empty"
            title="No audit events yet"
            description="Moderation and settings changes will appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-brand-muted">
                <tr>
                  <th className="px-3 py-2.5">When</th>
                  <th className="px-3 py-2.5">Actor</th>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Target</th>
                  <th className="px-3 py-2.5">Summary</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="whitespace-nowrap px-3 py-2.5 text-brand-muted">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5">{row.actor_email || "—"}</td>
                    <td className="px-3 py-2.5 font-medium">{row.action}</td>
                    <td className="px-3 py-2.5">
                      {row.target_type}
                      {row.target_id ? ` #${row.target_id}` : ""}
                    </td>
                    <td className="px-3 py-2.5">{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-[var(--color-border)] px-3 py-2 text-xs text-brand-muted">
              <span>
                {count} event{count === 1 ? "" : "s"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-ghost !min-h-0 !px-2 !py-1"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="btn-ghost !min-h-0 !px-2 !py-1"
                  disabled={page * 25 >= count}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
