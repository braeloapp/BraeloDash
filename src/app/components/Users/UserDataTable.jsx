"use client";
import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getBodyStyle, getHeaderStyle } from "@/app/components/Users/UserData";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "@/app/API/method";
import Image from "next/image";

const DELETE_API_URL = "/admin-panel/user/deactivate";
const REACTIVATE_API_URL = "/admin-panel/user/reactivate";

export default function UserTable({ data, loading, onRefresh }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const router = useRouter();
  const toastId = useRef(null);

  // Custom Paginator Styling
  const paginatorStyles = `
  .user-paginator .p-paginator {
      background: transparent;
      border-radius: 20px;
      padding: 0px 5px;
      justify-content: flex-end;
    }
    
    .user-paginator .p-paginator-current {
      color: #6b7280;
      font-size: 0.875rem;
      margin-right: 1rem;
    }
    
    .user-paginator .p-paginator-page,
    .user-paginator .p-paginator-first,
    .user-paginator .p-paginator-prev,
    .user-paginator .p-paginator-next,
    .user-paginator .p-paginator-last {
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
    
    .user-paginator .p-paginator-page:hover,
    .user-paginator .p-paginator-first:hover,
    .user-paginator .p-paginator-prev:hover,
    .user-paginator .p-paginator-next:hover,
    .user-paginator .p-paginator-last:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
    
    .user-paginator .p-paginator-page.p-highlight {
      background: #d8b039;
      color: white;
      border-color: #d8b039;
      font-weight: 600;
    }
    
    .user-paginator .p-dropdown {
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      height: 2.5rem;
      margin-left: 0.5rem;
    }
    
    .user-paginator .p-dropdown .p-dropdown-label {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  `;

  const showToast = (type, message) => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
    toastId.current = toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogVisible(true);
  };

  const deleteUser = async () => {
    try {
      await postData(DELETE_API_URL, { user_id: userToDelete.id });
      showToast("success", "User deactivated successfully");
      onRefresh();
    } catch (error) {
      showToast("error", "Failed to deactivate user");
    } finally {
      setDeleteDialogVisible(false);
      setUserToDelete(null);
    }
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setUserToDelete(null);
  };

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  
  const handleViewProfile = (rowData) => {
    if (rowData?.id == null) {
      showToast("error", "User id is missing");
      return;
    }
    router.push(`/pages/users/userdetail?id=${rowData.id}`);
  };

  const reactivateUser = async (user) => {
    try {
      await postData(REACTIVATE_API_URL, { user_id: user.id });
      showToast("success", "User reactivated successfully");
      onRefresh();
    } catch (error) {
      showToast("error", "Failed to reactivate user");
    }
  };

  const ActionButton = (rowData) => (
    <div className="flex gap-2">
      <Image
        src="/g3.png"
        alt=""
        title="View user profile"
        width={24}
        height={24}
        onClick={() => handleViewProfile(rowData)} 
        className="cursor-pointer hover:opacity-80 transition"
      />
      {rowData.is_active ? (
        <Image
          src="/g2.png"
          alt="deactivate"
          title="Deactivate user"
          width={24}
          height={24}
          onClick={() => confirmDelete(rowData)}
          className="cursor-pointer hover:opacity-80 transition"
        />
      ) : (
        <button
          type="button"
          title="Reactivate user"
          onClick={() => reactivateUser(rowData)}
          className="text-xs border border-black px-2 py-1 rounded hover:bg-gray-100"
        >
          Reactivate
        </button>
      )}
    </div>
  );

  const StatusCheck = (rowData) => {
    const statusClasses = rowData.is_active
      ? "bg-[#06B64C] text-white p-1 rounded-lg text-center text-xs"
      : "bg-[#C7233F] text-white p-1 rounded-lg text-center text-xs";
    return <div className={statusClasses}>{rowData.is_active ? "Active" : "Inactive"}</div>;
  };

  const CheckVerification = (rowData) => {
    const statusClasses = rowData.is_email_verified
      ? "text-[#5D86C2] text-xs"
      : "text-[#C7233F] text-xs";
    return <div className={statusClasses}>{rowData.is_email_verified ? "Verified" : "Unverified"}</div>;
  };

  const PhoneVerification = (rowData) => {
    const statusClasses = rowData.is_phone_verified
      ? "text-[#5D86C2] text-xs"
      : "text-[#C7233F] text-xs";
    return <div className={statusClasses}>{rowData.is_phone_verified ? "Verified" : "Unverified"}</div>;
  };

  const RoleDisplay = (rowData) => {
    const roleValue = rowData.role;
    if (typeof roleValue === 'boolean') {
      return <div>{roleValue ? "Admin" : "Client"}</div>;
    } else if (typeof roleValue === 'string') {
      return <div>{roleValue.toLowerCase() === 'admin' ? "Admin" : "Client"}</div>;
    }
    return <div>Client</div>;
  };


  return (
    <div className="p-5">
      <style jsx global>{paginatorStyles}</style>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CD9403]"></div>
        </div>
      ) : (
        <div className="table-scroll-wrapper">
          <DataTable
            value={data}
            scrollable
            dataKey="id"
            paginator
            first={first}
            rows={rows}
            onPage={onPage}
            scrollHeight="700px"
            //rowsPerPageOptions={[5, 10, 20]}
            //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            tableStyle={{ minWidth: "150rem" }}
            loading={loading}
            paginatorClassName="user-paginator"
            className="p-datatable-striped"
            emptyMessage="No users found"
          >
            <Column header="Actions" body={ActionButton} headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="ID" field="id" headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Email" field="email" headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Full Name" field="name" headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Status" body={StatusCheck} headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Email Verified" body={CheckVerification} headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Phone Verified" body={PhoneVerification} headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Date Created" field="created_at" headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
            <Column header="Role" body={RoleDisplay} headerStyle={getHeaderStyle()} bodyStyle={getBodyStyle()} />
          </DataTable>

          <ConfirmDeleteDialog
            visible={deleteDialogVisible}
            onHide={hideDeleteDialog}
            onConfirm={deleteUser}
            title="Are you sure you want to deactivate this user?"
            confirmLabel="Deactivate"
          />
        </div>
      )}
    </div>
  );
}