"use client";
import React, { useState, useEffect, useCallback } from "react";
import BusinessHeader from "@/app/components/Business/BusinessHeader";
import BusinessTable from "@/app/components/Business/BusinessTable";
import { getData } from "@/app/API/method";
import { debounce } from "@/lib/debounce";

const PAGE_SIZE = 10;

function mapBusiness(item) {
  return {
    ID: item.id,
    documentId: item.id,
    BusinessName: item.business_name,
    Email: item.business_email,
    "Phone Number": item.business_number,
    website: item.business_website,
    BusinessType: item.business_category,
    Status: item.is_active ? "Active" : "Inactive",
    "Date Created": new Date(item.created_at).toLocaleDateString(),
    "Last Update": new Date(item.updated_at).toLocaleDateString(),
    Coordinates: item.business_address,
    businessId: item.user_id,
    user_id: item.user_id,
    business_logo: item.business_logo?.[0] || "",
  };
}

const BusinessPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalRecords, setTotalRecords] = useState(0);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (statusFilter === "Active") params.set("is_active", "true");
    if (statusFilter === "Inactive") params.set("is_active", "false");
    if (dateFilter) params.set("creation_date", dateFilter);
    return params.toString();
  }, [page, pageSize, searchQuery, statusFilter, dateFilter]);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getData(`/admin-panel/business?${buildParams()}`);
      const payload = response?.data || {};
      const rows = (payload.results || []).map(mapBusiness);
      setBusinesses(rows);
      setTotalRecords(Number(payload.count) || rows.length);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      setBusinesses([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleSearch = useCallback(
    debounce((query) => {
      setPage(1);
      setSearchQuery(query);
    }, 500),
    []
  );

  return (
    <div className="page-shell">
      <BusinessHeader
        onSearch={handleSearch}
        onStatusChange={(status) => {
          setPage(1);
          setStatusFilter(status);
        }}
        onDateChange={(date) => {
          setPage(1);
          setDateFilter(date);
        }}
        onVerificationChange={() => {}}
        data={businesses}
        selectedBusinesses={selectedBusinesses}
      />
      <div className="p-4">
        <BusinessTable
          data={businesses}
          loading={loading}
          onRefresh={fetchBusinesses}
          selectedBusinesses={selectedBusinesses}
          onSelectionChange={setSelectedBusinesses}
          totalRecords={totalRecords}
          first={(page - 1) * pageSize}
          rows={pageSize}
          onPageChange={(event) => {
            setPage(Math.floor(event.first / event.rows) + 1);
            setPageSize(event.rows);
          }}
        />
      </div>
    </div>
  );
};

export default BusinessPage;
