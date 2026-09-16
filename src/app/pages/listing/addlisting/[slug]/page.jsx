"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  FiActivity,
  FiBriefcase,
  FiCoffee,
  FiCpu,
  FiGift,
  FiHardDrive,
  FiHeart,
  FiHome,
  FiKey,
  FiLayers,
  FiMap,
  FiMapPin,
  FiMonitor,
  FiMusic,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiSmartphone,
  FiSmile,
  FiSpeaker,
  FiSun,
  FiTool,
  FiTruck,
  FiUsers,
  FiWatch,
  FiWind,
} from "react-icons/fi";
import {
  MdApartment,
  MdDirectionsBike,
  MdDirectionsBoat,
  MdDirectionsCar,
  MdElectricScooter,
  MdHotel,
  MdTwoWheeler,
} from "react-icons/md";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import ListingCategoryTile from "@/app/components/Listing/ListingCategoryTile";
import PageState from "@/app/components/ux/PageState";

const CATEGORIES = {
  vehicles: [
    { name: "Cars", subcategory: "Cars", endpoint: "vehicle", category: "Vehicles" },
    { name: "Motorcycle", subcategory: "Motorcycle", endpoint: "vehicle", category: "Vehicles" },
    { name: "Truck", subcategory: "Truck", endpoint: "vehicle", category: "Vehicles" },
    { name: "Bike", subcategory: "Bike", endpoint: "vehicle", category: "Vehicles" },
    { name: "Boat", subcategory: "Boat", endpoint: "vehicle", category: "Vehicles" },
    { name: "Van", subcategory: "Van", endpoint: "vehicle", category: "Vehicles" },
    { name: "Scooter", subcategory: "Scooter", endpoint: "vehicle", category: "Vehicles" },
    {
      name: "partsandaccessories",
      subcategory: "Parts and Accessories",
      endpoint: "vehicle",
      category: "Vehicles",
    },
    { name: "rentals", subcategory: "Rentals", endpoint: "vehicle", category: "Vehicles" },
  ],
  realestate: [
    { name: "House", subcategory: "House", endpoint: "realestate", category: "Real Estate" },
    { name: "Apartment", subcategory: "Apartment", endpoint: "realestate", category: "Real Estate" },
    { name: "Land", subcategory: "Land", endpoint: "realestate", category: "Real Estate" },
    { name: "mobilehome", subcategory: "Mobile Home", endpoint: "realestate", category: "Real Estate" },
    { name: "commercial", subcategory: "Commercial", endpoint: "realestate", category: "Real Estate" },
    { name: "bedroom", subcategory: "Bedroom", endpoint: "realestate", category: "Real Estate" },
    { name: "suite", subcategory: "Suite", endpoint: "realestate", category: "Real Estate" },
    { name: "studio", subcategory: "Studio", endpoint: "realestate", category: "Real Estate" },
    {
      name: "vacationhome",
      subcategory: "Vacation Home",
      endpoint: "realestate",
      category: "Real Estate",
    },
    { name: "basement", subcategory: "Basement", endpoint: "realestate", category: "Real Estate" },
  ],
  services: [
    { name: "Cleaning", subcategory: "Cleaning", endpoint: "services", category: "Services" },
    { name: "Handyman", subcategory: "Handyman", endpoint: "services", category: "Services" },
    { name: "Drivers", subcategory: "Drivers", endpoint: "services", category: "Services" },
    { name: "Landscaping", subcategory: "Landscaping", endpoint: "services", category: "Services" },
    { name: "Consultancy", subcategory: "Consultancy", endpoint: "services", category: "Services" },
    { name: "HomeAutomation", subcategory: "Home Automation", endpoint: "services", category: "Services" },
    { name: "ClassesCourses", subcategory: "Classes & Courses", endpoint: "services", category: "Services" },
    { name: "PersonalTraining", subcategory: "Personal Training", endpoint: "services", category: "Services" },
    { name: "Construction", subcategory: "Construction", endpoint: "services", category: "Services" },
    { name: "Technology", subcategory: "Technology", endpoint: "services", category: "Services" },
    { name: "ImmigrationVisa", subcategory: "Immigration and Visa", endpoint: "services", category: "Services" },
    { name: "EventServices", subcategory: "Event Services", endpoint: "services", category: "Services" },
    { name: "MoversPackers", subcategory: "Movers & Packers", endpoint: "services", category: "Services" },
    { name: "FarmFreshFood", subcategory: "Farm & Fresh Food", endpoint: "services", category: "Services" },
    { name: "VideoPhotography", subcategory: "Video & Photography", endpoint: "services", category: "Services" },
    { name: "InteriorDesign", subcategory: "Interior Design", endpoint: "services", category: "Services" },
    { name: "HomemadeFood", subcategory: "Homemade Food", endpoint: "services", category: "Services" },
    { name: "InsuranceServices", subcategory: "Insurance Services", endpoint: "services", category: "Services" },
    { name: "HomeCareHealth", subcategory: "Home Care (Health)", endpoint: "services", category: "Services" },
    { name: "Catering", subcategory: "Catering", endpoint: "services", category: "Services" },
    { name: "Chef", subcategory: "Chef", endpoint: "services", category: "Services" },
    { name: "Influencer", subcategory: "Influencer", endpoint: "services", category: "Services" },
    { name: "ACServices", subcategory: "AC Services", endpoint: "services", category: "Services" },
    { name: "PersonalTrainer", subcategory: "Personal Trainer", endpoint: "services", category: "Services" },
    { name: "Cake", subcategory: "Cake", endpoint: "services", category: "Services" },
    { name: "FingerFood", subcategory: "Finger Food", endpoint: "services", category: "Services" },
    { name: "Buffet", subcategory: "Buffet", endpoint: "services", category: "Services" },
    { name: "TransportServices", subcategory: "Transport Services", endpoint: "services", category: "Services" },
  ],
  events: [
    {
      name: "networkingevents",
      subcategory: "Networking Events",
      endpoint: "events",
      category: "Events",
    },
    { name: "concert", subcategory: "Concert", endpoint: "events", category: "Events" },
    { name: "festival", subcategory: "Festival", endpoint: "events", category: "Events" },
  ],
  jobs: [
    { name: "fulltime", subcategory: "Full Time", endpoint: "jobs", category: "Jobs" },
    { name: "parttime", subcategory: "Part Time", endpoint: "jobs", category: "Jobs" },
    { name: "freelancer", subcategory: "Freelancer", endpoint: "jobs", category: "Jobs" },
    { name: "helper", subcategory: "Helper", endpoint: "jobs", category: "Jobs" },
    { name: "homeoffice", subcategory: "Home Office", endpoint: "jobs", category: "Jobs" },
  ],
  electronics: [
    { name: "smartphones", subcategory: "Smartphones", endpoint: "electronics", category: "Electronics" },
    { name: "computers", subcategory: "Computers", endpoint: "electronics", category: "Electronics" },
    { name: "appliances", subcategory: "Appliances", endpoint: "electronics", category: "Electronics" },
    { name: "games", subcategory: "Games", endpoint: "electronics", category: "Electronics" },
    {
      name: "servicesandparts",
      subcategory: "Services and Parts",
      endpoint: "electronics",
      category: "Electronics",
    },
  ],
  furniture: [
    { name: "couch", subcategory: "Couch", endpoint: "furniture", category: "Furniture" },
    { name: "tables", subcategory: "Tables", endpoint: "furniture", category: "Furniture" },
    { name: "chairs", subcategory: "Chairs", endpoint: "furniture", category: "Furniture" },
    { name: "beds", subcategory: "Beds", endpoint: "furniture", category: "Furniture" },
    {
      name: "customfurniture",
      subcategory: "Custom Furniture",
      endpoint: "furniture",
      category: "Furniture",
    },
  ],
  fashion: [
    { name: "clothes", subcategory: "Clothes", endpoint: "fashion", category: "Fashion" },
    { name: "shoes", subcategory: "Shoes", endpoint: "fashion", category: "Fashion" },
    { name: "accessories", subcategory: "Accessories", endpoint: "fashion", category: "Fashion" },
    {
      name: "beautyproducts",
      subcategory: "Beauty Products",
      endpoint: "fashion",
      category: "Fashion",
    },
    { name: "jewelry", subcategory: "Jewelry", endpoint: "fashion", category: "Fashion" },
  ],
  kids: [
    { name: "health", subcategory: "Health", endpoint: "kids", category: "Kids" },
    { name: "toys", subcategory: "Toys", endpoint: "kids", category: "Kids" },
    { name: "transport", subcategory: "Transport", endpoint: "kids", category: "Kids" },
    { name: "accessories", subcategory: "Accessories", endpoint: "kids", category: "Kids" },
    { name: "classes", subcategory: "Classes", endpoint: "kids", category: "Kids" },
    { name: "babysitter", subcategory: "Babysitter", endpoint: "kids", category: "Kids" },
    { name: "schooloffices", subcategory: "School Offices", endpoint: "kids", category: "Kids" },
    {
      name: "afterschoolprogram",
      subcategory: "Afterschool Program",
      endpoint: "kids",
      category: "Kids",
    },
    { name: "activities", subcategory: "Activities", endpoint: "kids", category: "Kids" },
  ],
  sportsandhobby: [
    {
      name: "sportsequipment",
      subcategory: "Sports Equipment",
      endpoint: "sportshobby",
      category: "Sports & Hobby",
    },
    {
      name: "musicalinstruments",
      subcategory: "Musical Instruments",
      endpoint: "sportshobby",
      category: "Sports & Hobby",
    },
    {
      name: "collecteditems",
      subcategory: "Collected Items",
      endpoint: "sportshobby",
      category: "Sports & Hobby",
    },
    { name: "games", subcategory: "Games", endpoint: "sportshobby", category: "Sports & Hobby" },
    { name: "camping", subcategory: "Camping", endpoint: "sportshobby", category: "Sports & Hobby" },
    {
      name: "outdooractivities",
      subcategory: "Outdoor Activities",
      endpoint: "sportshobby",
      category: "Sports & Hobby",
    },
  ],
};

