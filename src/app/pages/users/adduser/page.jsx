"use client";

import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "@/app/API/method";
import { getApiErrorMessage } from "@/lib/apiResponse";
import PageHeader from "@/app/components/ux/PageHeader";
import Button from "@/app/components/ux/Button";

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canCreateStaff =
    typeof window !== "undefined" &&
    localStorage.getItem("admin_role") === "super_admin";

  const roleOptions = useMemo(() => {
    const options = [{ value: "user", label: "User" }];
    if (canCreateStaff) {
      options.unshift({ value: "admin", label: "Admin" });
    }
    return options;
  }, [canCreateStaff]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "user",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .matches(/^[0-9+]+$/, "Phone Number must be digits"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await postData("/admin-panel/signup", {
          email: values.email,
          password: values.password,
          name: values.fullName,
          phone_number: values.phoneNumber,
          role: values.role,
        });
        resetForm();
        toast.success("User created successfully");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to create user"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="page-shell">
      <ToastContainer position="top-right" autoClose={3000} />
      <PageHeader
        showBack
        title="Add User"
        description="Create a new platform user or staff account."
      />

      <div className="mx-auto w-full max-w-xl p-4 sm:p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`field-control ${
                formik.touched.fullName && formik.errors.fullName
                  ? "field-control--error"
                  : ""
              }`}
              required
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="field-error">{formik.errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`field-control ${
                formik.touched.email && formik.errors.email
                  ? "field-control--error"
                  : ""
              }`}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <p className="field-error">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`field-control ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "field-control--error"
                  : ""
              }`}
              required
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="field-error">{formik.errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="relative isolate flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`relative z-0 field-control pr-11 ${
                  formik.touched.password && formik.errors.password
                    ? "field-control--error"
                    : ""
                }`}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={0}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword((v) => !v);
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md bg-white p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 pointer-events-none" aria-hidden />
                ) : (
                  <FiEye className="h-5 w-5 pointer-events-none" aria-hidden />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="field-error">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="field-control"
              required
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!canCreateStaff && (
              <p className="field-hint">
                Only a Super Admin can create staff accounts.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => formik.resetForm()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
