"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postData } from "@/app/API/method";
import AppModal from "@/app/components/ux/AppModal";
import ProfileAvatar from "@/app/components/ux/ProfileAvatar";

function roleSelectValue(userData) {
  if (!userData) return "User";
  if (
    userData.is_staff ||
    userData.is_superuser ||
    String(userData.role || "").toLowerCase() === "admin"
  ) {
    return "Admin";
  }
  return "User";
}

const EditUserdetailModal = ({ isOpen, onClose, onSaved, userData }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    email: "",
    role: "User",
    phone_number: "",
    is_email_verified: false,
    is_phone_verified: false,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userData) return;
    setFormData({
      user_id: userData.id || "",
      name: userData.name || "",
      email: userData.email || "",
      role: roleSelectValue(userData),
      phone_number: userData.phone_number || "",
      is_email_verified: Boolean(userData.is_email_verified),
      is_phone_verified: Boolean(userData.is_phone_verified),
      is_active: Boolean(userData.is_active),
    });
  }, [userData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        user_id: formData.user_id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone_number.trim(),
        role: formData.role,
        is_active: formData.is_active,
        is_email_verified: formData.is_email_verified,
        is_phone_verified: formData.is_phone_verified,
      };

      const response = await postData("/admin-panel/user/update", payload);
      const ok =
        response?.status === 200 ||
        response?.success === true ||
        /success/i.test(String(response?.message || ""));

      if (ok || (response && !response.error)) {
        toast.success(response?.message || "User updated successfully!");
        onClose?.();
        await onSaved?.();
      } else {
        toast.error(
          response?.message || response?.error || "Failed to update user"
        );
      }
    } catch (error) {
      const data = error.response?.data;
      const detail =
        data?.email?.[0] ||
        data?.phone?.[0] ||
        data?.message ||
        data?.error ||
        (typeof data === "object" ? Object.values(data).flat()?.[0] : null) ||
        error.message ||
        "Failed to update user";
      toast.error(String(detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      open={Boolean(isOpen)}
      onClose={onClose}
      title="Edit profile"
      description="Update this account’s details. As staff you can change any field."
      confirmLabel="Save changes"
      confirmLoading={saving}
      onConfirm={handleSubmit}
      size="md"
    >
      <div className="mb-5 flex items-center gap-3">
        <ProfileAvatar
          src={
            userData?.profile_picture ||
            userData?.image ||
            userData?.avatar ||
            ""
          }
          className="user-detail-avatar admin-profile-avatar admin-profile-avatar--sm"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
            {formData.name || userData?.username || "User"}
          </p>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            {formData.email || "No email"} · {formData.role}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="edit-user-name">
            Full name
          </label>
          <input
            id="edit-user-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="field-control"
            required
            disabled={saving}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="edit-user-email">
            Email
          </label>
          <input
            id="edit-user-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="field-control"
            disabled={saving}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="edit-user-role">
            Role
          </label>
          <select
            id="edit-user-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="field-control"
            disabled={saving}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="edit-user-phone">
            Phone number
          </label>
          <input
            id="edit-user-phone"
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="field-control"
            disabled={saving}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[#fbfcfe] px-4 py-3">
          <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              name="is_email_verified"
              checked={formData.is_email_verified}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#CD9403] focus:ring-[#CD9403]"
              disabled={saving}
            />
            Email verified
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              name="is_phone_verified"
              checked={formData.is_phone_verified}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#CD9403] focus:ring-[#CD9403]"
              disabled={saving}
            />
            Phone verified
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#CD9403] focus:ring-[#CD9403]"
              disabled={saving}
            />
            Active account
          </label>
        </div>
      </div>
    </AppModal>
  );
};

export default EditUserdetailModal;
