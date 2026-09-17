"use client";

import React from "react";
import AdminCard from "@/app/components/Adminprofile/AdminCard";
import PageHeader from "@/app/components/ux/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const AdminProfile = () => {
  const { t } = useLanguage();

  return (
    <div className="page-shell user-detail-page">
      <PageHeader
        showBack
        title={t("pages.adminProfile.title")}
        description={t("pages.adminProfile.description")}
      />
      <AdminCard />
    </div>
  );
};

export default AdminProfile;
