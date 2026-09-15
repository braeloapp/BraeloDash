"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "@/app/API/method";
import { getApiErrorMessage } from "@/lib/apiResponse";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import ActionMenu from "@/app/components/ux/ActionMenu";
import AppLoader from "@/app/components/ux/AppLoader";
import {
  markNotificationLocallyRead,
  markNotificationLocallyUnread,
  isNotificationUnread,
  NOTIFICATIONS_CHANGED,
} from "@/lib/adminNotifications";

const DELETE_NOTIFICATION_ENDPOINT = "/admin-panel/notification/delete";
const READ_NOTIFICATION_ENDPOINT = "/admin-panel/notification/read";

function formatNotificationTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pageWindow(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getData(`/admin-panel/notifications?page=${page}`);

      if (data?.data?.results) {
        const pageSize = data.data.page_size || 10;
        const formattedNotifications = data.data.results.map((notif, index) => {
          const apiId = notif.id ?? notif._id ?? null;
          return {
            rowKey: apiId != null ? String(apiId) : `row-${page}-${index}`,
            apiId,
            title: notif.title || "No Title",
            message: notif.body || "No Message",
            dateReceived: notif.created_at || new Date().toISOString(),
            type: notif.type || "General",
            is_read: Boolean(notif.is_read),
            unread: isNotificationUnread(notif),
            image: "/b5.png",
          };
        });

        setNotifications(formattedNotifications);
        setPagination({
          currentPage: page,
          pageSize,
          totalItems: data.data.count || 0,
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
        }
      } else {
        throw new Error("Invalid notifications data structure");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load notifications"));
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const openDeleteDialog = (notification) => {
    setNotificationToDelete(notification);
    setDeleteDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setNotificationToDelete(null);
  };

  const syncReadOnServer = async (apiId, isRead) => {
    if (apiId == null || apiId === "") return;
    try {
      await postData(READ_NOTIFICATION_ENDPOINT, {
        notification_id: String(apiId),
        is_read: isRead,
      });
    } catch {
      // Local read state still updates even if this endpoint is unavailable.
    }
  };

  const markAsRead = async (notification) => {
    if (!notification?.unread) return;
    setNotifications((prev) =>
      prev.map((item) =>
        item.rowKey === notification.rowKey ? { ...item, unread: false, is_read: true } : item
      )
    );
    markNotificationLocallyRead(notification.apiId);
    await syncReadOnServer(notification.apiId, true);
  };

  const markAsUnread = async (notification) => {
    if (notification?.unread) return;
    setNotifications((prev) =>
      prev.map((item) =>
        item.rowKey === notification.rowKey ? { ...item, unread: true, is_read: false } : item
      )
    );
    markNotificationLocallyUnread(notification.apiId);
    await syncReadOnServer(notification.apiId, false);
  };

  const markAllVisibleRead = async () => {
    const unreadItems = notifications.filter((item) => item.unread);
    if (unreadItems.length === 0) return;
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false, is_read: true })));
    await Promise.all(
      unreadItems.map(async (item) => {
        markNotificationLocallyRead(item.apiId);
        await syncReadOnServer(item.apiId, true);
      })
    );
  };

  const handleConfirmDelete = async () => {
    const apiId = notificationToDelete?.apiId;
    if (apiId == null || apiId === "") {
      toast.error("Cannot delete: notification id is missing.");
      return;
    }
    try {
      setDeleteInProgress(true);
      await postData(DELETE_NOTIFICATION_ENDPOINT, {
        notification_id: String(apiId),
      });
      toast.success("Notification deleted successfully");
      hideDeleteDialog();
      await fetchNotifications(pagination.currentPage);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete notification"));
    } finally {
      setDeleteInProgress(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize));
  const pages = pageWindow(pagination.currentPage, totalPages);

  return (
    <div className="p-4 sm:p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <ConfirmDeleteDialog
        visible={deleteDialogVisible}
        onHide={hideDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this notification?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteInProgress}
      />

      {loading ? (
        <AppLoader label="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EEF1F4] bg-[#FBFCFE] px-6 py-16 text-center">
          <p className="text-base font-medium text-[#3a4248]">No notifications yet</p>
          <p className="mt-1 text-sm text-[#78828A]">New activity from the app will show up here.</p>
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[#78828A]">
              {notifications.filter((item) => item.unread).length > 0 ? (
                <>
                  <span className="font-semibold text-[#CD9403]">
                    {notifications.filter((item) => item.unread).length} unread
                  </span>
                  <span> on this page</span>
                </>
              ) : (
                "All caught up on this page"
              )}
            </p>
            {notifications.some((item) => item.unread) ? (
              <button type="button" className="btn-ghost text-xs" onClick={markAllVisibleRead}>
                Mark all as read
              </button>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EEF1F4] bg-white">
            {notifications.map((notification) => (
              <article
                key={notification.rowKey}
                className={`relative flex items-start gap-3 border-b border-[#EEF1F4] px-4 py-3.5 last:border-b-0 sm:gap-4 sm:px-5 ${
                  notification.unread ? "cursor-pointer bg-[#FFFBF0]" : "bg-white"
                }`}
                onClick={() => markAsRead(notification)}
              >
                {notification.unread ? (
                  <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-[#CD9403]" />
                ) : null}

                <div className="relative shrink-0">
                  <img
                    src={notification.image}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  {notification.unread ? (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#CD9403] ring-2 ring-white" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`truncate text-[15px] ${
                            notification.unread
                              ? "font-semibold text-[#232F30]"
                              : "font-medium text-[#78828A]"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {notification.unread ? (
                          <span className="badge badge-brand">Unread</span>
                        ) : (
                          <span className="badge badge-neutral">Read</span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-[#78828A]">
                        {notification.message}
                      </p>
                    </div>
                    <div
                      className="flex shrink-0 items-center gap-1"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <time className="whitespace-nowrap text-xs text-[#ACB6BE]">
                        {formatNotificationTime(notification.dateReceived)}
                      </time>
                      <ActionMenu
                        disabled={deleteInProgress}
                        items={[
                          notification.unread
                            ? {
                                label: "Mark as read",
                                onClick: () => markAsRead(notification),
                              }
                            : {
                                label: "Mark as unread",
                                onClick: () => markAsUnread(notification),
                              },
                          {
                            label: "Delete",
                            danger: true,
                            onClick: () => openDeleteDialog(notification),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <span className="mt-2 inline-flex rounded-full bg-[#FFF8E8] px-2 py-0.5 text-[11px] font-medium capitalize text-[#CD9403]">
                    {notification.type}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-1.5">
            <button
              type="button"
              className="paginator-btn"
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchNotifications(1)}
              aria-label="First page"
            >
              «
            </button>
            <button
              type="button"
              className="paginator-btn"
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchNotifications(pagination.currentPage - 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                className={`paginator-btn ${page === pagination.currentPage ? "paginator-btn--active" : ""}`}
                onClick={() => fetchNotifications(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="paginator-btn"
              disabled={pagination.currentPage >= totalPages}
              onClick={() => fetchNotifications(pagination.currentPage + 1)}
              aria-label="Next page"
            >
              ›
            </button>
            <button
              type="button"
              className="paginator-btn"
              disabled={pagination.currentPage >= totalPages}
              onClick={() => fetchNotifications(totalPages)}
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsList;
