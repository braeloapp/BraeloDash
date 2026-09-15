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
      Role: user.role === 'admin' || user.role === true ? 'Admin' : 'Client'
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
        <div className="flex min-w-0 items-center gap-2">
          <BackButton/>
          <h1 className="page-title">
            User Overview
          </h1>
        </div>
        <div className="page-actions">
          <div>
            <button 
              onClick={() => router.push("/pages/users/adduser")} 
              className="btn-primary"
            >
              Add user
            </button>
          </div>
          <div className="relative inline-block">
            <div className="relative">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-2 py-2 cursor-pointer focus:outline-none hover:bg-gray-50 transition"
              >
                <Image
                  src="/images/export.png"
                  alt="export icon"
                  width={24}
                  height={22}
                  className="absolute left-3"
                />
                <span className="text-[#75818D] text-[16px] font-[400]">
                  Export
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 ml-2 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
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
              
              {isOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer font-[500] text-[12px] text-[#75818D] transition"
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

      <div>
        <div className="filter-row">
          <div className="relative min-w-[140px]">
            <select
              onChange={(e) => onStatusChange(e.target.value)}
              className="field-control appearance-none"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-grow relative">
            <input
              type="text"
              placeholder="Search By Name or Email"
              className="field-control pr-10"
              onChange={(e) => onSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <img
                src="/Seacrh (1).png"
                alt="Search"
                width={16}
                height={16}
              />
            </div>
          </div>

          <div className="relative min-w-[150px]">
            <input
              type="date"
              className="field-control"
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          <div className="relative min-w-[170px]">
            <select
              onChange={(e) => onVerificationChange(e.target.value)}
              className="field-control"
            >
              <option value="">Verification Status</option>
              <option value="verify-email">Email Verified</option>
              <option value="verify-phone">Phone Verified</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;