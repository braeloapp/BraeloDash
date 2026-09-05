"use client";
import React, { useState, useEffect } from 'react';
import BusinessHeader from '@/app/components/Business/BusinessHeader';
import BusinessTable from '@/app/components/Business/BusinessTable';
import { getData } from "@/app/API/method";
import { debounce } from "lodash";

const BusinessPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);

  // Fetch all businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await getData('/admin-panel/business');
        if (response && response.data) {
          const mappedData = response.data.results.map(item => ({
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
            business_logo: item.business_logo?.[0] || "",
          }));
          setBusinesses(mappedData);
          setFilteredBusinesses(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = [...businesses];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(business => 
        business.BusinessName?.toLowerCase().includes(query) ||
        business.Email?.toLowerCase().includes(query) ||
        business["Phone Number"]?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(business => {
        if (statusFilter === "Active") return business.Status === "Active";
        if (statusFilter === "Inactive") return business.Status === "Inactive";
        return true;
      });
    }
    
    // Apply date filter
    if (dateFilter) {
      result = result.filter(business => {
        const businessDate = new Date(business["Date Created"]).toISOString().split('T')[0];
        return businessDate === dateFilter;
      });
    }
    
    // Apply verification filter
    if (verificationFilter) {
      result = result.filter(business => {
        if (verificationFilter === "Verify Email") return true;
        if (verificationFilter === "Verify Phone Number") return true;
        return true;
      });
    }
    
    setFilteredBusinesses(result);
  }, [businesses, searchQuery, statusFilter, dateFilter, verificationFilter]);

  // Debounced search handler
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 500);

  // Status filter handler
  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  // Date filter handler
  const handleDateChange = (date) => {
    setDateFilter(date);
  };

  // Verification filter handler
  const handleVerificationChange = (status) => {
    setVerificationFilter(status);
  };

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await getData('/admin-panel/business');
      if (response && response.data) {
        const mappedData = response.data.results.map(item => ({
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
          business_logo: item.business_logo?.[0] || "",
        }));
        setBusinesses(mappedData);
        setFilteredBusinesses(mappedData);
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <BusinessHeader 
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onVerificationChange={handleVerificationChange}
        data={filteredBusinesses}
        selectedBusinesses={selectedBusinesses}
      />
      <div className="p-4">
        <BusinessTable 
          data={filteredBusinesses} 
          loading={loading}
          onRefresh={handleRefresh}
          selectedBusinesses={selectedBusinesses}
          onSelectionChange={setSelectedBusinesses}
        />
      </div>
    </div>
  );
};

export default BusinessPage;