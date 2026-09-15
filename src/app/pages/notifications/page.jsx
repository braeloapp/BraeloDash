"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NotificationsList from "@/app/components/Notifications/NotificationsList";
import PageHeader from "@/app/components/ux/PageHeader";
import Button from "@/app/components/ux/Button";

const Notifications = () => {
  const router = useRouter();

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Notifications"
        description="Review inbox activity and send announcements to the platform."
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
