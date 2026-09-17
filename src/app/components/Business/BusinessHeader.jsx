"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../BackButton";
import Image from "next/image";
import { utils, writeFileXLSX } from "xlsx";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const exportOptions = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "XLSX" },
  { value: "html", label: "HTML" },
];

const statusOptions = [
  { value: "", label: "Select Status", disabled: true },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const verificationOptions = [
  { value: "", label: "Verification Status", disabled: true },
  { value: "Verified", label: "Verified" },
  { value: "Unverified", label: "Unverified" },
];

const BusinessHeader = ({
  onSearch,
  onStatusChange,
  onDateChange,
  onVerificationChange,
  data,
  selectedBusinesses
}) => {
  const { t } = useLanguage();
  const [selectedExport, setSelectedExport] = useState(exportOptions[0]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const router = useRouter();

  const handleNewBusiness = () => {
    router.push("/pages/business/addbusiness");
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatus(value);
    onStatusChange(value);
  };

  const handleVerificationChange = (event) => {
    const value = event.target.value;
    setVerificationStatus(value);
    onVerificationChange(value);
  };

  const handleExportClick = (option) => {
    setSelectedExport(option);
    setIsExportOpen(false);
    handleExport(option.value);
  };

  const handleExport = (format) => {
    const dataToExport = selectedBusinesses.length > 0 
      ? selectedBusinesses 
      : data;

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = dataToExport.map(business => ({
      ID: business.ID,
      "Business Name": business.BusinessName,
      Email: business.Email,
      "Phone Number": business["Phone Number"],
      Website: business.website,
      "Business Type": business.BusinessType,
      Status: business.Status,
      Address: business.Coordinates,
      "Date Created": business["Date Created"],
      "Last Update": business["Last Update"]
    }));

    switch (format) {
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'xlsx':
        exportToExcel(exportData);
        break;
      case 'html':
        exportToHTML(exportData);
        break;
      default:
        exportToCSV(exportData);
    }
  };

  const exportToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(fieldName => 
        JSON.stringify(row[fieldName], (key, val) => val === null ? '' : val)
      ).join(',')
    );
    const csvContent = [headerRow, ...csvRows].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `businesses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Businesses");
    writeFileXLSX(workbook, `businesses_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToHTML = (data) => {
    const headers = Object.keys(data[0]);
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Businesses Export</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .active { background-color: #06B64C; color: white; padding: 2px 6px; border-radius: 4px; }
    .inactive { background-color: #C7233F; color: white; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Businesses Export - ${new Date().toLocaleDateString()}</h1>
  <p>Exported ${data.length} records</p>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>`;

    data.forEach(row => {
      html += `<tr>${headers.map(h => {
        if (h === 'Status') {
          const statusClass = row[h] === 'Active' ? 'active' : 'inactive';
          return `<td><span class="${statusClass}">${row[h]}</span></td>`;
        }
        return `<td>${row[h]}</td>`;
      }).join('')}</tr>`;
    });

    html += `</tbody></table></body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `businesses_${new Date().toISOString().slice(0, 10)}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton />
          <div className="min-w-0">
            <h1 className="page-title">{t("pages.business.title")}</h1>
            <p className="page-desc">{t("pages.business.description")}</p>
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            onClick={handleNewBusiness}
            className="btn-primary"
          >
            {t("pages.business.add")}
          </button>

          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="btn-ghost relative pl-10"
            >
              <Image
                src="/images/export.png"
                alt=""
                width={20}
                height={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <span>{t("common.export")}</span>
              <svg
                className={`ml-2 h-4 w-4 text-brand-faint transition-transform duration-200 ${
                  isExportOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 10l5 5 5-5"
                />
              </svg>
            </button>

            {isExportOpen && (
              <div className="menu-panel absolute right-0 z-10 mt-1 w-full min-w-[120px]">
                {exportOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleExportClick(option)}
                    className="menu-item"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="filter-row">
        <select
          value={status}
          onChange={handleStatusChange}
          className="field-control"
          aria-label="Filter by status"
        >
          {statusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="filter-grow">
          <input
            type="text"
            placeholder="Search By Name, Email or Phone"
            onChange={handleSearch}
            className="field-control"
            aria-label="Search businesses"
          />
        </div>

        <input
          type="date"
          onChange={(e) => onDateChange(e.target.value)}
          className="field-control"
          aria-label="Filter by date"
        />
      </div>
    </div>
  );
};

export default BusinessHeader;