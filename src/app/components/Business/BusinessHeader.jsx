"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../BackButton";
import Image from "next/image";
import { utils, writeFileXLSX } from "xlsx";

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
        <div className="flex min-w-0 items-center gap-2">
          <BackButton/>
          <h1 className="page-title">
            Business Overview
          </h1>
        </div>
        <div className="page-actions">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleNewBusiness}
              className="btn-primary"
            >
              Add Business
            </button>
            
            <div className="relative">
              <div
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-2 py-2 cursor-pointer focus:outline-none"
              >
                <Image
                  src="/images/export.png"
                  alt="export icon"
                  className="absolute left-3"
                  width={20}
                  height={20}
                />
                <span className="text-[#75818D] text-[14px] font-[400]">
                  Export
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 ml-2 transition-transform duration-200 ${
                    isExportOpen ? "transform rotate-180" : ""
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
              </div>

              {isExportOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {exportOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleExportClick(option)}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer font-[500] text-[12px] text-[#75818D]"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="filter-row">
        <div className="min-w-[160px]">
          <select
            value={status}
            onChange={handleStatusChange}
            className="field-control"
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
        </div>
        
        <div className="filter-grow">
          <input
            type="text"
            placeholder="Search By Name, Email or Phone"
            onChange={handleSearch}
            className="field-control"
          />
        </div>
        
        <div className="min-w-[160px]">
          <input
            type="date"
            onChange={(e) => onDateChange(e.target.value)}
            className="field-control"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;