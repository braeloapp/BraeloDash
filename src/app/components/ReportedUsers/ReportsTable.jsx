"use client";
/**
 * Standalone reports table (same API as Reported Users page).
 * Page route uses inline implementation; keep this in sync when editing endpoints.
 */
import React, { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getBodyStyle, getHeaderStyle } from "../Users/UserData";
import { getData, postData } from "@/app/API/method";
import { extractResultsList, getApiErrorMessage } from "@/lib/apiResponse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const REPORTS_ENDPOINT = "/admin-panel/report/action";

function formatDateDisplay(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateForAPI(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatReportData(reports) {
  return reports.map((report) => {
    const reportId = report.report_id ?? report.id;
    const userId =
      report.user_id ??
      report.reported_user_id ??
      report.reported_to_id ??
      (typeof report.reported_to === "object" && report.reported_to
        ? report.reported_to.id ?? report.reported_to.user_id
        : null);

    const reportedToLabel =
      typeof report.reported_to === "object" && report.reported_to
        ? report.reported_to.name ??
          report.reported_to.username ??
          report.reported_to.email ??
          "N/A"
        : report.reported_to_name ?? report.reported_to ?? "N/A";

    const reportedByLabel =
      typeof report.reported_by === "object" && report.reported_by
        ? report.reported_by.name ??
          report.reported_by.username ??
          report.reported_by.email ??
          "N/A"
        : report.reported_by_name ?? report.reported_by ?? "N/A";

    return {
      id: reportId,
      report_id: reportId,
      user_id: userId,
      reportedTo: reportedToLabel,
      reportedBy: reportedByLabel,
      description: report.description || "No description",
      status: report.status || "Pending",
      reason: report.reason || "No reason specified",
      createdAt: formatDateDisplay(report.created_at) || "N/A",
      updatedAt: formatDateDisplay(report.updated_at) || "N/A",
    };
  });
}

const ReportsTable = ({
  searchQuery = "",
  statusFilter = "All",
  dateFilter = "",
}) => {
  const [reports, setReports] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchReports = useCallback(
    async (query, status, date, pageFirst, pageRows) => {
      try {
        setLoading(true);
        const page = Math.floor(pageFirst / pageRows) + 1;
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("page_size", String(pageRows));
        if (query) params.append("search_query", query);
        if (status !== "All") params.append("report_status", status);
        if (date) params.append("creation_date", formatDateForAPI(date));

        const response = await getData(`${REPORTS_ENDPOINT}?${params.toString()}`);
        const list = extractResultsList(response);
        const count =
          response?.data?.count ?? response?.count ?? list.length;
        setTotalRecords(typeof count === "number" ? count : list.length);
        setReports(formatReportData(list));
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error(getApiErrorMessage(error, "Failed to load reports"));
        setReports([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const delayMs = searchQuery ? 500 : 0;
    const t = setTimeout(() => {
      fetchReports(searchQuery, statusFilter, dateFilter, first, rows);
    }, delayMs);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter, dateFilter, first, rows, fetchReports]);

  useEffect(() => {
    setFirst(0);
  }, [searchQuery, statusFilter, dateFilter]);

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleReportAction = async (rowData) => {
    const rid = rowData.report_id ?? rowData.id;
    const uid = rowData.user_id;
    if (rid == null || uid == null || uid === "") {
      toast.error("Missing report_id or user_id for this report.");
      return;
    }
    try {
      setActionLoadingId(rowData.id);
      await postData(REPORTS_ENDPOINT, {
        report_id: String(rid),
        user_id: typeof uid === "string" ? uid : String(uid),
      });
      toast.success("Action completed successfully");
      await fetchReports(searchQuery, statusFilter, dateFilter, first, rows);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to complete action"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const actionBodyTemplate = (rowData) => {
    const busy = actionLoadingId === rowData.id;
    return (
      <select
        key={`${rowData.id}-${busy ? "1" : "0"}`}
        disabled={busy}
        defaultValue=""
        onChange={(e) => {
          const v = e.target.value;
          if (v === "view") showReportDetails(rowData);
          if (v === "action") void handleReportAction(rowData);
        }}
        className="border rounded-md p-1 text-sm max-w-[11rem]"
      >
        <option value="">Actions</option>
        <option value="view">View Details</option>
        <option value="action">Take action</option>
      </select>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusClass = {
      Pending: "bg-yellow-100 text-yellow-800",
      Resolved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    }[rowData.status] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
        {rowData.status}
      </span>
    );
  };

  const showReportDetails = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  return (
    <div className="p-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card table-scroll-wrapper">
        <DataTable
          value={reports}
          lazy
          paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          tableStyle={{ width: "100%" }}
          className="custom-paginator"
          loading={loading}
          emptyMessage="No reports found"
        >
          <Column
            field="id"
            header="Report ID"
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
            sortable
          />
          <Column
            field="reportedTo"
            header="Reported To"
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
            sortable
          />
          <Column
            field="reportedBy"
            header="Reported By"
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
            sortable
          />
          <Column
            field="reason"
            header="Reason"
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
            sortable
          />
          <Column
            field="createdAt"
            header="Date Created"
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
            sortable
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
            sortable
          />
          <Column
            header="Actions"
            body={actionBodyTemplate}
            bodyStyle={getBodyStyle()}
            headerStyle={getHeaderStyle()}
          />
        </DataTable>
      </div>

      {isModalVisible && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Report ID:</p>
                <p>{selectedReport.id}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p>{selectedReport.status}</p>
              </div>
              <div>
                <p className="font-semibold">Reported To:</p>
                <p>{selectedReport.reportedTo}</p>
              </div>
              <div>
                <p className="font-semibold">Reported By:</p>
                <p>{selectedReport.reportedBy}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold">Reason:</p>
                <p>{selectedReport.reason}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold">Description:</p>
                <p className="whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
              <div>
                <p className="font-semibold">Date Created:</p>
                <p>{selectedReport.createdAt}</p>
              </div>
              {selectedReport.updatedAt && (
                <div>
                  <p className="font-semibold">Last Updated:</p>
                  <p>{selectedReport.updatedAt}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
