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

const BusinessTable = ({ 
  data, 
  loading, 
  selectedBusinesses, 
  onSelectionChange,
  onRefresh
}) => {
  const router = useRouter();
  const [businessToDeactivate, setBusinessToDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

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
      "Active": "bg-[#06B64C] text-white p-1 rounded-lg text-center",
      "Inactive": "bg-[#C7233F] text-white p-1 rounded-lg text-center",
      "Deleted": "bg-[#C7233F] text-white p-1 rounded-lg text-center"
    };
    
    return (
      <div className={statusClasses[rowData.Status] || "py-1 px-2 rounded"}>
        {rowData.Status}
      </div>
    );
  };

  const actionButton = (rowData) => {
    return (
      <div className="flex gap-2">
        <Image 
          src="/g3.png" 
          alt="profile view" 
          width={24}
          height={24}
          onClick={() => handleViewProfile(rowData)} 
          className="cursor-pointer hover:opacity-80"
          title="View Details"
        />
        {rowData.Status === "Active" && (
          <Image 
            src="/g2.png" 
            alt="deactivate" 
            width={24}
            height={24}
            onClick={() => openDeactivateDialog(rowData.businessId)} 
            className="cursor-pointer hover:opacity-80"
            title="Deactivate Business"
          />
        )}
      </div>
    );
  };

  const ImageLogo = (rowData) => {
    return (
      <div className="w-10 h-10">
        {rowData.business_logo ? (
          <img 
            src={rowData.business_logo} 
            alt="logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = '/b5.png';
            }}
          />
        ) : (
          <Image src="/b5.png" alt="logo" width={40} height={40} className="object-contain" />
        )}
      </div>
    );
  };

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
      <style jsx global>{`
        /* Custom Paginator Styling */
        .business-paginator .p-paginator {
          background: transparent;
          border: none;
          padding: 5 px;
          justify-content: flex-end;
        }
        
        .business-paginator .p-paginator-current {
          color: #6b7280;
          font-size: 0.875rem;
          margin-right: 1rem;
        }
        
        .business-paginator .p-paginator-page,
        .business-paginator .p-paginator-first,
        .business-paginator .p-paginator-prev,
        .business-paginator .p-paginator-next,
        .business-paginator .p-paginator-last {
          min-width: 2.5rem;
          height: 2.5rem;
          margin: 0 0.15rem;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #e5e7eb;
          color: #4b5563;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .business-paginator .p-paginator-page:hover,
        .business-paginator .p-paginator-first:hover,
        .business-paginator .p-paginator-prev:hover,
        .business-paginator .p-paginator-next:hover,
        .business-paginator .p-paginator-last:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .business-paginator .p-paginator-page.p-highlight {
          background: #d8b039;
          color: white;
          border-color: #d8b039;
          font-weight: 600;
        }
        
        .business-paginator .p-dropdown {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          height: 2.5rem;
          margin-left: 0.5rem;
        }
        
        .business-paginator .p-dropdown .p-dropdown-label {
          padding-top: 5rem;
          padding-bottom: 0.5rem;
        }
      `}</style>

      <div className="table-scroll-wrapper">
        <DataTable
          value={data}
          dataKey="ID"
          paginator
          rows={10}
          loading={loading}
          selection={selectedBusinesses}
          onSelectionChange={onSelectionChange}
          tableStyle={{ minWidth: "200rem" }}
         // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorClassName="business-paginator m-5"
          //rowsPerPageOptions={[5, 10, 20, 50]}
          className="p-datatable-striped"
          emptyMessage="No businesses found"
        >
          <Column
            header="Actions"
            body={actionButton}
            headerStyle={getHeaderStyle()}
            bodyStyle={getBodyStyle()}
          />
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
        </DataTable>
      </div>
    </div>
  );
};

export default BusinessTable;