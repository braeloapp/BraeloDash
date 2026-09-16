"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { getData, postData } from "@/app/API/method";
import AppLoader from "@/app/components/ux/AppLoader";
import AppModal from "@/app/components/ux/AppModal";
import ProfileAvatar from "@/app/components/ux/ProfileAvatar";
import {
  ADMIN_DEFAULT_AVATAR,
  adminRoleLabel,
  getAdminToken,
  persistAdminSession,
  resolveAdminAvatar,
} from "@/lib/adminAuth";

const defaultUserData = {
  id: null,
  name: "",
  first_name: "",
  last_name: "",
  dob: "",
  gender: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zip_code: "",
  phoneNumber: "",
  email: "",
  bio: "",
  image: ADMIN_DEFAULT_AVATAR,
  role: "",
};

function MetaCard({ label, children }) {
  return (
    <div className="user-detail-meta">
      <p className="user-detail-meta__label">{label}</p>
      <div className="user-detail-meta__value">{children}</div>
    </div>
  );
}

function displayValue(value, fallback = "Not provided") {
  if (value == null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function formatApiError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Failed to update profile";
  if (typeof data === "string") return data;
  if (data.message) return String(data.message);
  if (data.error) return String(data.error);
  const first = Object.values(data).flat()?.[0];
  return first ? String(first) : "Failed to update profile";
}

const AdminCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultUserData);
  const [editForm, setEditForm] = useState(defaultUserData);
  const [previewImage, setPreviewImage] = useState(ADMIN_DEFAULT_AVATAR);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [profileResponse, meResponse] = await Promise.allSettled([
          getData("/auth/user/profile"),
          getData("/admin-panel/me"),
        ]);

        const profile =
          profileResponse.status === "fulfilled"
            ? profileResponse.value?.data || profileResponse.value
            : null;
        const me =
          meResponse.status === "fulfilled"
            ? meResponse.value?.data || meResponse.value
            : null;

        if (!profile && !me) {
          throw new Error("Failed to fetch user data");
        }

        const rawImage =
          profile?.image ||
          profile?.profile_picture ||
          me?.profile_picture ||
          "";
        const avatar = resolveAdminAvatar(rawImage);

        const userData = {
          id: me?.id || profile?.id || null,
          name: me?.name || profile?.name || "",
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          dob: profile?.dob || "",
          gender: profile?.gender || "",
          address: profile?.address || "",
          country: profile?.country || "",
          state: profile?.state || "",
          city: profile?.city || "",
          zip_code: profile?.zip_code || "",
          phoneNumber: profile?.phone_number || profile?.phone || "",
          email: me?.email || profile?.email || "",
          bio: profile?.bio || "",
          image: avatar,
          role: me?.role || "",
        };

        setFormData(userData);
        setEditForm(userData);
        setPreviewImage(avatar);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const roleLabel = useMemo(
    () => adminRoleLabel(formData.role),
    [formData.role]
  );

  const displayName = useMemo(() => {
    const combined = [formData.name, formData.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (combined) return combined;
    if (formData.first_name?.trim()) return formData.first_name.trim();
    return "Admin";
  }, [formData.name, formData.last_name, formData.first_name]);

  const openModal = () => {
    setEditForm({ ...formData });
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.id) {
      setModalError("Missing admin user id. Please refresh and try again.");
      return;
    }

    try {
      setIsSaving(true);
      setModalError(null);

      const payload = {
        user_id: formData.id,
        name: editForm.name.trim(),
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phoneNumber.trim(),
        dob: editForm.dob.trim(),
        gender: editForm.gender.trim(),
        address: editForm.address.trim(),
        country: editForm.country.trim(),
        state: editForm.state.trim(),
        city: editForm.city.trim(),
        zip_code: editForm.zip_code.trim(),
      };

      const response = await postData("/admin-panel/user/update", payload);
      const ok =
        response?.status === 200 ||
        response?.success === true ||
        /success/i.test(String(response?.message || ""));

      if (!(ok || (response && !response.error))) {
        throw new Error(
          response?.message || response?.error || "Failed to update profile"
        );
      }

      const next = {
        ...formData,
        name: payload.name,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phoneNumber: payload.phone,
        dob: payload.dob,
        gender: payload.gender,
        address: payload.address,
        country: payload.country,
        state: payload.state,
        city: payload.city,
        zip_code: payload.zip_code,
      };

      setFormData(next);
      setEditForm(next);
      persistAdminSession({
        token: getAdminToken(),
        name: next.name || "Admin",
        role: formData.role,
      });
      setIsModalOpen(false);
    } catch (err) {
      setModalError(formatApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AppLoader />;
  }

  if (error) {
    return (
      <div className="user-detail-panel p-8 text-center">
        <h3 className="text-lg font-semibold text-[var(--color-danger)] mb-2">
          Error loading profile
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="user-detail-panel admin-profile-panel">
        <div className="user-detail-hero">
          <div className="user-detail-hero__glow" aria-hidden />
          <div className="user-detail-hero__row">
            <ProfileAvatar
              src={previewImage}
              className="user-detail-avatar admin-profile-avatar"
              fallbackSrc={ADMIN_DEFAULT_AVATAR}
            />

            <div className="user-detail-hero__copy min-w-0 flex-1">
              <div className="user-detail-kicker">
                <FiShield size={14} aria-hidden />
                <span>Administrator</span>
              </div>
              <h2 className="user-detail-name">{displayName}</h2>
              <p className="user-detail-email">
                <FiMail size={14} aria-hidden />
                <span>{displayValue(formData.email, "No email on file")}</span>
              </p>
              <div className="user-detail-chips">
                <span className="badge badge-brand">{roleLabel}</span>
                <span className="badge badge-neutral">Staff access</span>
              </div>
            </div>

            <div className="user-detail-hero__actions">
              <button type="button" className="btn-primary" onClick={openModal}>
                <FiEdit2 size={16} aria-hidden />
                Edit profile
              </button>
            </div>
          </div>
        </div>

        <div className="admin-profile-section">
          <div className="admin-profile-section__head">
            <h3 className="admin-profile-section__title">
              <FiUser size={16} aria-hidden />
              Personal information
            </h3>
            <p className="admin-profile-section__desc">
              Details linked to your Braelo admin account.
            </p>
          </div>

          <div className="user-detail-grid">
            <MetaCard label="Full name">
              {displayValue(formData.name, "—")}
            </MetaCard>
            <MetaCard label="First name">
              {displayValue(formData.first_name, "—")}
            </MetaCard>
            <MetaCard label="Last name">
              {displayValue(formData.last_name, "—")}
            </MetaCard>
            <MetaCard label="Date of birth">
              {displayValue(formData.dob)}
            </MetaCard>
            <MetaCard label="Gender">
              {displayValue(formData.gender, "Not specified")}
            </MetaCard>
            <MetaCard label="Phone number">
              <span className="inline-flex items-center gap-1.5">
                <FiPhone size={14} className="opacity-60" aria-hidden />
                {displayValue(formData.phoneNumber)}
              </span>
            </MetaCard>
            <MetaCard label="Email address">
              <span className="inline-flex items-center gap-1.5">
                <FiMail size={14} className="opacity-60" aria-hidden />
                {displayValue(formData.email)}
              </span>
            </MetaCard>
            <MetaCard label="Address">
              <span className="inline-flex items-center gap-1.5">
                <FiMapPin size={14} className="opacity-60" aria-hidden />
                {displayValue(formData.address)}
              </span>
            </MetaCard>
            <MetaCard label="Country">
              {displayValue(formData.country)}
            </MetaCard>
            <MetaCard label="State">{displayValue(formData.state)}</MetaCard>
            <MetaCard label="City">{displayValue(formData.city)}</MetaCard>
            <MetaCard label="Zip code">
              {displayValue(formData.zip_code)}
            </MetaCard>
          </div>
        </div>
      </section>

      <AppModal
        open={isModalOpen}
        onClose={closeModal}
        title="Update profile"
        description="Edit your administrator account details."
        confirmLabel="Save changes"
        confirmLoading={isSaving}
        onConfirm={handleSaveProfile}
        size="lg"
      >
        {modalError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {modalError}
          </div>
        ) : null}

        <div className="mb-5 flex items-center gap-3">
          <ProfileAvatar
            src={previewImage}
            className="user-detail-avatar admin-profile-avatar admin-profile-avatar--sm"
            fallbackSrc={ADMIN_DEFAULT_AVATAR}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {editForm.name || displayName}
            </p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">
              {editForm.email || formData.email}
            </p>
          </div>
        </div>

        <div className="grid max-h-[55vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="admin-profile-name">
              Full name
            </label>
            <input
              id="admin-profile-name"
              name="name"
              type="text"
              value={editForm.name}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-email">
              Email
            </label>
            <input
              id="admin-profile-email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-first">
              First name
            </label>
            <input
              id="admin-profile-first"
              name="first_name"
              type="text"
              value={editForm.first_name}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-last">
              Last name
            </label>
            <input
              id="admin-profile-last"
              name="last_name"
              type="text"
              value={editForm.last_name}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-phone">
              Phone number
            </label>
            <input
              id="admin-profile-phone"
              name="phoneNumber"
              type="tel"
              value={editForm.phoneNumber}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-dob">
              Date of birth
            </label>
            <input
              id="admin-profile-dob"
              name="dob"
              type="text"
              placeholder="YYYY-MM-DD"
              value={editForm.dob}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-gender">
              Gender
            </label>
            <select
              id="admin-profile-gender"
              name="gender"
              value={editForm.gender}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            >
              <option value="">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-zip">
              Zip code
            </label>
            <input
              id="admin-profile-zip"
              name="zip_code"
              type="text"
              value={editForm.zip_code}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="admin-profile-address">
              Address
            </label>
            <input
              id="admin-profile-address"
              name="address"
              type="text"
              value={editForm.address}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-country">
              Country
            </label>
            <input
              id="admin-profile-country"
              name="country"
              type="text"
              value={editForm.country}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-profile-state">
              State
            </label>
            <input
              id="admin-profile-state"
              name="state"
              type="text"
              value={editForm.state}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="admin-profile-city">
              City
            </label>
            <input
              id="admin-profile-city"
              name="city"
              type="text"
              value={editForm.city}
              onChange={handleEditChange}
              className="field-control"
              disabled={isSaving}
            />
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default AdminCard;
