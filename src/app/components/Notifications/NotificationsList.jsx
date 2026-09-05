"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "@/app/API/method";
import { getApiErrorMessage } from "@/lib/apiResponse";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";

const DELETE_NOTIFICATION_ENDPOINT = "/admin-panel/notification/delete";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getData(`/admin-panel/notifications?page=${page}`);
      console.log("API Response:", data);

      if (data?.data?.results) {
        const formattedNotifications = data.data.results.map((notif, index) => {
          const apiId = notif.id ?? notif._id ?? null;
          return {
            rowKey: apiId != null ? String(apiId) : `row-${page}-${index}`,
            apiId,
            title: notif.title || "No Title",
            message: notif.body || "No Message",
            dateReceived: notif.created_at || new Date().toISOString(),
            type: notif.type || "General Notification",
            status: notif.is_read ? "Read" : "Unread",
            image: "/b5.png",
            description: notif.body || "No Description",
          };
        });
        
        setNotifications(formattedNotifications);
        
        // Update pagination state based on API response
        setPagination({
          currentPage: page,
          pageSize: data.data.page_size || 10,
          totalItems: data.data.count || 0,
          totalPages: Math.ceil((data.data.count || 0) / (data.data.page_size || 10)),
          hasNext: data.data.next !== null,
          hasPrev: data.data.previous !== null,
        });
      } else {
        throw new Error("Invalid notifications data structure");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
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
      console.error(err);
      toast.error(getApiErrorMessage(err, "Failed to delete notification"));
    } finally {
      setDeleteInProgress(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4">
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

      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length > 0 ? (
        <>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.rowKey}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start gap-4 overflow-hidden"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <Image
                    src={notification.image}
                    alt="Notification"
                    className="rounded shrink-0"
                    width={48}
                    height={48}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-lg font-semibold break-words">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 break-words [overflow-wrap:anywhere]">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 break-words [overflow-wrap:anywhere]">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <p className="text-xs text-gray-500">
                    {formatDate(notification.dateReceived)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openDeleteDialog(notification)}
                    className="bg-[#CD9403] text-white px-3 py-1 rounded-lg transition mt-2 hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
            </div>

            <div className="flex space-x-2 items-center">
              {/* Prev Button */}
              <button
                onClick={() => fetchNotifications(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev || loading}
                className={`px-2 py-1 rounded-md ${pagination.hasPrev && !loading ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                &lt;
              </button>

              {/* Page Numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchNotifications(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors
                    ${page === pagination.currentPage
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => fetchNotifications(pagination.currentPage + 1)}
                disabled={!pagination.hasNext || loading}
                className={`px-2 py-1 rounded-md ${pagination.hasNext && !loading ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationsList;