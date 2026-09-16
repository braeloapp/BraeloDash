"use client";
import React, { useState, useEffect, useCallback } from "react";
import UserHeader from "@/app/components/Users/UserHeader";
import UserDataTable from "@/app/components/Users/UserDataTable";
import { getData } from "@/app/API/method";
import { debounce } from "@/lib/debounce";

const PAGE_SIZE = 10;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalRecords, setTotalRecords] = useState(0);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (statusFilter === "active") params.set("is_active", "true");
    if (statusFilter === "inactive") params.set("is_active", "false");
    if (dateFilter) params.set("creation_date", dateFilter);
    if (verificationFilter === "verify-email") params.set("verification", "email");
    if (verificationFilter === "verify-phone") params.set("verification", "phone");
    return params.toString();
  }, [page, pageSize, searchQuery, statusFilter, dateFilter, verificationFilter]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getData(`/admin-panel/users?${buildParams()}`);
      const payload = response?.data || {};
      setUsers(payload.results || []);
      setTotalRecords(Number(payload.count) || (payload.results || []).length);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback(
    debounce((query) => {
      setPage(1);
      setSearchQuery(query);
    }, 500),
    []
  );

  return (
    <div className="page-shell">
      <UserHeader
        onSearch={handleSearch}
        onStatusChange={(status) => {
          setPage(1);
          setStatusFilter(status);
        }}
        onDateChange={(date) => {
          setPage(1);
          setDateFilter(date);
        }}
        onVerificationChange={(status) => {
          setPage(1);
          setVerificationFilter(status);
        }}
        data={users}
      />
      <div className="p-4">
        <UserDataTable
          data={users}
          loading={loading}
          totalRecords={totalRecords}
          first={(page - 1) * pageSize}
          rows={pageSize}
          onPageChange={(event) => {
            setPage(Math.floor(event.first / event.rows) + 1);
            setPageSize(event.rows);
          }}
          onRefresh={fetchUsers}
        />
      </div>
    </div>
  );
};

export default UsersPage;
