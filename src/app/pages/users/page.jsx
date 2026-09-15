"use client";
import React, { useState, useEffect } from "react";
import UserHeader from "@/app/components/Users/UserHeader";
import UserDataTable from "@/app/components/Users/UserDataTable";
import { getData } from "@/app/API/method";
import { debounce } from "lodash";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getData("/admin-panel/users");
        setUsers(response.data.results || []);
        setFilteredUsers(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(user => {
        if (statusFilter === "active") return user.is_active;
        if (statusFilter === "inactive") return !user.is_active;
        return true;
      });
    }
    
    // Apply date filter
    if (dateFilter) {
      result = result.filter(user => {
        const userDate = new Date(user.created_at).toISOString().split('T')[0];
        return userDate === dateFilter;
      });
    }
    
    // Apply verification filter
    if (verificationFilter) {
      result = result.filter(user => {
        if (verificationFilter === "verify-email") return user.is_email_verified;
        if (verificationFilter === "verify-phone") return user.is_phone_verified;
        return true;
      });
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, statusFilter, dateFilter, verificationFilter]);

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

  return (
    <div className="page-shell">
      <UserHeader 
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onVerificationChange={handleVerificationChange}
        data={filteredUsers} // Pass filtered data for export
      />
      <div className="p-4">
        <UserDataTable 
          data={filteredUsers} 
          loading={loading} 
          onRefresh={() => {
            setLoading(true);
            getData("/admin-panel/users")
              .then(response => {
                setUsers(response.data.results || []);
                setFilteredUsers(response.data.results || []);
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }}
        />
      </div>
    </div>
  );
};

export default UsersPage;