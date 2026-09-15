import React from "react";
import AdminCard from "@/app/components/Adminprofile/AdminCard";
import BackButton from "@/app/components/BackButton";

const AdminProfile = () => {
  return (
    <>
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">Admin Profile</h1>
        </div>
      </div>
      <div>
        <AdminCard />
      </div>
    </>
  );
};

export default AdminProfile;
