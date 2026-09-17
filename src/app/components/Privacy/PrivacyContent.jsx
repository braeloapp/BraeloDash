"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getData, updateData } from "@/app/API/method";
import { toast } from "react-toastify";
import PageState from "@/app/components/ux/PageState";
import Button from "@/app/components/ux/Button";

const DEFAULT_BODY = `1. YOUR AGREEMENT

By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.

2. PRIVACY

Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.`;

export default function PrivacyContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("Privacy Policy");
  const [body, setBody] = useState(DEFAULT_BODY);
  const [published, setPublished] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getData("/admin-panel/cms/privacy", {
        bypass: true,
        ttlMs: 0,
      });
      const data = res?.data || res;
      setTitle(data?.title || "Privacy Policy");
      setBody(data?.body || DEFAULT_BODY);
      setPublished(Boolean(data?.published));
      setUpdatedAt(data?.updated_at || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (nextPublished = published) => {
    try {
      setSaving(true);
      const res = await updateData("/admin-panel/cms/privacy", {
        title,
        body,
        published: nextPublished,
      });
      const data = res?.data || res;
      setPublished(Boolean(data?.published));
      setUpdatedAt(data?.updated_at || null);
      toast.success(nextPublished ? "Published" : "Draft saved");
    } catch (err) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageState status="loading" title="Loading privacy CMS…" />;
  }

  if (error) {
    return (
      <PageState
        status="error"
        title="Unable to load privacy document"
        description="Ensure migrations are applied, then retry."
        onRetry={load}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-brand-muted">
            {published ? "Published" : "Draft"}
            {updatedAt
              ? ` · Updated ${new Date(updatedAt).toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={saving}
            onClick={() => save(false)}
          >
            Save draft
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={() => save(true)}
          >
            {saving ? "Saving…" : "Publish"}
          </Button>
        </div>
      </div>

      <div>
        <label className="field-label">Title</label>
        <input
          className="field-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
        />
      </div>

      <div>
        <label className="field-label">Body</label>
        <textarea
          className="field-control min-h-[320px] font-mono text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={saving}
        />
      </div>

      <p className="text-sm text-brand-muted">
        Published copy is available to apps at{" "}
        <code className="text-xs">/admin-panel/legal/privacy</code>.
      </p>
    </div>
  );
}
