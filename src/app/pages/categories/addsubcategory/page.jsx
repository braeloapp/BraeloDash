"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import BackButton from "@/app/components/BackButton";
import {
  createAdminTaxonomy,
  fetchAdminTaxonomy,
  slugifyKey,
} from "@/lib/taxonomy";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const AddsubcategoryForm = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedParent = searchParams.get("parent") || "";
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setCategories(await fetchAdminTaxonomy());
      } catch (error) {
        toast.error("Failed to load taxonomy");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      parent_key: preselectedParent,
      subcategoryName: "",
      slug: "",
      is_active: true,
      sort_order: "",
    },
    validationSchema: Yup.object({
      parent_key: Yup.string().required("Parent category is required"),
      subcategoryName: Yup.string().required("Subcategory name is required"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const key = values.slug.trim() || slugifyKey(values.subcategoryName);
        await createAdminTaxonomy({
          kind: "subcategory",
          parent_key: values.parent_key,
          key,
          label: values.subcategoryName.trim(),
          is_active: values.is_active,
          sort_order:
            values.sort_order === "" ? undefined : Number(values.sort_order),
        });
        toast.success("Subcategory added");
        router.push(
          `/pages/categories/${encodeURIComponent(values.parent_key)}/subcategories`
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.data?.detail ||
            "Failed to save subcategory"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="rounded-2xl border border-[#EEF1F4] bg-white p-4 shadow-card sm:p-6">
      <div className="page-header mb-4 px-0">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">{t("pages.categories.addSub")}</h1>
        </div>
      </div>

      <p className="mb-4 text-sm text-brand-muted">
        Add a subcategory under any existing category. Leave slug blank to
        derive it from the display name.
      </p>

      {loading ? (
        <p className="text-sm text-brand-muted">Loading taxonomy…</p>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Parent category</label>
            <select
              name="parent_key"
              value={formik.values.parent_key}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2"
            >
              <option value="">Select parent</option>
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
            {formik.touched.parent_key && formik.errors.parent_key ? (
              <div className="text-sm text-red-600">{formik.errors.parent_key}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Display name</label>
            <input
              name="subcategoryName"
              value={formik.values.subcategoryName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2"
            />
            {formik.touched.subcategoryName && formik.errors.subcategoryName ? (
              <div className="text-sm text-red-600">
                {formik.errors.subcategoryName}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Slug / key (optional)</label>
            <input
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              className="w-full rounded border p-2"
              placeholder="optional — derived from name"
            />
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Sort order</label>
              <input
                type="number"
                name="sort_order"
                value={formik.values.sort_order}
                onChange={formik.handleChange}
                className="w-full rounded border p-2"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formik.values.is_active}
                  onChange={formik.handleChange}
                />
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Add subcategory"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => formik.resetForm()}
              disabled={submitting}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddsubcategoryForm;