const SUBCATEGORY_ICONS = {
  Cars: MdDirectionsCar,
  Motorcycle: MdTwoWheeler,
  Truck: FiTruck,
  Bike: MdDirectionsBike,
  Boat: MdDirectionsBoat,
  Van: FiTruck,
  Scooter: MdElectricScooter,
  "Parts and Accessories": FiSettings,
  Rentals: FiKey,
  House: FiHome,
  Apartment: MdApartment,
  Land: FiMap,
  "Mobile Home": FiHome,
  Commercial: FiBriefcase,
  Bedroom: MdHotel,
  Suite: MdHotel,
  Studio: FiLayers,
  "Vacation Home": FiSun,
  Basement: FiLayers,
  "Networking Events": FiUsers,
  Concert: FiMusic,
  Festival: FiSpeaker,
  "Full Time": FiBriefcase,
  "Part Time": FiWatch,
  Freelancer: FiCoffee,
  Helper: FiUsers,
  "Home Office": FiHome,
  Smartphones: FiSmartphone,
  Computers: FiMonitor,
  Appliances: FiHardDrive,
  Games: FiCpu,
  "Services and Parts": FiTool,
  Couch: FiHome,
  Tables: FiLayers,
  Chairs: FiPackage,
  Beds: MdHotel,
  "Custom Furniture": FiTool,
  Clothes: FiShoppingBag,
  Shoes: FiShoppingBag,
  Accessories: FiWatch,
  "Beauty Products": FiHeart,
  Jewelry: FiGift,
  Health: FiHeart,
  Toys: FiSmile,
  Transport: FiTruck,
  Classes: FiUsers,
  Babysitter: FiSmile,
  "School Offices": FiBriefcase,
  "Afterschool Program": FiActivity,
  Activities: FiActivity,
  "Sports Equipment": FiActivity,
  "Musical Instruments": FiMusic,
  "Collected Items": FiPackage,
  Camping: FiMapPin,
  "Outdoor Activities": FiWind,
};

