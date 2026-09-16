"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../BackButton";
import {
  deleteAdminTaxonomy,
  fetchAdminTaxonomy,
  patchAdminTaxonomy,
} from "@/lib/taxonomy";
import { getApiErrorMessage } from "@/lib/apiResponse";
import AppLoader from "@/app/components/ux/AppLoader";
import ActionMenu from "@/app/components/ux/ActionMenu";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";

const SubcategoriesTable = () => {
  const { id } = useParams();
  const categoryKey = decodeURIComponent(id || "");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const categories = await fetchAdminTaxonomy();
      setCategory(
        categories.find((item) => item.key === categoryKey) || null
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load subcategories"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [categoryKey]);

  const toggleActive = async (subcategory) => {
    try {
      setSavingKey(subcategory.key);
      const next = await patchAdminTaxonomy({
        kind: "subcategory",
        key: subcategory.key,
        parent_key: categoryKey,
        is_active: !subcategory.is_active,
      });
      setCategory(next.find((item) => item.key === categoryKey) || null);
      toast.success("Subcategory updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update subcategory"));
    } finally {
      setSavingKey(null);
    }
  };

  const removeSubcategory = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      setSavingKey(pendingDelete.key);
      const next = await deleteAdminTaxonomy({
        kind: "subcategory",
        key: pendingDelete.key,
        parent_key: categoryKey,
      });
      setCategory(next.find((item) => item.key === categoryKey) || null);
      toast.success("Subcategory removed");
      setPendingDelete(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove subcategory"));
    } finally {
      setDeleting(false);
      setSavingKey(null);
    }
  };

  return (
    <div className="p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-[24px] font-[500] text-[#78828A]">
            {category?.label || categoryKey} subcategories
          </h1>
        </div>
        <Link
          href={`/pages/categories/addsubcategory?parent=${encodeURIComponent(categoryKey)}`}
          className="btn-primary"
        >
          Add subcategory
        </Link>
      </div>
      {loading ? (
        <AppLoader label="Loading subcategories..." />
      ) : !category ? (
        <p>Category not found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="p-3">Key</th>
                <th className="p-3">Label</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(category.subcategories || []).length === 0 ? (
                <tr>
                  <td className="p-3 text-sm text-brand-muted" colSpan={4}>
                    No subcategories yet. Add one to get started.
                  </td>
                </tr>
              ) : (
                category.subcategories.map((subcategory) => (
                  <tr key={subcategory.key} className="border-t">
                    <td className="p-3">{subcategory.key}</td>
                    <td className="p-3">{subcategory.label}</td>
                    <td className="p-3">
                      <label className="inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={subcategory.is_active}
                          disabled={savingKey === subcategory.key}
                          onChange={() => toggleActive(subcategory)}
                          className="peer sr-only"
                        />
                        <div className="relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#CD9403]">
                          <div
                            className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                              subcategory.is_active ? "translate-x-5" : ""
                            }`}
                          />
                        </div>
                        <span className="ms-3 text-sm">
                          {subcategory.is_active ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </td>
                    <td className="p-3">
                      <ActionMenu
                        disabled={savingKey === subcategory.key}
                        items={[
                          {
                            label: "Delete",
                            danger: true,
                            onClick: () => setPendingDelete(subcategory),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDeleteDialog
        visible={Boolean(pendingDelete)}
        onHide={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={removeSubcategory}
        title={`Remove subcategory "${pendingDelete?.label || pendingDelete?.key || ""}"?`}
        message="This removes the subcategory from the admin catalog."
        confirmLabel="Remove"
        confirmLoading={deleting}
      />
    </div>
  );
};

export default SubcategoriesTable;
