"use client";
import React, { useState } from "react";
import Image from "next/image";
import BackButton from "../BackButton";
import { useRouter } from "next/navigation";
import { utils, writeFileXLSX } from "xlsx";

const UserHeader = ({
  onSearch,
  onStatusChange,
  onDateChange,
  onVerificationChange,
  data
}) => {
  const options = [
    { value: "csv", label: "CSV" },
    { value: "xlsx", label: "XLSX" },
    { value: "html", label: "HTML" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const router = useRouter();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    handleExport(option.value);
  };

  const handleExport = (format) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare the data for export
    const exportData = data.map(user => ({
      ID: user.id,
      Email: user.email,
      'Full Name': user.name,
      Status: user.is_active ? 'Active' : 'Inactive',
      'Email Verified': user.is_email_verified ? 'Verified' : 'Unverified',
      'Phone Verified': user.is_phone_verified ? 'Verified' : 'Unverified',
      'Date Created': user.created_at,
      Role:
        (user.is_staff === true && user.is_superuser === true) ||
        user.is_staff === true ||
        user.is_superuser === true ||
        user.role === "admin" ||
        user.role === true ||
        String(user.role || "").toLowerCase() === "super_admin"
          ? "Admin"
          : "Client",
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
    link.setAttribute('download', `users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Users");
    writeFileXLSX(workbook, `users_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToHTML = (data) => {
    const headers = Object.keys(data[0]);
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Users Export</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  </style>
</head>
<body>
  <h1>Users Export - ${new Date().toLocaleDateString()}</h1>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>`;

    data.forEach(row => {
      html += `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`;
    });

    html += `</tbody></table></body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_${new Date().toISOString().slice(0, 10)}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton />
          <div className="min-w-0">
            <h1 className="page-title">User Overview</h1>
            <p className="page-desc">Search, filter, and manage platform accounts.</p>
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            onClick={() => router.push("/pages/users/adduser")}
            className="btn-primary"
          >
            Add user
          </button>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="btn-ghost relative pl-10"
            >
              <Image
                src="/images/export.png"
                alt=""
                width={20}
                height={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <span>Export</span>
              <svg
                className={`ml-2 h-4 w-4 text-brand-faint transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
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

            {isOpen && (
              <div className="menu-panel absolute right-0 z-10 mt-1 w-full min-w-[120px]">
                {options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
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
          onChange={(e) => onStatusChange(e.target.value)}
          className="field-control"
          aria-label="Filter by status"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="filter-grow relative">
          <input
            type="text"
            placeholder="Search by name or email"
            className="field-control pr-10"
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search users"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <img src="/Seacrh (1).png" alt="" width={16} height={16} />
          </div>
        </div>

        <input
          type="date"
          className="field-control"
          onChange={(e) => onDateChange(e.target.value)}
          aria-label="Filter by date"
        />

        <select
          onChange={(e) => onVerificationChange(e.target.value)}
          className="field-control"
          aria-label="Filter by verification"
        >
          <option value="">Verification Status</option>
          <option value="verify-email">Email Verified</option>
          <option value="verify-phone">Phone Verified</option>
        </select>
      </div>
    </div>
  );
};

export default UserHeader;