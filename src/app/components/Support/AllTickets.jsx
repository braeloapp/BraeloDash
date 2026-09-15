"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getHeaderStyle, getBodyStyle } from "../Users/UserData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData, deleteData, updateData } from "@/app/API/method";
import { debounce } from "@/lib/debounce";
import { extractResultsList } from "@/lib/apiResponse";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import AppLoader from "@/app/components/ux/AppLoader";
import StatusSelect from "@/app/components/ux/StatusSelect";
import ActionMenu from "@/app/components/ux/ActionMenu";

const API_URL = "/admin-panel/support";
const SEARCH_API_URL = "/admin-panel/support/search";
const REPORT_API_URL = "/report/request";

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Resolved", value: "Resolved" },
  { label: "On Hold", value: "On Hold" },
  { label: "In Progress", value: "In Progress" },
];

const AllTickets = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [creationDate, setCreationDate] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailUser, setEmailUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (email, status, date) => {
      await fetchFilteredTickets(email, status, date);
    }, 500),
    []
  );

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const response = await getData(API_URL);
      const rows = extractResultsList(response);

      if (rows.length > 0) {
        const formattedRequests = rows.map((request) => ({
          ...request,
          created_at: formatDate(request.created_at),
          updated_at: formatDate(request.updated_at),
        }));
        setRequests(formattedRequests);
        setFilteredRequests(formattedRequests);
      } else {
        setRequests([]);
        setFilteredRequests([]);
        showToast("No support tickets found", "info");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch support tickets";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTickets = async (
    email = "",
    status = "All",
    date = ""
  ) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (email) params.append("search_email", email);
      if (status !== "All") params.append("request_status", status);
      if (date) params.append("creation_date", formatDateForAPI(date));

      const response = await getData(`${SEARCH_API_URL}?${params.toString()}`);
      const rows = extractResultsList(response);

      if (rows.length > 0) {
        const formattedRequests = rows.map((request) => ({
          ...request,
          created_at: formatDate(request.created_at),
          updated_at: formatDate(request.updated_at),
        }));
        setFilteredRequests(formattedRequests);
      } else {
        setFilteredRequests([]);
        showToast("No matching tickets found", "info");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to search tickets";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openDeleteTicket = (ticketId) => {
    setTicketToDelete(ticketId);
  };

  const closeDeleteTicket = () => {
    if (!deleteInProgress) setTicketToDelete(null);
  };

  const confirmDeleteTicket = async () => {
    if (ticketToDelete == null) return;
    try {
      setDeleteInProgress(true);
      const formData = new FormData();
      formData.append("feedback_id", ticketToDelete);
      await deleteData(REPORT_API_URL, formData);
      setRequests((prev) => prev.filter((r) => r.id !== ticketToDelete));
      setFilteredRequests((prev) => prev.filter((r) => r.id !== ticketToDelete));
      showToast("Ticket deleted successfully!");
      setTicketToDelete(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      showToast(`Delete failed: ${errorMsg}`, "error");
    } finally {
      setDeleteInProgress(false);
    }
  };

  const handleStatusChange = async (newStatus, rowData) => {
    try {
      setStatusUpdating(true);

      const formData = new FormData();
      formData.append("feedback_id", rowData.id);
      formData.append("status", newStatus);

      const response = await updateData(REPORT_API_URL, formData);

      if (
        response.data?.message?.includes("Successfully") ||
        response.status === 201
      ) {
        const updatedRequests = requests.map((request) =>
          request.id === rowData.id
            ? { ...request, status: newStatus }
            : request
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        showToast(response.data.message || "Status updated successfully!");
      } else if (response.status === 200 || response.status === 201) {
        const updatedRequests = requests.map((request) =>
          request.id === rowData.id
            ? { ...request, status: newStatus }
            : request
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        showToast("Status updated successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Error updating status:", error);

      if (errorMsg.includes("Updated Successfully")) {
        const updatedRequests = requests.map((request) =>
          request.id === rowData.id
            ? { ...request, status: newStatus }
            : request
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        showToast(errorMsg, "success");
      } else {
        setError(errorMsg);
        showToast(`Status update failed: ${errorMsg}`, "error");
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const openDetailsModalHandler = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeDetailsModalHandler = () => {
    setSelectedTicket(null);
  };

  const handleEmailSearch = (e) => {
    const value = e.target.value;
    setSearchEmail(value);
    debouncedSearch(value, statusFilter, creationDate);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    debouncedSearch(searchEmail, status, creationDate);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setCreationDate(date);
    debouncedSearch(searchEmail, statusFilter, date);
  };

  const statusDropdownTemplate = (rowData) => (
    <StatusSelect
      value={rowData.status}
      options={statusOptions}
      disabled={statusUpdating}
      onChange={(value) => handleStatusChange(value, rowData)}
    />
  );

  const actionTemplate = (rowData) => (
    <ActionMenu
      disabled={loading}
      items={[
        {
          label: "Response",
          onClick: () => {
            setEmailUser(rowData);
            setReplyMessage("");
            setIsEmailModalOpen(true);
          },
        },
        {
          label: "View",
          onClick: () => openDetailsModalHandler(rowData),
        },
        {
          label: "Delete",
          danger: true,
          onClick: () => openDeleteTicket(rowData.id),
        },
      ]}
    />
  );

  return (
    <div className="p-4 sm:p-5">
      <ToastContainer />

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Error: {error}
          <button
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {statusUpdating ? (
        <AppLoader overlay label="Updating status..." />
      ) : null}

      <div className="filter-row mb-4 rounded-2xl px-0 py-0">
        <div className="filter-grow relative">
          <input
            type="text"
            value={searchEmail}
            onChange={handleEmailSearch}
            placeholder="Search by email"
            className="field-control pr-10"
          />
          {searchEmail && (
            <button
              onClick={() => {
                setSearchEmail("");
                debouncedSearch("", statusFilter, creationDate);
              }}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="field-control"
          >
            {["All", "Active", "On Hold", "Resolved", "In Progress"].map(
              (status) => (
                <option key={status} value={status}>
                  {status === "All" ? "Filter by status" : status}
                </option>
              )
            )}
          </select>
        </div>

        <div className="relative">
          <input
            type="date"
            value={creationDate}
            onChange={handleDateChange}
            className="field-control"
          />
        </div>
      </div>

      {loading && filteredRequests.length === 0 ? (
        <AppLoader label="Loading tickets..." />
      ) : (
      <DataTable
        value={filteredRequests}
        paginator
        first={first}
        rows={rows}
        onPage={onPage}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        tableStyle={{ width: "100%" }}
        className="custom-paginator"
        emptyMessage="No tickets found"
      >
        <Column
          field="id"
          header="ID"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
          sortable
        />
        <Column
          field="email"
          header="Email"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
          sortable
        />
        <Column
          field="subject"
          header="Subject"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
          sortable
        />
        <Column
          field="description"
          header="Description"
          headerStyle={getHeaderStyle()}
          bodyStyle={{ ...getBodyStyle(), whiteSpace: "pre-wrap" }}
          sortable
        />
        <Column
          field="created_at"
          header="Submit Date"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
          sortable
        />
        <Column
          field="status"
          header="Status"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
          body={statusDropdownTemplate}
          sortable
        />
        <Column
          body={actionTemplate}
          header="Actions"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
      </DataTable>
      )}

      {/* Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Ticket Details</h2>
            <div className="space-y-3">
              <p>
                <strong>ID:</strong> {selectedTicket.id}
              </p>
              <p>
                <strong>Email:</strong> {selectedTicket.email}
              </p>
              <p>
                <strong>Subject:</strong> {selectedTicket.subject}
              </p>
              <p>
                <strong>Description:</strong> {selectedTicket.description}
              </p>
              <p>
                <strong>Status:</strong> {selectedTicket.status}
              </p>
              <p>
                <strong>Submit Date:</strong> {selectedTicket.created_at}
              </p>
              {selectedTicket.updated_at && (
                <p>
                  <strong>Last Updated:</strong> {selectedTicket.updated_at}
                </p>
              )}
              {(selectedTicket.replies || []).length > 0 && (
                <div>
                  <strong>Replies:</strong>
                  <ul className="mt-2 space-y-2">
                    {selectedTicket.replies.map((reply) => (
                      <li key={reply.id || reply.created_at} className="border rounded p-2">
                        <p className="text-xs text-gray-500">
                          {reply.author_type} · {reply.author_name}
                        </p>
                        <p>{reply.message}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeDetailsModalHandler}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {isEmailModalOpen && emailUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reply to ticket</h2>
            <p className="mb-2 text-sm text-gray-600">
              {emailUser.email} — {emailUser.subject}
            </p>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              placeholder="Write the in-app reply the user will see"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="btn-ghost"
                disabled={replySending}
              >
                Cancel
              </button>
              <button
                disabled={replySending || !replyMessage.trim()}
                onClick={async () => {
                  try {
                    setReplySending(true);
                    await postData("/admin-panel/support/reply", {
                      ticket_id: emailUser.id,
                      message: replyMessage.trim(),
                    });
                    showToast("Reply sent");
                    setIsEmailModalOpen(false);
                    setReplyMessage("");
                    fetchSupportRequests();
                  } catch (error) {
                    showToast(
                      error.response?.data?.message || "Failed to send reply",
                      "error"
                    );
                  } finally {
                    setReplySending(false);
                  }
                }}
                className="btn-primary"
              >
                {replySending ? "Sending..." : "Send reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        visible={ticketToDelete !== null}
        onHide={closeDeleteTicket}
        onConfirm={confirmDeleteTicket}
        title="Are you sure you want to delete this ticket?"
        confirmLabel="Delete"
        confirmLoading={deleteInProgress}
      />
    </div>
  );
};

export default AllTickets;
