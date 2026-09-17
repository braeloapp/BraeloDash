"use client";

import React from "react";
import FeedbackCard from "@/app/components/Feedback/FeedbackCard";
import PageHeader from "@/app/components/ux/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const feedback = () => {
  const { t } = useLanguage();

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.feedback.title")}
        description={t("pages.feedback.description")}
      />
      <FeedbackCard />
    </div>
  );
};

export default feedback;
