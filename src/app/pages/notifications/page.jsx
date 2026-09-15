"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NotificationsList from "@/app/components/Notifications/NotificationsList";
import BackButton from "@/app/components/BackButton";

const Notifications = () => {
  const router = useRouter();

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
        <h1 className="page-title">Notifications</h1>
        </div>
        <button
          className="btn-primary"
          onClick={() => router.push("/pages/notifications/addnotification")}
        >
          Add New Notification
        </button>
      </div>
      <div>
        <NotificationsList />
      </div>
    </div>
  );
};

export default Notifications;
