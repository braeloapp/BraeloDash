"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NotificationsList from "@/app/components/Notifications/NotificationsList";
import PageHeader from "@/app/components/ux/PageHeader";
import Button from "@/app/components/ux/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Notifications = () => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.notifications.title")}
        description={t("pages.notifications.description")}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push("/pages/notifications/addnotification")}
          >
            Add New Notification
          </Button>
        }
      />
      <NotificationsList />
    </div>
  );
};

export default Notifications;
