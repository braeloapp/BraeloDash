"use client";

import AllTickets from "@/app/components/Support/AllTickets";
import React from "react";
import PageHeader from "@/app/components/ux/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Support = () => {
  const { t } = useLanguage();

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.support.title")}
        description={t("pages.support.description")}
      />
      <AllTickets />
    </div>
  );
};

export default Support;
