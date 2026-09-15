"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BackButton from "@/app/components/BackButton";
import Image from "next/image";

const AddCategory = () => {
  const formik = useFormik({
    initialValues: {
      categoryName: "",
      image: null,
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Category name is required"),
      image: Yup.mixed()
        .required("An image is required")
        .test("fileSize", "File too large", (value) => {
          return value && value.size <= 2000000; // Limit to 2MB
        })
        .test("fileType", "Unsupported File Format", (value) => {
          return (
            value &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          );
        }),
    }),
    onSubmit: (values) => {
      console.log({
        categoryName: values.categoryName,
        image: values.image,
      });
      // Here you can also make your API call
    },
  });

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      formik.setFieldValue("imagePreview", URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    formik.resetForm();
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-2xl border border-[#EEF1F4] bg-white p-4 shadow-card sm:p-6"
      >
        <div className="page-header mb-4 px-0">
          <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">
             Add Category
          </h1>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Category Name</label>
          <input
            type="text"
            id="categoryName"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`w-full border rounded p-2 ${
              formik.touched.categoryName && formik.errors.categoryName
                ? "border-red-500"
                : ""
            }`}
          />
          {formik.touched.categoryName && formik.errors.categoryName ? (
            <div className="text-red-600">{formik.errors.categoryName}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Upload Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className={`w-full border rounded p-2 ${
              formik.touched.image && formik.errors.image
                ? "border-red-500"
                : ""
            }`}
            accept="image/*"
            name="image"
          />
          {formik.touched.image && formik.errors.image ? (
            <div className="text-red-600">{formik.errors.image}</div>
          ) : null}
          {formik.values.imagePreview && (
            <Image
              src={formik.values.imagePreview}
              alt="Preview"
              width={128} // Adjust width as needed (32 * 4)
              height={128} // Adjust height as needed (32 * 4)
              className="mt-2 object-cover"
            />
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-primary"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default AddCategory;
