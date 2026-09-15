"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getData } from "@/app/API/method";
import ChatModal from "@/app/components/ChatModal";
import EditUserdetailModal from "@/app/components/Users/EditUserdetailModal";
import ListingTabbar from "@/app/components/Listing/ListingTabbar";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import ActionMenu from "@/app/components/ux/ActionMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const Userdetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [OpenEditModal, setEditModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
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
        setError({ message: err.response?.data?.message || "Failed to load user" });
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const OpeModal = () => {
    setEditModalOpen((prev) => !prev);
  };

  const downloadAsPDF = () => {
    if (!userData) {
      toast.error("No user data available to download");
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(`User Details - ${userData.username || 'User'}`, 14, 20);
    
    // User details
    doc.setFontSize(12);
    let yPosition = 40;
    
    // Basic Info
    doc.text(`Name: ${userData.name || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Username: ${userData.username || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Email: ${userData.email || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Phone: ${userData.phone_number || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Status: ${userData.is_active ? 'Active' : 'Inactive'}`, 10, yPosition);
    yPosition += 15;
    
    // Additional Info
    doc.text(`Created At: ${new Date(userData.created_at).toLocaleString() || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Last Updated: ${new Date(userData.updated_at).toLocaleString() || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Role: ${userData.is_superuser ? 'Admin' : 'Client'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Email Verified: ${userData.is_email_verified ? 'Yes' : 'No'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Phone Verified: ${userData.is_phone_verified ? 'Yes' : 'No'}`, 10, yPosition);
    
    doc.save(`user_details_${userData.username || 'user'}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  const downloadAsCSV = () => {
    if (!userData) {
      toast.error("No user data available to download");
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Name": userData.name || 'N/A',
        "Username": userData.username || 'N/A',
        "Email": userData.email || 'N/A',
        "Phone Number": userData.phone_number || 'N/A',
        "Account Status": userData.is_active ? 'Active' : 'Inactive',
        "Email Verified": userData.is_email_verified ? 'Yes' : 'No',
        "Phone Verified": userData.is_phone_verified ? 'Yes' : 'No',
        "Role": userData.is_superuser ? 'Admin' : 'Client',
        "Created At": new Date(userData.created_at).toLocaleString() || 'N/A',
        "Last Updated": new Date(userData.updated_at).toLocaleString() || 'N/A',
        "Role": userData.is_superuser ? 'Admin' : (userData.is_staff ? 'Admin' : 'Client'),
        "Warned": userData.is_warned ? 'Yes' : 'No',
        "Banned": userData.is_banned ? 'Yes' : 'No',
      }
    ]);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Details");
    XLSX.writeFile(workbook, `user_details_${userData.username || 'user'}.csv`);
    toast.success("CSV downloaded successfully!");
  };

  if (loading) {
    return (
      <ListingPageChrome showBack title="User Details" description="Loading profile…">
        <PageState status="loading" title="Loading user data..." />
      </ListingPageChrome>
    );
  }

  if (error) {
    return (
      <ListingPageChrome showBack title="User Details" description="Something went wrong.">
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
      <ListingPageChrome showBack title="User Details" description="No profile found.">
        <PageState status="empty" title="No user data available" />
      </ListingPageChrome>
    );
  }

  return (
    <div className="page-shell">
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

      <div className="p-4 sm:p-5">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b py-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h2 className="text-[18px] font-[700] text-[#75818D]">
              {userData.username || "User Name"}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setModalOpen(true)}
            >
              <img src="/a7.png" alt="" className="cursor-pointer" />
              Chat
            </button>
            <button type="button" className="btn-primary" onClick={OpeModal}>
              <img src="/a17.png" alt="" className="cursor-pointer" />
              Edit
            </button>
          </div>
          <ChatModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
          <EditUserdetailModal
            isOpen={OpenEditModal}
            OpeModal={OpeModal}
            onClose={() => setEditModalOpen(false)}
            userData={userData}
          />
        </div>

        <div className="flex gap-[100px] mt-5 border-b py-5">
          <div>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D]">
              Name:
              <span className="font-[400] text-[#a0a8b1] ml-1 ">
                {userData.name || "N/A"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Email:
              <span className="font-[400] text-[#a0a8b1] ml-1 mt-3">
                {userData.email || "N/A"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Phone Number:
              <span className="font-[400] text-[#a0a8b1] ml-1 mt-3">
                {userData.phone_number || "N/A"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Account Status:
              <span
                className={`font-[400] px-5 py-2 text-white rounded-lg ml-1 mt-3 ${
                  userData.is_active ? "bg-[#06B64C]" : "bg-[#C7233F]"
                }`}
              >
                {userData.is_active ? "Active" : "Inactive"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Email Verified Status:
              <span
                className={`font-[400] ml-1 mt-3 ${
                  userData.is_email_verified
                    ? "text-[#5D86C2]"
                    : "text-[#C7233F]"
                }`}
              >
                {userData.is_email_verified ? "Verified" : "Unverified"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Phone Verified Status:{" "}
              <span
                className={`font-[400] ml-1 mt-3 ${
                  userData.is_phone_verified
                    ? "text-[#5D86C2]"
                    : "text-[#C7233F]"
                }`}
              >
                {userData.is_phone_verified ? "Verified" : "Unverified"}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D]">
              Created At:
              <span className="font-[400] text-[#a0a8b1] ml-1 mt-3">
                {new Date(userData.created_at).toLocaleString() || "N/A"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Last Update:
              <span className="font-[400] text-[#a0a8b1] ml-1 mt-3">
                {new Date(userData.updated_at).toLocaleString() || "N/A"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Role:
              <span className="font-[400] text-[#a0a8b1] ml-1">
                {userData.is_superuser || userData.is_staff ? "Admin" : "Client"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Warned:
              <span className="font-[400] text-[#a0a8b1] ml-1">
                {userData.is_warned ? "Yes" : "No"}
              </span>
            </h1>
            <h1 className="text-[16px] font-[700] font-plus text-[#75818D] mt-3">
              Banned:
              <span className="font-[400] text-[#a0a8b1] ml-1">
                {userData.is_banned ? "Yes" : "No"}
              </span>
            </h1>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Start Chat with User
            </h2>
            <p className="mb-4">
              Click below to send an email to:{" "}
              <strong>{userData.email}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
                  userData.email
                )}&su=Hello&body=Hi%20there!%20I%20wanted%20to%20connect%20with%20you.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-primary">
                  Open in Gmail
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      <div>
        <ListingTabbar userId={userData.id} />
      </div>
    </div>
  );
};

export default Userdetail;