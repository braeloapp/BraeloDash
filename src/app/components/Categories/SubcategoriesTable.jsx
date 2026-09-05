"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../BackButton";
import { fetchAdminTaxonomy, patchAdminTaxonomy } from "@/lib/taxonomy";
import { getApiErrorMessage } from "@/lib/apiResponse";

const SubcategoriesTable = () => {
  const { id } = useParams();
  const categoryKey = decodeURIComponent(id || "");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

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

  return (
    <div className="p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="text-[#78828A] text-[24px] font-[500]">
          {category?.label || categoryKey} subcategories
        </h1>
      </div>
      {loading ? (
        <p>Loading subcategories...</p>
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
              </tr>
            </thead>
            <tbody>
              {category.subcategories.map((subcategory) => (
                <tr key={subcategory.key} className="border-t">
                  <td className="p-3">{subcategory.key}</td>
                  <td className="p-3">{subcategory.label}</td>
                  <td className="p-3">
                    <button
                      disabled={savingKey === subcategory.key}
                      onClick={() => toggleActive(subcategory)}
                      className={`px-3 py-1 rounded text-white ${
                        subcategory.is_active ? "bg-[#06B64C]" : "bg-[#C7233F]"
                      }`}
                    >
                      {subcategory.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubcategoriesTable;
