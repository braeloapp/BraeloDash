"use client";

import React from "react";
import PrivacyContent from "@/app/components/Privacy/PrivacyContent";
import PageHeader from "@/app/components/ux/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.privacy.title")}
        description={t("pages.privacy.description")}
      />
      <div className="px-4 py-4 sm:px-5">
        <PrivacyContent />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
