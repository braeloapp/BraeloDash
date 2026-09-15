import React from "react";
import AdminCard from "@/app/components/Adminprofile/AdminCard";
import PageHeader from "@/app/components/ux/PageHeader";

const AdminProfile = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Admin Profile"
        description="View and update your administrator account details."
      />
      <AdminCard />
    </div>
  );
};

export default AdminProfile;
