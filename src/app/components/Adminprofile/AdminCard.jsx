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

const AdminCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultUserData);
  const [previewImage, setPreviewImage] = useState(ADMIN_DEFAULT_AVATAR);
  const [editName, setEditName] = useState("");
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
        setPreviewImage(avatar);
        setEditName(userData.name || "");
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
    setEditName(formData.name || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleSaveName = async () => {
    try {
      setIsSaving(true);
      setModalError(null);
      const response = await postData("/auth/update/profile", {
        name: editName.trim(),
      });
      const nextName = response?.name || response?.data?.name || editName.trim();
      setFormData((prev) => ({ ...prev, name: nextName }));
      persistAdminSession({
        token: getAdminToken(),
        name: nextName,
        role: formData.role,
      });
      setIsModalOpen(false);
    } catch (err) {
      setModalError(
        err.response?.data?.message || err.message || "Failed to update name"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AppLoader label="Loading profile data..." />;
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
            <div className="user-detail-meta md:col-span-2">
              <p className="user-detail-meta__label">Bio</p>
              <div className="user-detail-meta__value">
                {displayValue(formData.bio, "No bio provided")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppModal
        open={isModalOpen}
        onClose={closeModal}
        title="Update profile"
        description="Change the display name shown across the admin panel."
        confirmLabel="Save changes"
        confirmLoading={isSaving}
        onConfirm={handleSaveName}
        size="sm"
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
              {displayName}
            </p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">
              {formData.email}
            </p>
          </div>
        </div>
        <label className="field-label" htmlFor="admin-profile-name">
          Full name
        </label>
        <input
          id="admin-profile-name"
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="field-control"
          required
          disabled={isSaving}
        />
      </AppModal>
    </>
  );
};

export default AdminCard;
