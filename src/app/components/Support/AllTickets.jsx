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
import TicketDetailModal from "@/app/components/Support/TicketDetailModal";
import ListingEditShell from "@/app/components/Listing/ListingEditShell";

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
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
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
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rows]);

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

  const loadTickets = async ({
    email = searchEmail,
    status = statusFilter,
    date = creationDate,
    pageNum = page,
    pageSize = rows,
  } = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("page_size", String(pageSize));
      if (email) params.append("search_email", email);
      if (status && status !== "All") params.append("request_status", status);
      if (date) params.append("creation_date", formatDateForAPI(date));

      const hasFilters = Boolean(email || (status && status !== "All") || date);
      const url = `${hasFilters ? SEARCH_API_URL : API_URL}?${params.toString()}`;
      const response = await getData(url);
      const list = extractResultsList(response);
      const count = Number(response?.data?.count ?? list.length);
      const formattedRequests = list.map((request) => ({
        ...request,
        created_at: formatDate(request.created_at),
        updated_at: formatDate(request.updated_at),
      }));
      setRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
      setTotalRecords(count);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch support tickets";
      setError(errorMsg);
      showToast(errorMsg, "error");
      setFilteredRequests([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportRequests = async () => loadTickets();

  const fetchFilteredTickets = async (
    email = "",
    status = "All",
    date = ""
  ) => {
    setPage(1);
    await loadTickets({ email, status, date, pageNum: 1 });
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
      await deleteData(REPORT_API_URL, {
        feedback_id: ticketToDelete,
      });
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

      const response = await updateData(REPORT_API_URL, {
        feedback_id: rowData.id,
        status: newStatus,
      });

      const okMessage =
        typeof response?.message === "string"
          ? response.message
          : typeof response?.data?.message === "string"
            ? response.data.message
            : "";
      const ok =
        response?.status === 200 ||
        response?.status === 201 ||
        /success/i.test(okMessage);

      if (ok || !response?.error) {
        const updatedRequests = requests.map((request) =>
          request.id === rowData.id
            ? { ...request, status: newStatus }
            : request
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        showToast(okMessage || "Status updated successfully!");
      } else {
        throw new Error(okMessage || "Failed to update status");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Error updating status:", error);

      if (String(errorMsg).includes("Updated Successfully")) {
        const updatedRequests = requests.map((request) =>
          request.id === rowData.id
            ? { ...request, status: newStatus }
            : request
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        showToast("Status updated successfully!");
      } else {
        setError(errorMsg);
        showToast(`Status update failed: ${errorMsg}`, "error");
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  const onPage = (event) => {
    setPage(Math.floor(event.first / event.rows) + 1);
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
            lazy
            totalRecords={totalRecords}
        first={(page - 1) * rows}
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

      <TicketDetailModal
        open={Boolean(selectedTicket)}
        ticket={selectedTicket}
        onClose={closeDetailsModalHandler}
      />

      <ListingEditShell
        open={isEmailModalOpen && Boolean(emailUser)}
        title="Reply to ticket"
        onClose={() => {
          if (!replySending) setIsEmailModalOpen(false);
        }}
        disabled={replySending}
      >
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          {emailUser?.email}
          {emailUser?.subject ? ` — ${emailUser.subject}` : ""}
        </p>
        <label className="field-label" htmlFor="ticket-reply-message">
          Message
        </label>
        <textarea
          id="ticket-reply-message"
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          rows={5}
          className="field-control"
          placeholder="Write the in-app reply the user will see"
        />
        <div className="listing-edit-footer">
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(false)}
            className="btn-ghost"
            disabled={replySending}
          >
            Cancel
          </button>
          <button
            type="button"
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
            {replySending ? "Sending…" : "Send reply"}
          </button>
        </div>
      </ListingEditShell>

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
