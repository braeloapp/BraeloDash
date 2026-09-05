"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { extractResultsList, getApiErrorMessage } from "@/lib/apiResponse";
import { getData, postData } from "@/app/API/method";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Normalize API row → table row; keeps ids for POST /admin-panel/report/action */
function formatReportData(reports) {
  return reports.map((report) => {
    const reportId = report.report_id ?? report.id;
    const userId =
      report.user_id ??
      report.reported_user_id ??
      report.reported_to_id ??
      (typeof report.reported_to === "object" && report.reported_to !== null
        ? report.reported_to.id ?? report.reported_to.user_id
        : null) ??
      (typeof report.reported_to === "string" && report.reported_to.length >= 20
        ? report.reported_to
        : null);

    const reportedToLabel =
      typeof report.reported_to === "object" && report.reported_to !== null
        ? report.reported_to.name ??
          report.reported_to.username ??
          report.reported_to.email ??
          "N/A"
        : report.reported_to_name ??
          report.reported_to ??
          "N/A";

    const reportedByLabel =
      typeof report.reported_by === "object" && report.reported_by !== null
        ? report.reported_by.name ??
          report.reported_by.username ??
          report.reported_by.email ??
          "N/A"
        : report.reported_by_name ??
          report.reported_by ??
          "N/A";

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
      raw: report,
    };
  });
}

const ReportedUser = () => {
  // State management
  const [reports, setReports] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [moderationTarget, setModerationTarget] = useState(null);
  const [moderationAction, setModerationAction] = useState("warn");
  const [moderationNotes, setModerationNotes] = useState("");
  const exportRef = useRef(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

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
        if (list.length === 0 && (query || status !== "All" || date)) {
          toast.info("No matching reports found");
        }
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
    const timer = setTimeout(() => {
      fetchReports(searchQuery, statusFilter, dateFilter, first, rows);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter, first, rows, fetchReports]);

  // Style functions for table headers
  const getHeaderStyle = () => {
    return { 
      backgroundColor: '#f8fafc',
      color: '#64748b',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      borderBottom: '1px solid #e2e8f0'
    };
  };

  const getBodyStyle = () => {
    return { 
      padding: '12px 16px',
      fontSize: '14px',
      color: '#334155',
      borderBottom: '1px solid #e2e8f0'
    };
  };

  // Event handlers
  const handleSearch = (e) => {
    setFirst(0);
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    setFirst(0);
    setDateFilter(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFirst(0);
    setStatusFilter(e.target.value);
  };

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleReportAction = async (rowData, actionType, notes = "") => {
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
        action_type: actionType,
        notes,
      });
      toast.success("Action completed successfully");
      setModerationTarget(null);
      setModerationNotes("");
      await fetchReports(searchQuery, statusFilter, dateFilter, first, rows);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "Failed to complete action"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const showReportDetails = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  // Export functionality
  const handleExport = (format) => {
    setShowExportOptions(false);
    
    switch(format) {
      case 'CSV':
        exportCSV();
        break;
      case 'PDF':
        exportPDF();
        break;
      case 'HTML':
        exportHTML();
        break;
      default:
        break;
    }
  };

  const exportCSV = () => {
    let csvContent = "ID,Reported To,Reported By,Reason,Status,Date Created\n";
    reports.forEach(report => {
      csvContent += `${report.id},${report.reportedTo},${report.reportedBy},"${report.reason}",${report.status},${report.createdAt}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reported_users_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Reported Users', 14, 16);
    
    const headers = [['ID', 'Reported To', 'Reported By', 'Reason', 'Status', 'Date']];
    const data = reports.map(report => [
      report.id,
      report.reportedTo,
      report.reportedBy,
      report.reason,
      report.status,
      report.createdAt
    ]);
    
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }
    });
    
    doc.save(`reported_users_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const exportHTML = () => {
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Reported Users Export</title>
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #16a085; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Reported Users</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Reported To</th>
        <th>Reported By</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Date Created</th>
      </tr>
    </thead>
    <tbody>`;
    
    reports.forEach(report => {
      htmlContent += `
      <tr>
        <td>${report.id}</td>
        <td>${report.reportedTo}</td>
        <td>${report.reportedBy}</td>
        <td>${report.reason}</td>
        <td>${report.status}</td>
        <td>${report.createdAt}</td>
      </tr>`;
    });
    
    htmlContent += `
    </tbody>
  </table>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reported_users_${new Date().toISOString().slice(0,10)}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table column templates
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
          if (v === "warn" || v === "ban" || v === "ignore") {
            setModerationTarget(rowData);
            setModerationAction(v);
            setModerationNotes("");
          }
        }}
        className="border rounded-md p-1 text-sm max-w-[11rem]"
      >
        <option value="">Actions</option>
        <option value="view">View Details</option>
        <option value="warn">Warn</option>
        <option value="ban">Ban</option>
        <option value="ignore">Ignore</option>
      </select>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusClass = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    }[rowData.status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
        {rowData.status}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between border-b py-4 p-5">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-[#78828A] text-[24px] font-[500]">
            Reported Users
          </h1>
        </div>
        <div className="flex gap-2 justify-end">
          {/* Export Button with Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:outline-none"
            >
              <Image
                src="/images/export.png"
                alt="export icon"
                width={24}
                height={24}
                className="absolute left-3"
              />
              <span className="text-[#75818D] text-[14px] font-[400]">
                Export
              </span>
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('CSV')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport('PDF')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport('HTML')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    HTML
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="py-2 px-2 rounded-lg text-sm text-gray-500 bg-transparent border border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Ignored">Ignored</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search By Name"
              className="block w-full pl-4 pr-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setFirst(0);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              placeholder="Select date"
              className="block w-full pl-4 pr-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={dateFilter}
              onChange={handleDateChange}
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => {
                  setFirst(0);
                  setDateFilter("");
                }}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Reports Table */}
        <div className="card table-scroll-wrapper">
          <DataTable
            value={reports}
            lazy
            paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPage={onPage}
            scrollHeight="400px"
            rowsPerPageOptions={[5, 10, 20, 50]}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            tableStyle={{ minWidth: "100rem" }}
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

        {/* Report Details Modal */}
        {isModalVisible && selectedReport && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Report Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold">Report ID:</p>
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
        {moderationTarget && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-2">
                Confirm {moderationAction} for {moderationTarget.reportedTo}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                First warn flags the account. A second warn bans the user.
              </p>
              <textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                rows={4}
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Resolution notes"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModerationTarget(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoadingId === moderationTarget.id}
                  onClick={() =>
                    handleReportAction(
                      moderationTarget,
                      moderationAction,
                      moderationNotes
                    )
                  }
                  className="px-4 py-2 bg-[#CD9403] text-white rounded disabled:opacity-60"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedUser;