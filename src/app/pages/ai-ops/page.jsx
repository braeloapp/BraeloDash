"use client";

import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import { getData } from "@/app/API/method";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AiOpsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getData("/admin-panel/ai-ops?days=7", {
        bypass: true,
        ttlMs: 0,
      });
      setData(res?.data || res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const health = data?.health || {};
  const knowledge = data?.knowledge || {};
  const gaps = data?.learning_gaps || {};

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.aiOps.title", "AI / Chatbot ops")}
        description={t(
          "pages.aiOps.description",
          "Live health, knowledge base size, and learning gaps from Ellu."
        )}
        actions={
          <button type="button" className="btn-ghost" onClick={load}>
            Refresh
          </button>
        }
      />
      <div className="space-y-4 p-4 sm:p-5">
        {loading ? (
          <PageState status="loading" title="Loading AI ops…" />
        ) : error ? (
          <PageState status="error" title="Unable to load AI ops" onRetry={load} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="app-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  Status
                </p>
                <p className="mt-2 text-2xl font-semibold text-brand-ink">
                  {health.status || "—"}
                </p>
                <p className="mt-1 text-xs text-brand-faint">
                  LLM {health.llm_configured ? "configured" : "not configured"}
                </p>
              </div>
              <div className="app-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  Knowledge base
                </p>
                <p className="mt-2 text-2xl font-semibold text-brand-ink">
                  {knowledge.total ?? "—"}
                </p>
                <p className="mt-1 text-xs text-brand-faint">
                  {knowledge.with_embeddings ?? 0} with embeddings ·{" "}
                  {knowledge.source || "—"}
                </p>
              </div>
              <div className="app-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  Learning gaps (7d)
                </p>
                <p className="mt-2 text-2xl font-semibold text-brand-ink">
                  {typeof gaps.total_gaps === "number"
                    ? gaps.total_gaps
                    : gaps.error
                      ? "—"
                      : 0}
                </p>
                <p className="mt-1 text-xs text-brand-faint">
                  {gaps.error || "From LearningAgent summary"}
                </p>
              </div>
            </div>

            {Array.isArray(gaps.top_queries) && gaps.top_queries.length > 0 ? (
              <section className="app-card">
                <h2 className="section-title mb-3">Top unanswered / gap queries</h2>
                <ul className="divide-y divide-[var(--color-border)]">
                  {gaps.top_queries.slice(0, 15).map((row, idx) => (
                    <li key={idx} className="py-2 text-sm text-brand-ink">
                      {typeof row === "string"
                        ? row
                        : row.query || row.q || JSON.stringify(row)}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
