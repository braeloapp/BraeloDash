"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { getHeaderStyle, getBodyStyle } from "../Users/UserData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData, deleteData, updateData } from "@/app/API/method";
import { debounce } from "@/lib/debounce";
import { extractResultsList } from "@/lib/apiResponse";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (email, status, date) => {
      await fetchFilteredTickets(email, status, date);
    }, 500),
    []
  );

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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
    setIsDropdownOpen(false);
    debouncedSearch(searchEmail, status, creationDate);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setCreationDate(date);
    debouncedSearch(searchEmail, statusFilter, date);
  };

  const statusDropdownTemplate = (rowData) => {
    return (
      <div className="p-2 text-black">
        <Dropdown
          value={rowData.status}
          options={statusOptions}
          onChange={(e) => handleStatusChange(e.value, rowData)}
          placeholder="Select Status"
          className="w-full text-black rounded-md bg-slate-200 p-2"
          panelClassName="bg-gray-100 border border-gray-300 shadow-lg p-5 text-black"
          disabled={statusUpdating}
        />
        {statusUpdating && (
          <small className="block mt-1 text-blue-600">Updating...</small>
        )}
      </div>
    );
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        className="flex items-center border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        onClick={() => {
          setEmailUser(rowData);
          setReplyMessage("");
          setIsEmailModalOpen(true);
        }}
        disabled={loading}
      >
        Response
      </button>

      <button
        className="flex items-center border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        onClick={() => openDeleteTicket(rowData.id)}
        disabled={loading}
      >
        Delete
      </button>
      <button
        className="flex items-center border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        onClick={() => openDetailsModalHandler(rowData)}
        disabled={loading}
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="p-5 table-scroll-wrapper">
      <ToastContainer />

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          Error: {error}
          <button
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {(loading || statusUpdating) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p>Processing request...</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {/* Email Search */}
        <div className="relative flex-1 min-w-[250px]">
          <input
            type="text"
            value={searchEmail}
            onChange={handleEmailSearch}
            placeholder="Search by email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Status Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <input
              type="text"
              value={statusFilter === "All" ? "Filter by Status" : statusFilter}
              readOnly
              className="bg-transparent focus:outline-none cursor-pointer"
              placeholder="Filter by Status"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ml-2 text-gray-500 transition-transform ${
                isDropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <ul>
                {["All", "Active", "On Hold", "Resolved", "In Progress"].map(
                  (status) => (
                    <li
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        statusFilter === status
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative min-w-[200px]">
          <input
            type="date"
            value={creationDate}
            onChange={handleDateChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {creationDate && (
            <button
              onClick={() => {
                setCreationDate("");
                debouncedSearch(searchEmail, statusFilter, "");
              }}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <DataTable
        value={filteredRequests}
        paginator
        first={first}
        rows={rows}
        onPage={onPage}
        scrollable
        scrollHeight="700px"
        //rowsPerPageOptions={[5, 10, 20]}
        //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        tableStyle={{ minWidth: "100rem" }}
        className="custom-paginator"
        loading={loading}
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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
                className="px-4 py-2 bg-[#CD9403] text-white rounded hover:bg-[#b37f02] disabled:opacity-60"
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
