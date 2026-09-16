"use client";
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getHeaderStyle, getBodyStyle } from "../Users/UserData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postData } from "@/app/API/method";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import ActionMenu from "@/app/components/ux/ActionMenu";

const BusinessTable = ({
  data,
  loading,
  selectedBusinesses,
  onSelectionChange,
  onRefresh,
  totalRecords,
  first = 0,
  rows = 10,
  onPageChange,
}) => {
  const router = useRouter();
  const [businessToDeactivate, setBusinessToDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const isServerPaged = typeof onPageChange === "function";

  const handleViewProfile = (rowData) => {
    const businessId = rowData.documentId || rowData.ID || rowData.id;
    if (!businessId) {
      toast.error("Business id is missing");
      return;
    }
    router.push(`/pages/business/businessdetail?id=${businessId}`);
  };

  const openDeactivateDialog = (businessId) => {
    setBusinessToDeactivate(businessId);
  };

  const closeDeactivateDialog = () => {
    if (!deactivating) setBusinessToDeactivate(null);
  };

  const confirmDeactivate = async () => {
    if (businessToDeactivate == null) return;
    try {
      setDeactivating(true);
      await postData("/admin-panel/business/deactivate", {
        user_id: businessToDeactivate,
      });
      toast.success("Business deactivated successfully");
      setBusinessToDeactivate(null);
      onRefresh();
    } catch (error) {
      console.error("Error deactivating business:", error);
      toast.error(
        error.response?.data?.message || "Failed to deactivate business"
      );
    } finally {
      setDeactivating(false);
    }
  };

  const statusCheck = (rowData) => {
    const statusClasses = {
      Active: "bg-[#06B64C] text-white p-1 rounded-lg text-center",
      Inactive: "bg-[#C7233F] text-white p-1 rounded-lg text-center",
      Deleted: "bg-[#C7233F] text-white p-1 rounded-lg text-center",
    };

    return (
      <div className={statusClasses[rowData.Status] || "py-1 px-2 rounded"}>
        {rowData.Status}
      </div>
    );
  };

  const actionButton = (rowData) => (
    <ActionMenu
      label="Business actions"
      items={[
        {
          label: "View",
          onClick: () => handleViewProfile(rowData),
        },
        ...(rowData.Status === "Active"
          ? [
              {
                label: "Deactivate",
                danger: true,
                onClick: () => openDeactivateDialog(rowData.businessId),
              },
            ]
          : []),
      ]}
    />
  );

  const ImageLogo = (rowData) => (
    <div className="w-10 h-10">
      {rowData.business_logo ? (
        <img
          src={rowData.business_logo}
          alt="logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = "/b5.png";
          }}
        />
      ) : (
        <Image
          src="/b5.png"
          alt="logo"
          width={40}
          height={40}
          className="object-contain"
        />
      )}
    </div>
  );

  return (
    <div className="p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <ConfirmDeleteDialog
        visible={businessToDeactivate !== null}
        onHide={closeDeactivateDialog}
        onConfirm={confirmDeactivate}
        title="Are you sure you want to deactivate this business?"
        confirmLabel="Deactivate"
        confirmLoading={deactivating}
      />

      <div className="table-scroll-wrapper">
        <DataTable
          value={data}
          dataKey="ID"
          paginator
          lazy={isServerPaged}
          first={first}
          rows={rows}
          totalRecords={isServerPaged ? totalRecords : undefined}
          onPage={isServerPaged ? onPageChange : undefined}
          loading={loading}
          selection={selectedBusinesses}
          onSelectionChange={onSelectionChange}
          tableStyle={{ width: "100%" }}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorClassName="business-paginator app-paginator m-5"
          className="p-datatable-striped"
          emptyMessage="No businesses found"
        >
          <Column
            header="Logo"
            body={ImageLogo}
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
          />
          <Column
            header="Business Name"
            field="BusinessName"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="ID"
            field="ID"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="Email"
            field="Email"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="Phone Number"
            field="Phone Number"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
          />
          <Column
            header="Website"
            field="website"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
          />
          <Column
            header="Business Type"
            field="BusinessType"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="Address"
            field="Coordinates"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
          />
          <Column
            header="Status"
            body={statusCheck}
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="Date Created"
            field="Date Created"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="Last Update"
            field="Last Update"
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
            sortable
          />
          <Column
            header="Actions"
            body={actionButton}
            headerStyle={getHeaderStyle()}
            bodyStyle={{ ...getBodyStyle(), minWidth: "4.5rem", width: "4.5rem" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default BusinessTable;
