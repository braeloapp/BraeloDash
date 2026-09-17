"use client";

import React from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiCpu,
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiSmile,
  FiTool,
  FiTruck,
  FiWatch,
} from "react-icons/fi";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import ListingCategoryTile from "@/app/components/Listing/ListingCategoryTile";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const categories = [
  {
    name: "Vehicles",
    slug: "Vehicles",
    endpoint: "vehicle",
    category: "Vehicles",
    hint: "Cars, bikes, boats & more",
    icon: FiTruck,
  },
  {
    name: "Real Estate",
    slug: "realestate",
    endpoint: "realestate",
    category: "Real Estate",
    hint: "Homes, land & rentals",
    icon: FiHome,
  },
  {
    name: "Services",
    slug: "services",
    endpoint: "services",
    category: "Services",
    hint: "Cleaning, repairs, classes & more",
    icon: FiTool,
  },
  {
    name: "Events",
    slug: "events",
    endpoint: "events",
    category: "Events",
    hint: "Concerts, festivals & networking",
    icon: FiCalendar,
  },
  {
    name: "Jobs",
    slug: "jobs",
    endpoint: "jobs",
    category: "jobs",
    hint: "Full-time, part-time & freelance",
    icon: FiBriefcase,
  },
  {
    name: "Electronics",
    slug: "electronics",
    endpoint: "electronics",
    category: "Electronics",
    hint: "Phones, computers & appliances",
    icon: FiCpu,
  },
  {
    name: "Furniture",
    slug: "furniture",
    endpoint: "furniture",
    category: "Furniture",
    hint: "Sofas, tables, beds & more",
    icon: FiPackage,
  },
  {
    name: "Fashion",
    slug: "fashion",
    endpoint: "fashion",
    category: "Fashion",
    hint: "Clothes, shoes & accessories",
    icon: FiWatch,
  },
  {
    name: "Kids",
    slug: "kids",
    endpoint: "kids",
    category: "Kids",
    hint: "Toys, care & activities",
    icon: FiSmile,
  },
  {
    name: "Sports & Hobby",
    slug: "sportsandhobby",
    endpoint: "sportshobby",
    category: "Sports & Hobby",
    hint: "Gear, music & outdoors",
    icon: FiShoppingBag,
  },
];

const Categories = () => {
  const { t } = useLanguage();

  return (
    <ListingPageChrome
      showBack
      title={t("pages.listingAdd.title")}
      description={t("pages.listingAdd.description")}
    >
      <div className="mb-4 rounded-xl border border-[#f0e2b3] bg-[#FFF8E8] px-4 py-3 text-sm text-brand-muted">
        Select the marketplace category that best matches what you are listing.
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <ListingCategoryTile
              key={category.slug}
              label={category.name}
              hint={category.hint}
              icon={<Icon size={20} aria-hidden />}
              href={{
                pathname: `/pages/listing/addlisting/${category.slug}`,
                query: {
                  endpoint: category.endpoint,
                  category: category.category,
                },
              }}
            />
          );
        })}
      </div>
    </ListingPageChrome>
  );
};

export default Categories;
