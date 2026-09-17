"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BackButton from "@/app/components/BackButton";
import { createAdminTaxonomy, slugifyKey } from "@/lib/taxonomy";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const AddCategory = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      slug: "",
      is_active: true,
      sort_order: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Category name is required"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const key = values.slug.trim() || slugifyKey(values.categoryName);
        const { entry } = await createAdminTaxonomy({
          kind: "category",
          key,
          label: values.categoryName.trim(),
          is_active: values.is_active,
          sort_order: values.sort_order === "" ? undefined : Number(values.sort_order),
        });
        if (entry?.listing_enabled === false) {
          toast.success("Category added");
        } else {
          toast.success("Category saved");
        }
        router.push("/pages/categories");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.data?.detail ||
            "Failed to save category"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="rounded-2xl border border-[#EEF1F4] bg-white p-4 shadow-card sm:p-6"
    >
      <div className="page-header mb-4 px-0">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">{t("pages.categories.add")}</h1>
        </div>
      </div>

      <p className="mb-4 text-sm text-brand-muted">
        Create a new category for the admin catalog. Leave slug blank to derive
        it from the display name.
      </p>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Display name</label>
        <input
          name="categoryName"
          value={formik.values.categoryName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full rounded border p-2 ${
            formik.touched.categoryName && formik.errors.categoryName
              ? "border-red-500"
              : ""
          }`}
        />
        {formik.touched.categoryName && formik.errors.categoryName ? (
          <div className="text-sm text-red-600">{formik.errors.categoryName}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Slug / key (optional)</label>
        <input
          name="slug"
          value={formik.values.slug}
          onChange={formik.handleChange}
          placeholder="e.g. seasonalpromo"
          className="w-full rounded border p-2"
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
          {submitting ? "Saving…" : "Add category"}
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
  );
};

export default AddCategory;
