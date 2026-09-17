"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import { getData, updateData } from "@/app/API/method";
import { toast } from "react-toastify";

export default function PlatformSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getData("/admin-panel/platform-settings", { bypass: true });
      setForm(res?.data || res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    if (!form || saving) return;
    try {
      setSaving(true);
      const res = await updateData("/admin-panel/platform-settings", form);
      setForm(res?.data || form);
      toast.success("Platform settings saved");
    } catch (err) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Platform Settings"
        description="Control listing caps, force-update, explore radius, and auth providers without a code deploy."
        actions={
          <button
            type="button"
            className="btn-primary"
            disabled={saving || loading || !form}
            onClick={save}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        }
      />
      <div className="p-4 sm:p-5">
        {loading ? (
          <PageState status="loading" title="Loading settings…" />
        ) : error || !form ? (
          <PageState
            status="error"
            title="Unable to load platform settings"
            description="Run migrations if this endpoint is new, then retry."
            onRetry={load}
          />
        ) : (
          <div className="mx-auto grid max-w-3xl gap-4">
            <section className="app-card space-y-4">
              <h2 className="section-title">Marketplace rules</h2>
              <label className="field-label">
                Max active listings (non-business)
                <input
                  type="number"
                  min={0}
                  className="field-control mt-1.5"
                  value={form.max_active_listings_non_business ?? 10}
                  onChange={(e) =>
                    setField("max_active_listings_non_business", Number(e.target.value))
                  }
                />
              </label>
              <label className="field-label">
                Search minimum characters
                <input
                  type="number"
                  min={1}
                  className="field-control mt-1.5"
                  value={form.search_min_chars ?? 3}
                  onChange={(e) =>
                    setField("search_min_chars", Number(e.target.value))
                  }
                />
              </label>
              <label className="field-label">
                Default explore radius (km)
                <input
                  type="number"
                  min={1}
                  className="field-control mt-1.5"
                  value={form.default_explore_radius_km ?? 10}
                  onChange={(e) =>
                    setField("default_explore_radius_km", Number(e.target.value))
                  }
                />
              </label>
            </section>

            <section className="app-card space-y-4">
              <h2 className="section-title">Force update</h2>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.force_update)}
                  onChange={(e) => setField("force_update", e.target.checked)}
                />
                Require force update
              </label>
              <label className="field-label">
                Minimum iOS version
                <input
                  className="field-control mt-1.5"
                  value={form.min_ios_version || ""}
                  onChange={(e) => setField("min_ios_version", e.target.value)}
                  placeholder="e.g. 1.2.0"
                />
              </label>
              <label className="field-label">
                Minimum Android version
                <input
                  className="field-control mt-1.5"
                  value={form.min_android_version || ""}
                  onChange={(e) => setField("min_android_version", e.target.value)}
                  placeholder="e.g. 1.2.0"
                />
              </label>
            </section>

            <section className="app-card space-y-4">
              <h2 className="section-title">Auth providers</h2>
              {[
                ["phone_auth_enabled", "Phone OTP"],
                ["google_auth_enabled", "Google"],
                ["apple_auth_enabled", "Apple"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => setField(key, e.target.checked)}
                  />
                  {label} enabled
                </label>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
