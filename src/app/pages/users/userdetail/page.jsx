"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiEdit2, FiMail, FiPhone, FiShield, FiClock } from "react-icons/fi";
import { getData } from "@/app/API/method";
import EditUserdetailModal from "@/app/components/Users/EditUserdetailModal";
import ListingTabbar from "@/app/components/Listing/ListingTabbar";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import ActionMenu from "@/app/components/ux/ActionMenu";
import ProfileAvatar from "@/app/components/ux/ProfileAvatar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

function formatDate(value) {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "N/A";
  }
}

function initialsFrom(user) {
  const source = String(user?.name || user?.email || user?.username || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function MetaCard({ label, children }) {
  return (
    <div className="user-detail-meta">
      <span className="user-detail-meta__label">{label}</span>
      <div className="user-detail-meta__value">{children}</div>
    </div>
  );
}

const Userdetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [OpenEditModal, setEditModalOpen] = useState(false);

  const loadUser = useCallback(async () => {
    if (!userId) {
      setError({ message: "User id is required" });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await getData(`/admin-panel/users/${userId}`);
      setUserData(response?.data || null);
      setError(null);
    } catch (err) {
      setError({
        message: err.response?.data?.message || "Failed to load user",
      });
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const OpeModal = () => {
    setEditModalOpen((prev) => !prev);
  };

  const roleLabel = useMemo(() => {
    if (!userData) return "Client";
    if (userData.is_superuser) return "Super Admin";
    if (userData.is_staff) return "Admin";
    if (String(userData.role || "").toLowerCase() === "admin") return "Admin";
    return "Client";
  }, [userData]);

  const downloadAsPDF = () => {
    if (!userData) {
      toast.error("No user data available to download");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`User Details - ${userData.username || "User"}`, 14, 20);
    doc.setFontSize(12);
    let yPosition = 40;
    const lines = [
      `Name: ${userData.name || "N/A"}`,
      `Username: ${userData.username || "N/A"}`,
      `Email: ${userData.email || "N/A"}`,
      `Phone: ${userData.phone_number || "N/A"}`,
      `Status: ${userData.is_active ? "Active" : "Inactive"}`,
      `Created At: ${formatDate(userData.created_at)}`,
      `Last Updated: ${formatDate(userData.updated_at)}`,
      `Role: ${roleLabel}`,
      `Email Verified: ${userData.is_email_verified ? "Yes" : "No"}`,
      `Phone Verified: ${userData.is_phone_verified ? "Yes" : "No"}`,
      `Warned: ${userData.is_warned ? "Yes" : "No"}`,
      `Banned: ${userData.is_banned ? "Yes" : "No"}`,
    ];
    lines.forEach((line) => {
      doc.text(line, 10, yPosition);
      yPosition += 10;
    });
    doc.save(`user_details_${userData.username || "user"}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  const downloadAsCSV = () => {
    if (!userData) {
      toast.error("No user data available to download");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet([
      {
        Name: userData.name || "N/A",
        Username: userData.username || "N/A",
        Email: userData.email || "N/A",
        "Phone Number": userData.phone_number || "N/A",
        "Account Status": userData.is_active ? "Active" : "Inactive",
        "Email Verified": userData.is_email_verified ? "Yes" : "No",
        "Phone Verified": userData.is_phone_verified ? "Yes" : "No",
        Role: roleLabel,
        "Created At": formatDate(userData.created_at),
        "Last Updated": formatDate(userData.updated_at),
        Warned: userData.is_warned ? "Yes" : "No",
        Banned: userData.is_banned ? "Yes" : "No",
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Details");
    XLSX.writeFile(
      workbook,
      `user_details_${userData.username || "user"}.csv`
    );
    toast.success("CSV downloaded successfully!");
  };

  if (loading) {
    return (
      <ListingPageChrome
        showBack
        title="User Details"
        description="Loading profile…"
      >
        <PageState status="loading" title="Loading user data..." />
      </ListingPageChrome>
    );
  }

  if (error) {
    return (
      <ListingPageChrome
        showBack
        title="User Details"
        description="Something went wrong."
      >
        <PageState
          status="error"
          title="Unable to load user"
          description={error.message}
          onRetry={() => router.refresh()}
        />
      </ListingPageChrome>
    );
  }

  if (!userData) {
    return (
      <ListingPageChrome
        showBack
        title="User Details"
        description="No profile found."
      >
        <PageState status="empty" title="No user data available" />
      </ListingPageChrome>
    );
  }

  const displayName = userData.name || userData.username || "User";
  const avatarUrl =
    userData.profile_picture || userData.image || userData.avatar || "";

  return (
    <div className="page-shell user-detail-page">
      <PageHeader
        showBack
        title="User Details"
        description="Review profile info, export records, and manage this user’s listings."
        actions={
          <ActionMenu
            label="Download"
            items={[
              { label: "Download as PDF", onClick: downloadAsPDF },
              { label: "Download as CSV", onClick: downloadAsCSV },
            ]}
          />
        }
      />

      <section className="user-detail-panel">
        <div className="user-detail-hero">
          <div className="user-detail-hero__glow" aria-hidden />
          <div className="user-detail-hero__row">
            <ProfileAvatar
              src={avatarUrl}
              className="user-detail-avatar admin-profile-avatar"
              initials={initialsFrom(userData)}
            />

            <div className="user-detail-hero__copy min-w-0 flex-1">
              <div className="user-detail-kicker">
                <FiShield size={14} aria-hidden />
                <span>Account profile</span>
              </div>
              <h2 className="user-detail-name">{displayName}</h2>
              <p className="user-detail-email">
                <FiMail size={14} aria-hidden />
                <span>{userData.email || userData.username || "N/A"}</span>
              </p>
              <div className="user-detail-chips">
                <span
                  className={`badge ${
                    userData.is_active ? "badge-active" : "badge-danger"
                  }`}
                >
                  {userData.is_active ? "Active" : "Inactive"}
                </span>
                <span
                  className={`badge ${
                    roleLabel === "Client" ? "badge-neutral" : "badge-brand"
                  }`}
                >
                  {roleLabel}
                </span>
                <span
                  className={`badge ${
                    userData.is_email_verified ? "badge-info" : "badge-danger"
                  }`}
                >
                  Email {userData.is_email_verified ? "verified" : "unverified"}
                </span>
                <span
                  className={`badge ${
                    userData.is_phone_verified ? "badge-info" : "badge-danger"
                  }`}
                >
                  Phone {userData.is_phone_verified ? "verified" : "unverified"}
                </span>
              </div>
            </div>

            <div className="user-detail-hero__actions">
              <button type="button" className="btn-primary" onClick={OpeModal}>
                <FiEdit2 size={16} aria-hidden />
                Edit profile
              </button>
            </div>
          </div>
        </div>

        <div className="user-detail-grid">
          <MetaCard label="Full name">{userData.name || "N/A"}</MetaCard>
          <MetaCard label="Email">{userData.email || "N/A"}</MetaCard>
          <MetaCard label="Phone number">
            <span className="inline-flex items-center gap-1.5">
              <FiPhone size={14} className="opacity-60" aria-hidden />
              {userData.phone_number || "N/A"}
            </span>
          </MetaCard>
          <MetaCard label="Role">{roleLabel}</MetaCard>
          <MetaCard label="Created">
            <span className="inline-flex items-center gap-1.5">
              <FiClock size={14} className="opacity-60" aria-hidden />
              {formatDate(userData.created_at)}
            </span>
          </MetaCard>
          <MetaCard label="Last update">
            {formatDate(userData.updated_at)}
          </MetaCard>
          <MetaCard label="Warned">
            {userData.is_warned ? "Yes" : "No"}
          </MetaCard>
          <MetaCard label="Banned">
            {userData.is_banned ? (
              <span className="text-[var(--brand-danger)] font-semibold">Yes</span>
            ) : (
              "No"
            )}
          </MetaCard>
        </div>
      </section>

      <EditUserdetailModal
        isOpen={OpenEditModal}
        onClose={() => setEditModalOpen(false)}
        onSaved={loadUser}
        userData={userData}
      />

      <div className="user-detail-listings">
        <div className="user-detail-listings__head">
          <h3 className="user-detail-listings__title">Listings</h3>
          <p className="user-detail-listings__desc">
            Browse and manage every listing owned by this account.
          </p>
        </div>
        <ListingTabbar userId={userId} />
      </div>
    </div>
  );
};

export default Userdetail;
