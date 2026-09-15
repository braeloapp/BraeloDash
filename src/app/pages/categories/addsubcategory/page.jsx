"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BackButton from "@/app/components/BackButton";

const AddsubcategoryForm = () => {
  const subcategories = {
    Vehicles: [
      "Cars",
      "Motorcycle",
      "Truck",
      "Bike",
      "Boat",
      "Van",
      "Scooter",
      "Parts and Accessories",
      "Rentals",
    ],
    RealEstate: [
      "House",
      "Apartment",
      "Land",
      "Mobile Home",
      "Commercial",
      "Bedroom",
      "Suite",
      "Studio",
      "Vacation Home",
      "Basement",
    ],
    Services: [
      "Cleaning",
      "Handyman",
      "Drivers",
      "Landscaping",
      "Consultancy",
      "Home Automation",
      "Classes & Courses",
      "Personal Training",
      "Construction",
      "Technology",
      "Immigration and Visa",
      "Event Services",
      "Movers & Packers",
      "Farm & Fresh Food",
      "Video & Photography",
      "Interior Design",
      "Homemade Food",
      "Insurance Services",
      "Home Care (Health)",
      "Catering",
      "Chef",
      "Influencer",
      "AC Services",
      "Personal Trainer",
      "Cake",
      "Finger Food",
      "Buffet",
    ],
    Events: ["Networking Events", "Concert", "Festival"],
    Jobs: ["Full Time", "Part Time", "Freelancer", "Helper", "Home Office"],
    Electronics: [
      "Smartphones",
      "Computers",
      "Appliances",
      "Games",
      "Services & Parts",
    ],
    Furniture: ["Couch", "Tables", "Chairs", "Beds", "Custom Furniture"],
    Fashion: ["Clothes", "Shoes", "Accessories", "Beauty Products", "Jewelry"],
    Kids: [
      "Health",
      "Toys",
      "Transport",
      "Accessories",
      "Classes",
      "Babysitter",
      "Daycare",
      "School Offices",
      "Afterschool Program",
      "Activities",
    ],
    SportsHobby: [
      "Sports Equipment",
      "Musical Instruments",
      "Collected Items",
      "Games",
      "Camping",
      "Outdoor Activities",
    ],
  };

  const formik = useFormik({
    initialValues: {
      mainCategory: "",
      subcategoryName: "",
      date: "",
      price: "",
      description: "",
      image: null,
    },
    validationSchema: Yup.object({
      mainCategory: Yup.string().required("Main category is required"),
      subcategoryName: Yup.string().required("Subcategory name is required"),
      date: Yup.date().required("Date is required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
      image: Yup.mixed().required("An image is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Form submitted", values);
      resetForm();
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-[#78828A] text-[24px] font-[500]">
          Add Subcategory
        </h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="mainCategory" className="block mb-2">
            Main Category
          </label>
          <select
            name="mainCategory"
            value={formik.values.mainCategory}
            onChange={(e) => {
              formik.setFieldValue("mainCategory", e.target.value);
              formik.setFieldValue("subcategoryName", "");
            }}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Main Category</option>
            <option value="Vehicles">Vehicles</option>
            <option value="RealEstate">Real Estate</option>
            <option value="Services">Services</option>
            <option value="Events">Events</option>
            <option value="Jobs">Jobs</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Fashion">Fashion</option>
            <option value="Kids">Kids</option>
            <option value="SportsHobby">Sports & Hobby</option>
          </select>
          {formik.errors.mainCategory && (
            <div className="text-red-500">{formik.errors.mainCategory}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="subcategoryName" className="block mb-2">
            Subcategory Name
          </label>
          <select
            name="subcategoryName"
            value={formik.values.subcategoryName}
            onChange={formik.handleChange}
            className="border rounded p-2 w-full"
            disabled={!formik.values.mainCategory}
          >
            <option value="">Select Subcategory</option>
            {formik.values.mainCategory &&
              subcategories[formik.values.mainCategory]?.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
          </select>
          {formik.errors.subcategoryName && (
            <div className="text-red-500">{formik.errors.subcategoryName}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            className="border rounded p-2 w-full"
          />
          {formik.errors.date && (
            <div className="text-red-500">{formik.errors.date}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block mb-2">
            Select Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded p-2 w-full"
          />
          {formik.errors.image && (
            <div className="text-red-500">{formik.errors.image}</div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="btn-primary"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={formik.handleReset}
            className="btn-ghost"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddsubcategoryForm;
