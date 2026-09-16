"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import TableLoadingIcon from "@/app/components/ux/TableLoadingIcon";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getHeaderStyle, getBodyStyle } from "../Users/UserData";
import {
  deleteAdminTaxonomy,
  fetchAdminTaxonomy,
  patchAdminTaxonomy,
} from "@/lib/taxonomy";
import { getApiErrorMessage } from "@/lib/apiResponse";
import ActionMenu from "@/app/components/ux/ActionMenu";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const loadTaxonomy = async () => {
    try {
      setLoading(true);
      setCategories(await fetchAdminTaxonomy());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load taxonomy"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxonomy();
  }, []);

  const toggleActive = async (category) => {
    try {
      setSavingKey(category.key);
      const next = await patchAdminTaxonomy({
        kind: "category",
        key: category.key,
        is_active: !category.is_active,
      });
      setCategories(next);
      toast.success("Category updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update category"));
    } finally {
      setSavingKey(null);
    }
  };

  const removeCategory = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      setSavingKey(pendingDelete.key);
      const next = await deleteAdminTaxonomy({
        kind: "category",
        key: pendingDelete.key,
      });
      setCategories(next);
      toast.success("Category removed");
      setPendingDelete(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove category"));
    } finally {
      setDeleting(false);
      setSavingKey(null);
    }
  };

  const statusTemplate = (rowData) => (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={rowData.is_active}
        disabled={savingKey === rowData.key}
        onChange={() => toggleActive(rowData)}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#CD9403]">
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            rowData.is_active ? "translate-x-5" : ""
          }`}
        />
      </div>
      <span className="ms-3 text-sm">
        {rowData.is_active ? "Active" : "Inactive"}
      </span>
    </label>
  );

  return (
    <div className="p-5 table-scroll-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      <DataTable
        value={categories}
        paginator
        first={first}
        rows={rows}
        onPage={(event) => {
          setFirst(event.first);
          setRows(event.rows);
        }}
        loading={loading}
            loadingIcon={<TableLoadingIcon />}
        emptyMessage="No categories found"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        className="custom-paginator"
      >
        <Column
          field="key"
          header="Key"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          field="label"
          header="Category Name"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          header="Total Subcategories"
          body={(row) => row.subcategories?.length || 0}
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          header="Status"
          body={statusTemplate}
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <ActionMenu
              disabled={savingKey === rowData.key}
              items={[
                {
                  label: "View",
                  onClick: () =>
                    router.push(
                      `/pages/categories/${encodeURIComponent(rowData.key)}/subcategories`
                    ),
                },
                {
                  label: "Delete",
                  danger: true,
                  onClick: () => setPendingDelete(rowData),
                },
              ]}
            />
          )}
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
      </DataTable>
      <ConfirmDeleteDialog
        visible={Boolean(pendingDelete)}
        onHide={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={removeCategory}
        title={`Remove category "${pendingDelete?.label || pendingDelete?.key || ""}"?`}
        message="This removes the category and its subcategories from the admin catalog."
        confirmLabel="Remove"
        confirmLoading={deleting}
      />
    </div>
  );
};

export default CategoriesTable;
