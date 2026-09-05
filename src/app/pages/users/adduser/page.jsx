"use client";

import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "@/app/components/BackButton";
import { postData } from "@/app/API/method";
import { getApiErrorMessage } from "@/lib/apiResponse";

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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow-md rounded-md">
        <div className="flex items-center gap-2 mb-5">
          <BackButton />
          <h2 className="text-2xl font-semibold text-center">Add User</h2>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.fullName && formik.errors.fullName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500">{formik.errors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-red-500">{formik.errors.phoneNumber}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
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
                className={`relative z-0 w-full p-2 pr-11 border rounded-md ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
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
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-1.5 text-gray-600 hover:text-[#232F30] rounded-md focus:outline-none focus:ring-2 focus:ring-[#CD9403] bg-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5 pointer-events-none" aria-hidden />
                ) : (
                  <FiEye className="w-5 h-5 pointer-events-none" aria-hidden />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-md"
              required
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!canCreateStaff && (
              <p className="text-xs text-gray-500 mt-1">
                Only a Super Admin can create staff accounts.
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#CD9403] text-white font-bold py-2 px-4 rounded hover:bg-[#b37f02] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