function displayCategoryTitle(slug, queryCategory) {
  if (queryCategory) return queryCategory;
  if (!slug) return "Category";
  const key = String(slug).toLowerCase();
  const fromMap = CATEGORIES[key]?.[0]?.category;
  if (fromMap) return fromMap;
  return String(slug).replace(/[-_]/g, " ");
}

function resolveIcon(subcategoryLabel) {
  return SUBCATEGORY_ICONS[subcategoryLabel] || FiPackage;
}

const Subcategories = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const parentEndpoint = searchParams.get("endpoint");
  const categoryFromQuery = searchParams.get("category");
  const subcate = searchParams.get("subcategory");

  const subcategories = useMemo(() => {
    if (!slug) return [];
    return CATEGORIES[String(slug).toLowerCase()] || [];
  }, [slug]);

  const titleCategory = displayCategoryTitle(slug, categoryFromQuery);

  return (
    <ListingPageChrome
      showBack
      title={`Subcategories for ${titleCategory}`}
      description="Step 2 of 2 — pick a subcategory to open the listing form."
    >
      <div className="mb-4 rounded-xl border border-[#f0e2b3] bg-[#FFF8E8] px-4 py-3 text-sm text-brand-muted">
        Choose the best match under{" "}
        <span className="font-semibold text-brand-ink">{titleCategory}</span>.
      </div>

      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((subcategory) => {
            const variables = subcategory.name.replace(/\s+/g, "");
            const Icon = resolveIcon(subcategory.subcategory);
            return (
              <ListingCategoryTile
                key={`${subcategory.name}-${subcategory.subcategory}`}
                label={subcategory.subcategory}
                hint={subcategory.category || titleCategory}
                icon={<Icon size={20} aria-hidden />}
                href={{
                  pathname: `/pages/listing/addlisting/${slug}/${variables}`,
                  query: {
                    endpoint: subcategory.endpoint || parentEndpoint,
                    category: subcategory.category || categoryFromQuery,
                    subcategory: subcategory.subcategory || subcate,
                  },
                }}
              />
            );
          })}
        </div>
      ) : (
        <PageState
          status="empty"
          title="No subcategories found"
          description="This category does not have subcategories configured yet."
        />
      )}
    </ListingPageChrome>
  );
};

export default Subcategories;
