export const FormData = {
  Vehicles: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image", required: true },
      { label: "Ad Title", type: "text", name: "title", required: true },
      { label: "Location", type: "text", name: "location", required: true },
      { label: "Make", type: "text", name: "make", required: true },
      { label: "Model", type: "text", name: "model", required: true },
      { label: "Year", type: "number", name: "year", required: true },
      { label: "Color", type: "text", name: "color", required: true },
      { label: "Mileage", type: "number", name: "mileage", required: true },
      { label: "Fuel Type", type: "text", name: "fuel_type", required: true },
      { label: "Price", type: "number", name: "price", required: true },
      { label: "Description", type: "textarea", name: "description", required: true },
      { label: "keywords", type: "text", name: "keywords", required: true },
    ],
    Cars: {
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Number of Doors", name: "number_of_doors", options: ["1/3", "4/5"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Motorcycle: {
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Truck: {
      fields: [{ label: "Load Capacity", type: "number", name: "Load_capacity", required: true }],
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Bike: {
      fields: [{ label: "Type", type: "text", name: "bike_type", required: true }],
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Boat: {
      fields: [{ label: "Length", type: "number", name: "boat_length", required: true }],
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Van: {
      fields: [{ label: "Passenger Capacity", type: "number", name: "passenger_capacity", required: true }],
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Scooter: {
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    partsandaccessories: {
      fields: [{ label: "Part Name", type: "text", name: "part_name", required: true }],
      chips: [
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
    Rentals: {
      fields: [
        { label: "Vehicle Type", type: "text", name: "vehicle_type", required: true },
        { label: "Rental Duration", type: "text", name: "rental_duration", required: true },
      ],
      chips: [
        { label: "Transmission", name: "transmission", options: ["Manual", "Automatic"], required: true },
        { label: "condition", name: "condition", options: ["NEW", "USED"], required: true },
        { label: "Purpose", name: "purpose", options: ["Sale", "Rental"], required: true },
        { label: "For Sale", name: "for_sale", options: ["YES", "NO"], required: true },
        { label: "Rentals", name: "rentals", options: ["YES", "NO"], required: true },
        { label: "negotiable", name: "negotiable", options: ["YES", "NO"], required: true },
      ],
    },
  },
  realestate: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Property Type",
        type: "text",
        name: "property_type",
        required: true
      },
      {
        label: "No of Bedrooms",
        type: "number",
        name: "bedrooms",
        required: true
      },
      {
        label: "No of bathrooms",
        type: "number",
        name: "bathrooms",
        required: true
      },
      {
        label: "Size",
        type: "text",
        name: "size",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    House: {
      fields: [
        {
          label: "Parking Availability and Cost",
          type: "text",
          name: "parking_and_cost",
          required: true
        },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintenance_policy",
          required: true
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "Basement",
          name: "basement",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "Lease Terms",
          name: "lease_terms",
          options: [
            "DURATION",
            "RENEWAL"
          ],
          required: true
        },
        {
          label: "Credit Score Requirement",
          name: "credit_score",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Utilities Included",
          name: "utilities_included",
          options: [
            "WATER",
            "GAS",
            "ELECTRICITY"
          ],
          required: true
        },
        {
          label: "Access to Amenities",
          name: "access_to_amenities",
          options: [
            "POOL",
            "GYM",
            "LAUNDRY"
          ],
          required: true
        },
        {
          label: "Additional Fees",
          name: "additional_fees",
          options: [
            "APPLICATION FEE",
            "SECURITY DEPOSIT",
            "MOVE-IN FEE"
          ],
          required: true
        },
        {
          label: "Pet Policy",
          name: "pet_policy",
          options: [
            "ALLOWED",
            "NOT ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS"
          ],
          required: true
        },
        {
          label: "Renter's Insurance Requirement",
          name: "renters_insurance_requirement",
          options: [
            "REQUIRED",
            "NOT REQUIRED"
          ],
          required: true
        },
        {
          label: "Security Measures",
          name: "security_measures",
          options: [
            "GATED COMMUNITY",
            "SECURITY CAMERAS"
          ],
          required: true
        },
        {
          label: "Lease Managed By",
          name: "lease_managed_by",
          options: [
            "OWNER",
            "AGENCY"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    Apartment: {
      fields: [
        {
          label: "Parking Availability and Cost",
          type: "text",
          name: "parking_and_cost",
          required: true
        },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintenance_policy",
          required: true
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "Basement",
          name: "basement",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "Lease Terms",
          name: "lease_terms",
          options: [
            "DURATION",
            "RENEWAL"
          ],
          required: true
        },
        {
          label: "Credit Score Requirement",
          name: "credit_score",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Utilities Included",
          name: "utilities_included",
          options: [
            "WATER",
            "GAS",
            "ELECTRICITY"
          ],
          required: true
        },
        {
          label: "Access to Amenities",
          name: "access_to_amenities",
          options: [
            "POOL",
            "GYM",
            "LAUNDRY"
          ],
          required: true
        },
        {
          label: "Additional Fees",
          name: "additional_fees",
          options: [
            "APPLICATION FEE",
            "SECURITY DEPOSIT",
            "MOVE-IN FEE"
          ],
          required: true
        },
        {
          label: "Pet Policy",
          name: "pet_policy",
          options: [
            "ALLOWED",
            "NOT ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS"
          ],
          required: true
        },
        {
          label: "Renter's Insurance Requirement",
          name: "renters_insurance_requirement",
          options: [
            "REQUIRED",
            "NOT REQUIRED"
          ],
          required: true
        },
        {
          label: "Security Measures",
          name: "security_measures",
          options: [
            "GATED COMMUNITY",
            "SECURITY CAMERAS"
          ],
          required: true
        },
        {
          label: "Lease Managed By",
          name: "lease_managed_by",
          options: [
            "OWNER",
            "AGENCY"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    Land: {
      fields: [
        {
          label: "Land Type",
          type: "text",
          name: "land_type",
          required: true
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    mobilehome: {
      fields: [
        {
          label: "Parking Availability and Cost",
          type: "text",
          name: "parking_and_cost",
          required: true
        },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintenance_policy",
          required: true
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "Basement",
          name: "basement",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "Lease Terms",
          name: "lease_terms",
          options: [
            "DURATION",
            "RENEWAL"
          ],
          required: true
        },
        {
          label: "Credit Score Requirement",
          name: "credit_score",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Utilities Included",
          name: "utilities_included",
          options: [
            "WATER",
            "GAS",
            "ELECTRICITY"
          ],
          required: true
        },
        {
          label: "Access to Amenities",
          name: "access_to_amenities",
          options: [
            "POOL",
            "GYM",
            "LAUNDRY"
          ],
          required: true
        },
        {
          label: "Additional Fees",
          name: "additional_fees",
          options: [
            "APPLICATION FEE",
            "SECURITY DEPOSIT",
            "MOVE-IN FEE"
          ],
          required: true
        },
        {
          label: "Pet Policy",
          name: "pet_policy",
          options: [
            "ALLOWED",
            "NOT ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS"
          ],
          required: true
        },
        {
          label: "Renter's Insurance Requirement",
          name: "renters_insurance_requirement",
          options: [
            "REQUIRED",
            "NOT REQUIRED"
          ],
          required: true
        },
        {
          label: "Security Measures",
          name: "security_measures",
          options: [
            "GATED COMMUNITY",
            "SECURITY CAMERAS"
          ],
          required: true
        },
        {
          label: "Lease Managed By",
          name: "lease_managed_by",
          options: [
            "OWNER",
            "AGENCY"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    commercial: {
      fields: [
        {
          label: "No of Floors",
          type: "number",
          name: "number_of_floors",
          required: true
        },
        {
          label: "HOA Fees",
          type: "number",
          name: "hoa_fees",
          required: false
        },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintenance_policy",
          required: true
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "Basement",
          name: "basement",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "Lease Terms",
          name: "lease_terms",
          options: [
            "DURATION",
            "RENEWAL"
          ],
          required: true
        },
        {
          label: "Credit Score Requirement",
          name: "credit_score",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Utilities Included",
          name: "utilities_included",
          options: [
            "WATER",
            "GAS",
            "ELECTRICITY"
          ],
          required: true
        },
        {
          label: "Additional Fees",
          name: "additional_fees",
          options: [
            "APPLICATION FEE",
            "SECURITY DEPOSIT",
            "MOVE-IN FEE"
          ],
          required: true
        },
        {
          label: "Pet Policy",
          name: "pet_policy",
          options: [
            "ALLOWED",
            "NOT ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS"
          ],
          required: true
        },
        {
          label: "Renter's Insurance Requirement",
          name: "renters_insurance_requirement",
          options: [
            "REQUIRED",
            "NOT REQUIRED"
          ],
          required: true
        },
        {
          label: "Security Measures",
          name: "security_measures",
          options: [
            "GATED COMMUNITY",
            "SECURITY CAMERAS"
          ],
          required: true
        },
        {
          label: "Lease Managed By",
          name: "lease_managed_by",
          options: [
            "OWNER",
            "AGENCY"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    bedroom: {
      fields: [
        {
          label: "Rent Price and What's Included",
          type: "text",
          name: "rent_price",
          required: true
        },
        {
          label: "Lease Terms",
          type: "text",
          name: "lease_terms",
          required: true
        },
        {
          label: "Parking Availability and Cost",
          type: "text",
          name: "parking_and_cost",
          required: true
        },
        {
          label: "Security Deposit",
          type: "number",
          name: "security_deposit",
          required: true
        },
        {
          label: "House Rules",
          type: "text",
          name: "house_rules",
          required: true
        },
        {
          label: "Location Details",
          type: "text",
          name: "location_details",
          required: true
        },
        {
          label: "Availability Date",
          type: "date",
          name: "availability_dates",
          required: true
        },
        {
          label: "Number of Current Occupants",
          type: "number",
          name: "number_of_occupants",
          required: true
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "Bathroom Type",
          name: "bathroom_type",
          options: [
            "PRIVATE",
            "SHARED"
          ],
          required: true
        },
        {
          label: "Kitchen Access and Type",
          name: "kitchen_access_type",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Laundry Facilities",
          name: "laundry_facilities",
          options: [
            "IN-UNIT",
            "ON-SITE",
            "OFF-SITE"
          ],
          required: true
        },
        {
          label: "Pet Policy",
          name: "pet_policy",
          options: [
            "ALLOWED",
            "NOT ALLOWED"
          ],
          required: true
        },
        {
          label: "Additional Fees",
          name: "bedroom_additional_Fees",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "Smoking Policy",
          name: "smoking_policy",
          options: [
            "ALLOWED",
            "NOT ALLOWED"
          ],
          required: true
        },
        {
          label: "Security Features",
          name: "security_features",
          options: [
            "LOCKS",
            "CAMERAS"
          ],
          required: true
        },
        {
          label: "Preferred Occupants",
          name: "preferred_occupants",
          options: [
            "MEN ONLY",
            "WOMEN ONLY",
            "COUPLES WELCOME",
            "SINGLE OCCUPANCY"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    suite: {
      fields: [
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    studio: {
      fields: [
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    vacationhome: {
      fields: [
        {
          label: "Rental Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    basement: {
      fields: [
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "Furnished",
          name: "furnished",
          options: [
            "UNFURNISHED",
            "FURNISHED"
          ],
          required: true
        },
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  services: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Availability",
        type: "text",
        name: "availability",
        required: true
      },
      {
        label: "Service Fee",
        type: "number",
        name: "service_fee",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    Cleaning: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Cleaning Type",
          type: "text",
          name: "cleaning_type",
          required: false
        }
      ],
      chips: [
        {
          label: "Insurance",
          name: "insurance",
          options: [
            "REQUIRED",
            "NOT REQUIRED"
          ],
          required: false
        },
        {
          label: "Types of Cleaning Offered",
          name: "cleaning_services",
          options: [
            "DEEP CLEANING",
            "STANDARD CLEANING",
            "MOVE-IN/MOVE-OUT",
            "POST CONSTRUCTION",
            "ORGANIZATION",
            "UPHOLSTERY CLEANING",
            "PRESSURE WASHING",
            "HOUSE KEEPING"
          ],
          required: false
        },
        {
          label: "Eco-Friendly Products",
          name: "eco_friendly_product",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Equipment Provided",
          name: "provided_equipment",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Handyman: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Specific Services Offered",
          name: "handyman_services",
          options: [
            "PLUMBING",
            "ELECTRICAL",
            "CARPENTRY",
            "GENERAL REPAIRS",
            "OTHER SPECIFIC SERVICES (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Same-Day Service",
          name: "same_day_service",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Drivers: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Licence Type",
          type: "text",
          name: "licence_type",
          required: false
        },
        {
          label: "Insurance and Bonding Status",
          type: "text",
          name: "insurance_bonding_status",
          required: false
        },
        {
          label: "Additional Services",
          type: "text",
          name: "additional_service",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Driving Services",
          name: "driving_services",
          options: [
            "PERSONAL DRIVERS",
            "DELIVERIES",
            "AIRPORT TRANSFERS",
            "LONG TRIP AVAILABILITY",
            "RECURRING RIDES"
          ],
          required: false
        },
        {
          label: "Vehicle Type",
          name: "vehicle_type",
          options: [
            "SEDAN",
            "SUV",
            "LUXURY CAR",
            "VAN",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Landscaping: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Landscaping Services",
          name: "landscaping_services",
          options: [
            "MOWING",
            "PLANTING",
            "DESIGN",
            "IRRIGATION",
            "LIGHTING",
            "SNOW REMOVAL",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Regular Maintenance",
          name: "regular_maintenance",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Seasonal Service",
          name: "seasonal_service",
          options: [
            "SEASONAL SERVICES",
            "ONE-TIME SERVICES",
            "SPRING CLEANUP",
            "FALL CLEANUP"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Consultancy: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Consultancy Services",
          name: "consultancy_services",
          options: [
            "BUSINESS",
            "MARKETING",
            "FINANCE",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Initial Consultation",
          name: "initial_consultation",
          options: [
            "IN-PERSON",
            "ONLINE",
            "REMOTELY",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Services Available",
          name: "offered_services",
          options: [
            "IN-PERSON",
            "ONLINE",
            "REMOTELY",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    HomeAutomation: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Supported Products",
          type: "text",
          name: "supported_products",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Automation Services",
          name: "automation_services",
          options: [
            "SECURITY",
            "LIGHTING",
            "ENTERTAINMENT",
            "CLIMATE CONTROL",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    ClassesCourses: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Subjects or Skills",
          type: "text",
          name: "subject_skills",
          required: false
        },
        {
          label: "Class Duration",
          type: "number",
          name: "class_duration",
          required: false
        }
      ],
      chips: [
        {
          label: "Classes Format",
          name: "classes_format",
          options: [
            "ONLINE",
            "IN-PERSON",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    PersonalTraining: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Training Services",
          name: "training_services",
          options: [
            "FITNESS",
            "WEIGHT LOSS",
            "STRENGTH TRAINING",
            "DANCE",
            "CIRCUIT TRAINING",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Session Format",
          name: "session_format",
          options: [
            "IN-PERSON",
            "ONLINE",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Personalized Fitness Plan",
          name: "personalised_fitness_plan",
          options: [
            "INCLUDED",
            "NOT INCLUDED"
          ],
          required: false
        },
        {
          label: "Group Sessions",
          name: "group_session",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    PersonalTrainer: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Training Services",
          name: "training_services",
          options: [
            "FITNESS",
            "WEIGHT LOSS",
            "STRENGTH TRAINING",
            "DANCE",
            "CIRCUIT TRAINING",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Session Format",
          name: "session_format",
          options: [
            "IN-PERSON",
            "ONLINE",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Personalized Fitness Plan",
          name: "personalised_fitness_plan",
          options: [
            "INCLUDED",
            "NOT INCLUDED"
          ],
          required: false
        },
        {
          label: "Group Sessions",
          name: "group_session",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Construction: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Construction Services",
          name: "construction_services",
          options: [
            "RESIDENTIAL",
            "COMMERCIAL",
            "RENOVATION",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Technology: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Expertise Level",
          name: "expertise_level",
          options: [
            "BEGINNER",
            "INTERMEDIATE",
            "ADVANCED"
          ],
          required: false
        },
        {
          label: "Technology Services",
          name: "technology_services",
          options: [
            "IT SUPPORT",
            "SOFTWARE DEVELOPMENT",
            "HARDWARE REPAIR",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Service Delivery Method",
          name: "service_delivery_method",
          options: [
            "ON-SITE",
            "REMOTE",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Ongoing Support",
          name: "ongoing_support_maintenance",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    ImmigrationVisa: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Experience and Qualifications",
          type: "text",
          name: "experience_qualifications",
          required: false
        },
        {
          label: "Portfolio",
          type: "text",
          name: "portfolio",
          required: false
        }
      ],
      chips: [
        {
          label: "Visa Services",
          name: "visa_services",
          options: [
            "VISA APPLICATIONS",
            "GREEN CARD APPLICATIONS",
            "NATURALIZATION SERVICES",
            "STUDENT VISA SERVICES",
            "INVESTOR VISA SERVICES",
            "WORK PERMIT APPLICATIONS",
            "FAMILY SPONSORSHIP",
            "ASYLUM",
            "CITIZENSHIP"
          ],
          required: false
        },
        {
          label: "Free Appointment",
          name: "free_appointment",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    EventServices: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Event Type",
          type: "text",
          name: "event_type",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Events Services",
          name: "events_services",
          options: [
            "CATERING",
            "DECORATION",
            "ENTERTAINMENT",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Customizable Package",
          name: "customizable_package",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    MoversPackers: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Movers Services",
          name: "movers_services",
          options: [
            "LOCAL",
            "LONG-DISTANCE",
            "INTERNATIONAL",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Packing Material",
          name: "packing_material",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Insurance for Goods",
          name: "insurance_for_goods",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    FarmFreshFood: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Farm Services",
          name: "farm_services",
          options: [
            "VEGETABLES",
            "FRUITS",
            "DAIRY",
            "MEAT",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Delivery Availability",
          name: "delivery_availability",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Organic Sourced",
          name: "organic_sourced",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Regular Delivery Option",
          name: "regular_delivery_option",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    VideoPhotography: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Photography Services",
          name: "photography_services",
          options: [
            "WEDDING",
            "EVENT",
            "PORTRAIT",
            "PRODUCT",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Different Packages",
          name: "different_packages",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Recurring Services",
          name: "recurring_services",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    InteriorDesign: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Interior Services",
          name: "interior_services",
          options: [
            "RESIDENTIAL",
            "COMMERCIAL",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Material / Furniture Selection",
          name: "material_furniture_Selection",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Rendering Visualizations",
          name: "rendering_visualizations",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    HomemadeFood: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Homemade Service",
          name: "homemade_service",
          options: [
            "BAKED GOODS",
            "MEALS",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Service Availability",
          name: "service_availability",
          options: [
            "PICKUP",
            "DELIVERY",
            "BOTH"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    InsuranceServices: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Insurance Service",
          name: "insurance_service",
          options: [
            "AUTO",
            "HOME",
            "LIFE",
            "HEALTH",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    HomeCareHealth: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "Homecare Service",
          name: "homecare_service",
          options: [
            "NURSING",
            "ELDERLY CARE",
            "CHILD CARE",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Catering: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Cuisine Type",
          type: "text",
          name: "cuisine_type",
          required: false
        },
        {
          label: "Cuisine Speciality",
          type: "text",
          name: "cuisine_speciality",
          required: false
        },
        {
          label: "Menu",
          type: "text",
          name: "menu",
          required: false
        }
      ],
      chips: [
        {
          label: "Menu Customization",
          name: "menu_customization",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Chef: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Cuisine Type",
          type: "text",
          name: "cuisine_type",
          required: false
        },
        {
          label: "Cuisine Speciality",
          type: "text",
          name: "cuisine_speciality",
          required: false
        },
        {
          label: "Menu",
          type: "text",
          name: "menu",
          required: false
        }
      ],
      chips: [
        {
          label: "Menu Customization",
          name: "menu_customization",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Cake: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Cake Type",
          type: "text",
          name: "cake_type",
          required: false
        },
        {
          label: "Menu",
          type: "text",
          name: "menu",
          required: false
        }
      ],
      chips: [
        {
          label: "Menu Customization",
          name: "menu_customization",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    FingerFood: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Cuisine Type",
          type: "text",
          name: "cuisine_type",
          required: false
        },
        {
          label: "Menu",
          type: "text",
          name: "menu",
          required: false
        }
      ],
      chips: [
        {
          label: "Menu Customization",
          name: "menu_customization",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Buffet: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Cuisine Type",
          type: "text",
          name: "cuisine_type",
          required: false
        },
        {
          label: "Menu",
          type: "text",
          name: "menu",
          required: false
        }
      ],
      chips: [
        {
          label: "Menu Customization",
          name: "menu_customization",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    Influencer: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Platform",
          type: "text",
          name: "platform",
          required: false
        },
        {
          label: "Audience Size",
          type: "number",
          name: "audience_size",
          required: false
        }
      ],
      chips: [
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    ACServices: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Brands Specialization",
          type: "text",
          name: "brands_specialization",
          required: false
        },
        {
          label: "Other (Specify)",
          type: "text",
          name: "other",
          required: false
        }
      ],
      chips: [
        {
          label: "AC Services",
          name: "ac_Services",
          options: [
            "INSTALLATION",
            "REPAIR",
            "MAINTENANCE",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    },
    TransportServices: {
      fields: [
        {
          label: "Service Type",
          type: "text",
          name: "service_type",
          required: false
        },
        {
          label: "Pricing Structure",
          type: "number",
          name: "pricing_structure",
          required: false
        },
        {
          label: "Service Area or Travel Radius",
          type: "text",
          name: "service_area",
          required: false
        },
        {
          label: "Distance",
          type: "text",
          name: "distance",
          required: false
        }
      ],
      chips: [
        {
          label: "Transport Type",
          name: "transport_type",
          options: [
            "VAN",
            "TRUCK",
            "CAR",
            "OTHER (SPECIFY)"
          ],
          required: false
        },
        {
          label: "Certification",
          name: "certifications",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Payment Options",
          name: "payment_options",
          options: [
            "CASH",
            "CREDIT CARD",
            "ZELLE",
            "VENMO",
            "PAYPAL",
            "PIX"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: false
        }
      ]
    }
  },
  electronics: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Brand",
        type: "text",
        name: "brand",
        required: true
      },
      {
        label: "Model",
        type: "text",
        name: "model",
        required: true
      },
      {
        label: "Warranty",
        type: "text",
        name: "warranty",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    smartphones: {
      fields: [
        {
          label: "Operating System",
          type: "text",
          name: "operating_system",
          required: true
        },
        {
          label: "Carrier Lock",
          type: "text",
          name: "carrier_lock",
          required: true
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    computers: {
      fields: [
        {
          label: "Processor",
          type: "text",
          name: "processor",
          required: true
        },
        {
          label: "RAM",
          type: "text",
          name: "ram",
          required: true
        },
        {
          label: "Storage Type",
          type: "text",
          name: "storage_type",
          required: true
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    appliances: {
      fields: [
        {
          label: "Energy Rating",
          type: "text",
          name: "energy_rating",
          required: true
        },
        {
          label: "Dimensions",
          type: "text",
          name: "dimension",
          required: true
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    games: {
      fields: [
        {
          label: "Platforms",
          type: "text",
          name: "platforms",
          required: true
        },
        {
          label: "Genre",
          type: "text",
          name: "jenry",
          required: true
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    servicesandparts: {
      fields: [
        {
          label: "Part Type",
          type: "text",
          name: "part_type",
          required: true
        },
        {
          label: "Compatible Model",
          type: "text",
          name: "compatible_model",
          required: true
        },
        {
          label: "Price",
          type: "number",
          name: "price",
          required: true
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  events: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Event Date & Time",
        type: "date",
        name: "event_date",
        required: true
      },
      {
        label: "Expected Audience",
        type: "number",
        name: "expected_audience",
        required: true
      },
      {
        label: "Special Feature",
        type: "text",
        name: "special_feature",
        required: true
      },
      {
        label: "Event type",
        type: "text",
        name: "event_type",
        required: true
      },
      {
        label: "Ticket Price",
        type: "number",
        name: "ticket_price",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    networkingevents: {
      fields: [
        {
          label: "Industry Focus",
          type: "text",
          name: "industry_focus",
          required: true
        },
        {
          label: "Speaker List",
          type: "text",
          name: "speaker_list",
          required: true
        }
      ],
      chips: [
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    concert: {
      fields: [
        {
          label: "Genre",
          type: "text",
          name: "genre",
          required: true
        }
      ],
      chips: [
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    festival: {
      fields: [
        {
          label: "No of Days",
          type: "number",
          name: "no_of_days",
          required: true
        },
        {
          label: "Theme",
          type: "text",
          name: "theme",
          required: true
        },
        {
          label: "Major Attraction",
          type: "text",
          name: "major_attraction",
          required: true
        }
      ],
      chips: [
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  jobs: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Job Title",
        type: "text",
        name: "job_tittle",
        required: true
      },
      {
        label: "Required Skills",
        type: "text",
        name: "required_skills",
        required: true
      },
      {
        label: "Experience Level",
        type: "text",
        name: "experience_level",
        required: true
      },
      {
        label: "Employment Type",
        type: "text",
        name: "employment_type",
        required: true
      },
      {
        label: "Salary Range",
        type: "text",
        name: "salary_range",
        required: true
      },
      {
        label: "Working Hours",
        type: "text",
        name: "working_hours",
        required: false
      },
      {
        label: "Benefits offered",
        type: "text",
        name: "benefits_offered",
        required: false
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    fulltime: {
      fields: [],
      chips: [
        {
          label: "Work Permit",
          name: "work_permit",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    parttime: {
      fields: [
        {
          label: "Working Hours",
          type: "text",
          name: "working_hours",
          required: false
        },
        {
          label: "Flexibility",
          type: "number",
          name: "flexibility",
          required: false
        }
      ],
      chips: [
        {
          label: "Work Permit",
          name: "work_permit",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    freelancer: {
      fields: [
        {
          label: "Project Type",
          type: "text",
          name: "project_type",
          required: false
        },
        {
          label: "Contract Duration",
          type: "number",
          name: "contract_duration",
          required: false
        }
      ],
      chips: [
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    helper: {
      fields: [
        {
          label: "Duties",
          type: "text",
          name: "duties",
          required: false
        },
        {
          label: "Accommodation Provided",
          type: "text",
          name: "accommodation_provided",
          required: false
        }
      ],
      chips: [
        {
          label: "Own Tools Needed",
          name: "own_tools",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Car Needed",
          name: "car_needed",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Work Permit",
          name: "work_permit",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "Pay",
          name: "helper_pay",
          options: [
            "HOUR",
            "DAY",
            "TASKS"
          ],
          required: false
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    homeoffice: {
      fields: [
        {
          label: "Remote Work Tools Provided",
          type: "text",
          name: "remote_work_tools",
          required: false
        },
        {
          label: "Work Hours",
          type: "text",
          name: "working_hours",
          required: false
        }
      ],
      chips: [
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  furniture: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Material Type",
        type: "text",
        name: "material_type",
        required: true
      },
      {
        label: "Color",
        type: "text",
        name: "color",
        required: true
      },
      {
        label: "Dimension",
        type: "text",
        name: "dimensions",
        required: true
      },
      {
        label: "Price",
        type: "number",
        name: "price",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    couch: {
      fields: [
        {
          label: "Seating Capacity",
          type: "text",
          name: "seating_capacity",
          required: false
        },
        {
          label: "Upholstery Material",
          type: "text",
          name: "upholstery_material",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    tables: {
      fields: [
        {
          label: "Table Type",
          type: "text",
          name: "table_type",
          required: false
        },
        {
          label: "Shape",
          type: "text",
          name: "shapes",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    chairs: {
      fields: [
        {
          label: "Chair Type",
          type: "text",
          name: "chair_type",
          required: false
        },
        {
          label: "Weight Capacity",
          type: "number",
          name: "weight_capacity",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    beds: {
      fields: [
        {
          label: "Bed Size",
          type: "text",
          name: "bed_size",
          required: false
        }
      ],
      chips: [
        {
          label: "Mattress Included",
          name: "mattress_included",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    customfurniture: {
      fields: [
        {
          label: "Customization",
          type: "text",
          name: "customization",
          required: false
        },
        {
          label: "Lead Time",
          type: "text",
          name: "lead_time",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  fashion: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Brand",
        type: "text",
        name: "brand",
        required: true
      },
      {
        label: "Size",
        type: "text",
        name: "size",
        required: false
      },
      {
        label: "Color",
        type: "text",
        name: "color",
        required: false
      },
      {
        label: "Material Type",
        type: "text",
        name: "material_type",
        required: false
      },
      {
        label: "Price",
        type: "number",
        name: "price",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    clothes: {
      fields: [
        {
          label: "Gender",
          type: "text",
          name: "gender",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    shoes: {
      fields: [
        {
          label: "Shoe Type",
          type: "text",
          name: "shoe_type",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    accessories: {
      fields: [
        {
          label: "Type",
          type: "text",
          name: "accessories_type",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    beautyproducts: {
      fields: [
        {
          label: "Skin Type",
          type: "text",
          name: "skin_type",
          required: false
        },
        {
          label: "Expiry Date",
          type: "date",
          name: "expiry_date",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    jewelry: {
      fields: [
        {
          label: "Metal Type",
          type: "text",
          name: "metal_type",
          required: false
        },
        {
          label: "Gem Stone",
          type: "text",
          name: "gem_stone",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  kids: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Age Range",
        type: "text",
        name: "age_range",
        required: true
      },
      {
        label: "Price",
        type: "number",
        name: "price",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    health: {
      fields: [
        {
          label: "Product Type",
          type: "text",
          name: "product_type",
          required: false
        },
        {
          label: "Expiry Date",
          type: "date",
          name: "expiry_date",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    toys: {
      fields: [
        {
          label: "Toy Type",
          type: "text",
          name: "toy_type",
          required: false
        },
        {
          label: "Safety Standard",
          type: "text",
          name: "safety_standard",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    transport: {
      fields: [
        {
          label: "Vehicle Type",
          type: "text",
          name: "vehicle_type",
          required: false
        },
        {
          label: "Weight Capacity",
          type: "number",
          name: "weight_capacity",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    accessories: {
      fields: [
        {
          label: "Type",
          type: "text",
          name: "accessories_type",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    classes: {
      fields: [
        {
          label: "Subject",
          type: "text",
          name: "subject",
          required: false
        },
        {
          label: "Duration",
          type: "text",
          name: "duration",
          required: false
        },
        {
          label: "Level",
          type: "text",
          name: "experience_level",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    babysitter: {
      fields: [
        {
          label: "Experience Level",
          type: "text",
          name: "babysitter_experience",
          required: false
        }
      ],
      chips: [
        {
          label: "Certification",
          name: "certification",
          options: [
            "YES",
            "NO"
          ],
          required: false
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    daycare: {
      fields: [
        {
          label: "No of Children",
          type: "number",
          name: "no_of_children",
          required: false
        },
        {
          label: "Age Group",
          type: "text",
          name: "age_group",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    schooloffices: {
      chips: [
        {
          label: "Grades",
          name: "grades",
          options: [
            "KINDERGARTEN",
            "ELEMENTARY SCHOOL",
            "MIDDLE SCHOOL",
            "HIGH SCHOOL",
            "COLLEGE",
            "UNIVERSITY"
          ],
          required: false
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    afterschoolprogram: {
      fields: [
        {
          label: "Activities Offered",
          type: "text",
          name: "activities_offered",
          required: false
        },
        {
          label: "Duration",
          type: "text",
          name: "duration",
          required: false
        }
      ],
      chips: [
        {
          label: "Grades",
          name: "grades",
          options: [
            "KINDERGARTEN",
            "ELEMENTARY SCHOOL",
            "MIDDLE SCHOOL",
            "HIGH SCHOOL",
            "COLLEGE",
            "UNIVERSITY"
          ],
          required: false
        },
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    activities: {
      fields: [
        {
          label: "Type of Activity",
          type: "text",
          name: "activity_type",
          required: false
        },
        {
          label: "Equipment Required",
          type: "text",
          name: "equipment_required",
          required: false
        }
      ],
      chips: [
        {
          label: "donation",
          name: "donation",
          options: [
            "YES",
            "NO"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
  sportsandhobby: {
    commonFields: [
      {
        label: "Choose Image",
        type: "file",
        name: "image",
        required: true
      },
      {
        label: "Ad Title",
        type: "text",
        name: "title",
        required: true
      },
      {
        label: "Location",
        type: "text",
        name: "location",
        required: true
      },
      {
        label: "Item Type",
        type: "text",
        name: "item_type",
        required: true
      },
      {
        label: "Price",
        type: "number",
        name: "price",
        required: true
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        required: true
      },
      {
        label: "keywords",
        type: "text",
        name: "keywords",
        required: true
      }
    ],
    sportsequipment: {
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    musicalinstruments: {
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    collecteditems: {
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    games: {
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    camping: {
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    },
    outdooractivities: {
      fields: [
        {
          label: "Activity Type",
          type: "text",
          name: "activity_type",
          required: false
        }
      ],
      chips: [
        {
          label: "condition",
          name: "condition",
          options: [
            "NEW",
            "USED"
          ],
          required: true
        },
        {
          label: "negotiable",
          name: "negotiable",
          options: [
            "YES",
            "NO"
          ],
          required: true
        }
      ]
    }
  },
};
