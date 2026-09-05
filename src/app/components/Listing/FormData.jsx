export const FormData = {
  Vehicles: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Make", type: "text", name: "make" },
      { label: "Price", type: "number", name: "price" },
      { label: "Model", type: "text", name: "model" },
      { label: "Year", type: "number", name: "year" },
      { label: "Color", type: "text", name: "color" },
      { label: "Fuel Type", type: "text", name: "fuel_type" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    Cars: {
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Number of Doors", options: ["1/3", "4/5"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Motorcycle: {
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Truck: {
      fields: [{ label: "Load Capacity", type: "text", name: "Load_capacity" }],
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Bike: {
      fields: [{ label: "Type", type: "text", name: "bike_type" }],
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Boat: {
      fields: [{ label: "Length", type: "text", name: "boat_length" }],
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Van: {
      fields: [{ label: "Passenger Capacity", type: "text", name: "passenger_capacity" }],
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Scooter: {
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    partsandaccessories: {
      fields: [{ label: "Part Name", type: "text", name: "part_name" }],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Rentals: {
      fields: [
        { label: "Vehicle Type", type: "text", name: "vehicle_type" },
        { label: "Rental Duration", type: "text", name: "rental_duration" },
      ],
      chips: [
        { label: "Transmission", options: ["Manual", "Automatic"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Purpose", options: ["Sale", "Rental"] },
        { label: "For Sale", options: ["YES", "NO"] },
        { label: "Rentals", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  realestate: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Property Type", type: "text", name: "property_type" },
      { label: "No of Bedrooms", type: "number", name: "bedrooms" },
      { label: "No of bathrooms", type: "number", name: "bathrooms" },
      { label: "Year Built", type: "number", name: "yearbuilt" },
      { label: "Size", type: "text", name: "size" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    House: {
      fields: [
        { label: "Parking Availability and Cost", type: "text", name: "cost" },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintainace",
        },
        { label: "Other (Specify)", type: "text", name: "other" },
        { label: "Price", type: "text", name: "price" }
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Basement", options: ["YES", "NO"] },
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "Lease Terms", options: ["DURATION", "RENWAL"] },
        { label: "Credit Score Requirement", options: ["YES", "NO"] },
        {
          label: "Utilities Included",
          options: ["WATER", "GAS", "ELECTRICITY"],
        },
        { label: "Access to Amenities", options: ["POOL", "GYM", "LAUNDARY"] },
        {
          label: "Additional Fees",
          options: ["APPLICATION FEE", "SECURITY DEPOSIT", "MOVE-INFEE"],
        },
        {
          label: "Pet Policy",
          options: [
            "ALLOWED",
            "Not ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS",
          ],
        },
        {
          label: "Renter's Insurance Requirement",
          options: ["REQUIRED", "NOT REQUIRED"],
        },
        {
          label: "Security Measures",
          options: ["GATED COMMUNITY", "SECURITY CAMERAS"],
        },
        { label: "Lease Managed By", options: ["OWNER", "AGENCY"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Apartment: {
      fields: [
        { label: "Parking Availability and Cost", type: "text", name: "cost" },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintainace",
        },
        { label: "Other (Specify)", type: "text", name: "other" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Basement", options: ["YES", "NO"] },
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "Lease Terms", options: ["DURATION", "RENWAL"] },
        { label: "Credit Score Requirement", options: ["YES", "NO"] },
        {
          label: "Utilities Included",
          options: ["WATER", "GAS", "ELECTRICITY"],
        },
        { label: "Access to Amenities", options: ["POOL", "GYM", "LAUNDARY"] },
        {
          label: "Additional Fees",
          options: ["APPLICATION FEE", "SECURITY DEPOSIT", "MOVE-INFEE"],
        },
        {
          label: "Pet Policy",
          options: [
            "ALLOWED",
            "Not ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS",
          ],
        },
        {
          label: "Renter's Insurance Requirement",
          options: ["REQUIRED", "NOT REQUIRED"],
        },
        {
          label: "Security Measures",
          options: ["GATED COMMUNITY", "SECURITY CAMERAS"],
        },
        { label: "Lease Managed By", options: ["OWNER", "AGENCY"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    Land: {
      fields: [
        { label: "Land Type", type: "text", name: "landtype" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    mobilehome: {
      fields: [
        { label: "Parking Availability and Cost", type: "text", name: "cost" },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintainace",
        },
        { label: "Other (Specify)", type: "text", name: "other" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Basement", options: ["YES", "NO"] },
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "Lease Terms", options: ["DURATION", "RENWAL"] },
        { label: "Credit Score Requirement", options: ["YES", "NO"] },
        {
          label: "Utilities Included",
          options: ["WATER", "GAS", "ELECTRICITY"],
        },
        { label: "Access to Amenities", options: ["POOL", "GYM", "LAUNDARY"] },
        {
          label: "Additional Fees",
          options: ["APPLICATION FEE", "SECURITY DEPOSIT", "MOVE-INFEE"],
        },
        {
          label: "Pet Policy",
          options: [
            "ALLOWED",
            "Not ALLOWED",
            "ADDITIONAL PET FEE",
            "RESTRICTIONS",
          ],
        },
        {
          label: "Renter's Insurance Requirement",
          options: ["REQUIRED", "NOT REQUIRED"],
        },
        {
          label: "Security Measures",
          options: ["GATED COMMUNITY", "SECURITY CAMERAS"],
        },
        { label: "Lease Managed By", options: ["OWNER", "AGENCY"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    commercial: {
      fields: [
        { label: "No of Floors", type: "text", name: "nooffloors" },
        { label: "HOA Fees", type: "text", name: "cost" },
        {
          label: "Maintenance and Repair Policy",
          type: "text",
          name: "maintainace",
        },
        { label: "Other (Specify)", type: "text", name: "other" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "Basement", options: ["YES", "NO"] },
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "Lease Terms", options: ["DURATION", "RENWAL"] },
        { label: "Credit Score Requirement", options: ["YES", "NO"] },
        {
          label: "Utilities Included",
          options: ["WATER", "GAS", "ELECTRICITY"],
        },
        {
          label: "Additional Fees",
          options: ["APPLICATION FEE", "SECURITY DEPOSIT", "MOVE-INFEE"],
        },
        {
          label: "Renter's Insurance Requirement",
          options: ["REQUIRED", "NOT REQUIRED"],
        },
        {
          label: "Security Measures",
          options: ["GATED COMMUNITY", "SECURITY CAMERAS"],
        },
        { label: "Lease Managed By", options: ["OWNER", "AGENCY"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    bedroom: {
      fields: [
        {
          label: "Rent Price and What's Included",
          type: "text",
          name: "nooffloors",
        },
        { label: "Lease Terms", type: "text", name: "cost" },
        {
          label: "Parking Availability and Cost",
          type: "text",
          name: "maintainace",
        },
        {
          label: "Security Deposit and Any Additional Fees)",
          type: "text",
          name: "other",
        },
        { label: "House Rules", type: "text", name: "price" },
        { label: "Location Details", type: "text", name: "price" },
        { label: "Availability Date", type: "date", name: "price" },
        {
          label: "Number of Current Occupants and Type",
          type: "text",
          name: "price",
        },
        { label: "Other (Specify)", type: "text", name: "other" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "Bathroom Type", options: ["PRIVATE", "SHARED"] },
        { label: "Kitchen Access and Type", options: ["YES", "NO"] },
        {
          label: "Laundry Facilities",
          options: ["IN-UNIT", "ON-SITE", "OFF-SITE"],
        },
        { label: "Pet Policy", options: ["ALLOWED", "Not ALLOWED"] },
        { label: "Additional Fees", options: ["YES", "NO"] },
        { label: "Smoking Policy", options: ["ALLOWED", "Not ALLOWED"] },
        { label: "Security Features", options: ["LOCKS", "CAMERAS"] },
        {
          label: "Preferred Occupants",
          options: [
            "MEN ONLY",
            "WOMEN ONLY",
            "COUPLES WELCOME",
            "SINGLE OCCUPENCY",
          ],
        },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    suite: {
      fields: [{ label: "Price", type: "text", name: "price" }],
      chips: [
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    studio: {
      fields: [{ label: "Price", type: "text", name: "price" }],
      chips: [
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    vacationhome: {
      fields: [
        { label: "Rental Price", type: "text", name: "price" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    basement: {
      fields: [{ label: "Price", type: "text", name: "price" }],
      chips: [
        { label: "Furnished", options: ["UNFURNISHED", "FURNISHED"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  electronics: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Brand", type: "text", name: "brand" },
      { label: "Model year", type: "number", name: "model" },
      { label: "Warranty", type: "number", name: "warranty" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    smartphones: {
      fields: [
        { label: "Operating System", type: "text", name: "os" },
        { label: "Carrier Lock", type: "text", name: "lock" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    computers: {
      fields: [
        { label: "Processor", type: "text", name: "processor" },
        { label: "RAM", type: "text", name: "ram" },
        { label: "Storage Type", type: "text", name: "stype" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    appliances: {
      fields: [
        { label: "Energy Rating", type: "text", name: "processor" },
        { label: "Dimensions", type: "text", name: "ram" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    games: {
      fields: [
        { label: "Platforms", type: "text", name: "processor" },
        { label: "Jenry", type: "text", name: "ram" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    servicesandparts: {
      fields: [
        { label: "Part Type", type: "text", name: "processor" },
        { label: "Compatible Model", type: "text", name: "ram" },
        { label: "Price", type: "text", name: "price" },
      ],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  events: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Event Date & Time", type: "date", name: "event_date" },
      { label: "Expected Audience", type: "text", name: "expected_audience" },
      { label: "Special Feature", type: "text", name: "special_feature" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "Ticket Price", type: "text", name: "ticket_price" },
      { label: "keywords", type: "text", name: "keywords" },
      { label: "Event type", type: "text", name: "event_type" },
    ],
    networkingevents: {
      fields: [
        { label: "Industry Focus", type: "text", name: "processor" },
        { label: "Speaker List", type: "text", name: "ram" },
      ],
      chips: [{ label: "negotiable", options: ["YES", "NO"] }],
    },
    concert: {
      fields: [
        { label: "Performer", type: "text", name: "processor" },
        { label: "Genre", type: "text", name: "ram" },
      ],
      chips: [{ label: "negotiable", options: ["YES", "NO"] }],
    },
    festival: {
      fields: [
        { label: "No of Days", type: "text", name: "processor" },
        { label: "Theme", type: "text", name: "ram" },
        { label: "Major Attraction", type: "text", name: "ram" },
      ],
      chips: [{ label: "negotiable", options: ["YES", "NO"] }],
    },
  },
  jobs: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Job Title", type: "date", name: "job_tittle" },
      { label: "Required Skills", type: "text", name: "required_skills" },
      { label: "Experience Level", type: "text", name: "experience_level" },
      { label: "Employment Type", type: "textarea", name: "employment_type" },
      { label: "Salary Range", type: "text", name: "salary_range" },
      { label: "keywords", type: "text", name: "keywords" },
      { label: "Working Hours", type: "text", name: "working_hours" },
      { label: "Benefits offered", type: "text", name: "benefits_offered" },
      { label: "Description", type: "text", name: "description" }
    ],
    fulltime: {
      fields: [
        {label :"working",type:"text",name:"working"},
      ],

      chips: [
        { label: "Work Permit", options: ["Yes", "No"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    parttime: {
      fields: [
        { label: "Working Hours", type: "text", name: "processor" },
        { label: "Flexibility", type: "text", name: "ram" },
      ],

      chips: [
        { label: "Work Permit", options: ["Yes", "No"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    freelancer: {
      fields: [
        { label: "Project Type", type: "text", name: "processor" },
        { label: "Contact Duration", type: "text", name: "ram" },
      ],

      chips: [{ label: "negotiable", options: ["YES", "NO"] }],
    },
    helper: {
      fields: [
        { label: "Duties", type: "text", name: "processor" },
        { label: "Accommodation Provided", type: "text", name: "ram" },
      ],

      chips: [
        { label: "Own Tools Needed", options: ["Yes", "No"] },
        { label: "Car Needed", options: ["Yes", "No"] },
        { label: "Permit Work", options: ["Yes", "No"] },
        { label: "Pay", options: ["HOUR", "DAY", "TASKS", "No"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    homeoffice: {
      fields: [
        {
          label: "Remote Work Tools Provided",
          type: "text",
          name: "processor",
        },
        { label: "Work Hours", type: "text", name: "ram" },
      ],

      chips: [{ label: "negotiable", options: ["YES", "NO"] }],
    },
  },
  furniture: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Material Type", type: "date", name: "material_type" },
      { label: "Color", type: "text", name: "color" },
      { label: "Dimension", type: "text", name: "dimensions" },
      { label: "Price", type: "text", name: "price" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    couch: {
      fields: [
        { label: "Seating Capacity", type: "text", name: "processor" },
        { label: "Upholstery Material", type: "text", name: "ram" },
        { label: "Benefits offered", type: "text", name: "benefit" },
      ],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    tables: {
      fields: [
        { label: "Table Type", type: "text", name: "processor" },
        { label: "Shape", type: "text", name: "ram" },
      ],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    chairs: {
      fields: [
        { label: "Chair Type", type: "text", name: "processor" },
        { label: "Weight Capacity", type: "text", name: "ram" },
      ],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    beds: {
      fields: [{ label: "Bed Size", type: "text", name: "processor" }],

      chips: [
        { label: "Mattress Included", options: ["Yes", "No"] },
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    customfurniture: {
      fields: [
        { label: "Customization", type: "text", name: "processor" },
        { label: "Lead Time", type: "text", name: "ram" },
      ],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  fashion: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Brand", type: "text", name: "brand" },
      { label: "Size", type: "text", name: "size" },
      { label: "Color", type: "text", name: "color" },
      { label: "Material Type", type: "text", name: "material_type" },
      { label: "Price", type: "number", name: "price" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    clothes: {
      fields: [{ label: "Gender", type: "text", name: "gender" }],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    shoes: {
      fields: [{ label: "Shoe Type", type: "text", name: "shoetype" }],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    accessories: {
      fields: [{ label: "Type", type: "text", name: "type" }],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    beautyproducts: {
      fields: [
        { label: "Skin Type", type: "text", name: "skintype" },
        { label: "Expiry Date", type: "date", name: "expire" },
      ],

      chips: [
        { label: "Mattress Included", options: ["NEW", "USED"] },
        { label: "condition", options: ["YES", "NO"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    jewelry: {
      fields: [{ label: "Gem Stone", type: "text", name: "gemstone" }],

      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  kids: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Age Range", type: "text", name: "age_range" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "Price", type: "text", name: "price" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    health: {
      fields: [
        { label: "Product Type", type: "text", name: "product_type" },
        { label: "Expiry Date", type: "date", name: "expire_date" },
      ],

      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    toys: {
      fields: [
        { label: "Toy Type", type: "text", name: "toy_type" },
        { label: "Safety Standard", type: "text", name: "safety_standard" },
      ],

      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    transport: {
      fields: [
        { label: "Vehicle Type", type: "text", name: "vehicle_type" },
        { label: "Weight Capacity", type: "text", name: "processor" },
      ],

      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    accessories: {
      fields: [{ label: "Type", type: "text", name: "type" }],

      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    classes: {
      fields: [
        { label: "Subject", type: "text", name: "subject" },
        { label: "Duration", type: "text", name: "duration" },
        { label: "Level", type: "text", name: "level" },
      ],

      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    babysitter: {
      fields: [{ label: "Experience Level", type: "text", name: "experience" }],

      chips: [
        { label: "Certification", options: ["Yes", "No"] },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    daycare: {
      fields: [
        { label: "No of Children", type: "text", name: "no_of_child" },
        { label: "Age Group", type: "text", name: "age_group" },
      ],

      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    schooloffices: {
      chips: [
        {
          label: "Grades",
          options: [
            "KINDERGARTEN",
            "ELEMENTARY SCHOOL",
            "MIDDLE SCHOOL",
            "HIGH SCHOOL",
            "COLLEGE",
            "UNIVERSITY",
          ],
        },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    afterschoolprogram: {
      fields: [
        { label: "Activities Offered", type: "text", name: "activity" },
        { label: "Duration", type: "text", name: "duration" },
      ],
      chips: [
        {
          label: "Grades",
          options: [
            "KINDERGARTEN",
            "ELEMENTARY SCHOOL",
            "MIDDLE SCHOOL",
            "HIGH SCHOOL",
            "COLLEGE",
            "UNIVERSITY",
          ],
        },
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    activities: {
      fields: [
        { label: "Type of Activity", type: "text", name: "activity_type" },
        { label: "Equipment Required", type: "text", name: "equipment_required" },
      ],
      chips: [
        { label: "donation", options: ["YES", "NO"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  sportsandhobby: {
    commonFields: [
      { label: "Choose Image", type: "file", name: "image" },
      { label: "Ad Title", type: "text", name: "title" },
      { label: "Location", type: "text", name: "location" },
      { label: "Item Type", type: "text", name: "item_type" },
      { label: "Description", type: "textarea", name: "description" },
      { label: "Price", type: "text", name: "price" },
      { label: "keywords", type: "text", name: "keywords" },
    ],
    sportsequipment: {
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    musicalinstruments: {
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    collecteditems: {
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    games: {
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    camping: {
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
    outdooractivities: {
      fields: [{ label: "Activity Type", type: "text", name: "activity_type" }],
      chips: [
        { label: "condition", options: ["NEW", "USED"] },
        { label: "negotiable", options: ["YES", "NO"] },
      ],
    },
  },
  // services: {
  //   commonFields: [
  //     { label: "Choose Image", type: "file", name: "image" },
  //     { label: "Ad Title", type: "text", name: "title" },
  //     { label: "Location", type: "text", name: "location" },
  //     { label: "Availability", type: "text", name: "make" },
  //     ,
  //     {
  //       label: "Description of Services Offered",
  //       type: "textarea",
  //       name: "description",
  //     },
  //     { label: "Service Fee", type: "text", name: "description" },
  //   ],
  //   cleaning: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Cleaning Type", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Insurance", options: ["REQUIRED", "NOT REQUIRED"] },
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Cleaning Offered",
  //         options: [
  //           "DEEP CLEANING",
  //           "4STANDARD CLEANING",
  //           "MOVE-IN/MOVE-OUT",
  //           "POST CONSTRUCTION",
  //           "ORGANIZATION",
  //           "UPHOLSTERY CLEANING",
  //           "PRESSURE WASHING",
  //           "PRESSURE WASHING",
  //         ],
  //       },
  //       {
  //         label: "Eco-Friendly or Chemical-Free Product",
  //         options: ["YES", "NO"],
  //       },
  //       { label: "Equipment Provided", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   handyman: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Specific Services Offered",
  //         options: [
  //           "PLUMBING",
  //           "ELECTRICAL",
  //           "CARPENTARY",
  //           "GENERAL REPAIRS",
  //           "OTHER SPECIFIC SERVICES (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Emergency or Same-Day Service Availability",
  //         options: ["Yes", "No"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   drivers: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Insurance and Bonding Status",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Additional Services Provided",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Driving Services Offered",
  //         options: [
  //           "PERSONAL DRIVERS",
  //           "DELIVERIES",
  //           "AIRPORT TRANSFERS",
  //           "LONG TRIP AVAILABILITY",
  //           "RECURRING RIDES",
  //         ],
  //       },
  //       {
  //         label: "Types of Vehicles Available",
  //         options: ["SEDAN", "SUV", "LUXURY CAR", "VAN", "OTHER (SPECIFY)"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   landscaping: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Landscaping Services Provided",
  //         options: [
  //           "MOWING DRIVERS",
  //           "PLANTING",
  //           "DESIGN",
  //           "IRRIGATION",
  //           "LIGHTING",
  //           "SNOW REMOVAL",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Regular Maintenance Service Availability",
  //         options: ["Yes", "No"],
  //       },
  //       {
  //         label: "Seasonal or One-Time Services",
  //         options: ["SESONAL SERVICES", "ONE-TIME SERVICES"],
  //       },

  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   consultancy: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Process for Initial Consultation",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Landscaping Services Provided",
  //         options: ["BUSINESS", "MARKETING", "FINANCE", "OTHER (SPECIFY)"],
  //       },
  //       {
  //         label: "Services Available",
  //         options: ["IN-PERSON", "REMOTELY", "REMOTELY"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   homeautomation: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Brands or Products Supported",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Home Automation Services Offered",
  //         options: [
  //           "SECURITY",
  //           "LIGHTING",
  //           "ENTERTAINMENT",
  //           "CLIMATE CONTROL",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   classesandcourses: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Subjects or Skills", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Duration and Format of the Classes",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Duration and Format of the Classes",
  //         options: ["ONLINE", "IN-PERSON", "BOTH"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   personaltraining: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Training Offered",
  //         options: [
  //           "FITNESS",
  //           "WEIGHT LOSS",
  //           "STRENGTH TRAINING",
  //           "DANCE",
  //           "CIRCUIT TRAINING",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Session Format",
  //         options: ["IN-PERSON", "ONLINE", "BOTH", "DANCE"],
  //       },
  //       {
  //         label: "Personalized Fitness Plan",
  //         options: ["INCLUDED", "NOT INCLUDED"],
  //       },
  //       { label: "Group Sessions Availability", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   construction: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Construction Services Offered",
  //         options: [
  //           "RESIDENTIAL",
  //           "COMMERCIAL",
  //           "RENOVATION",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   technology: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Expertise Level",
  //         options: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  //       },
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Technology Services Offered",
  //         options: [
  //           "IT SUPPORT",
  //           "SOFTWARE DEVELOPMENT",
  //           "HARDWARE REPAIR",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Service Delivery Method",
  //         options: ["ON-SITE", "REMOTELY", "BOTH"],
  //       },
  //       { label: "Ongoing Support and Maintenance", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   immigrationandvisa: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Travel and Visa Services Offered",
  //         options: [
  //           "VISA APPLICATIONS",
  //           "GREEN CARD APPLICATIONS",
  //           "NATURALIZATION SERVICES",
  //           "STUDENT VISA SERVICES",
  //           "INVESTOR VISA SERVICES",
  //           "WORK PERMIT APPLICATIONS",
  //           "FAMILY SPONSERSHIP",
  //           "ASYLUM",
  //           "CITIZENSHIP",
  //         ],
  //       },
  //       {
  //         label: "Service Delivery Method",
  //         options: ["ON-SITE", "REMOTELY", "BOTH"],
  //       },
  //       { label: "Ongoing Support and Maintenance", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   eventservices: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Portfolio or Gallery of Past Events",
  //         type: "file",
  //         name: "loadcapcity",
  //       },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Events",
  //         options: [
  //           "WEDDINGS",
  //           "CORPORATE EVENTS",
  //           "PARTIES",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Specific Services Offered",
  //         options: ["PLANNING", "CATTERING", "DECORATION"],
  //       },
  //       { label: "Customizable Packages", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   moversandpackers: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Moving Services Offered",
  //         options: [
  //           "LOCAL",
  //           "LOCAL-DISTANCE",
  //           "RESIDENTIAL",
  //           "COMMERCIAL",
  //           "STORAGE",
  //           "INTERNATIONALLY",
  //         ],
  //       },
  //       {
  //         label: "Specific Services Offered",
  //         options: ["PLANNING", "CATTERING", "DECORATION"],
  //       },
  //       { label: "Packing Materials Provided", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   farmandfreshfood: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Delivery Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Products Available",
  //         options: [
  //           "VEGETABLES",
  //           "FRUITS",
  //           "DAIRY",
  //           "FAIR",
  //           "LUNCH",
  //           "CLONIAL COFFEE",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Specific Services Offered",
  //         options: ["PLANNING", "CATTERING", "DECORATION"],
  //       },
  //       { label: "Delivery Availability", options: ["Yes", "No"] },
  //       {
  //         label: "Products Organic or Sustainably Sourced",
  //         options: ["Yes", "No"],
  //       },
  //       {
  //         label: "Subscription or Regular Delivery Option",
  //         options: ["Yes", "No"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   videoandphotography: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Photography or Videography Services Offered",
  //         options: [
  //           "WEDDINGS",
  //           "CORPORATE",
  //           "PORTRAIT",
  //           "COMMERCIAL",
  //           "DRONE",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Specific Services Offered",
  //         options: ["PLANNING", "CATTERING", "DECORATION"],
  //       },
  //       { label: "Different Packages Available", options: ["Yes", "No"] },
  //       {
  //         label: "Recurring Service Packages Available",
  //         options: ["Yes", "No"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   interiordesign: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Initial Consultation Fee",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Interior Design Services Offered",
  //         options: ["RESIDENTIAL", "COMMERCIAL", "VIRTUAL", "OTHER (SPECIFY)"],
  //       },
  //       {
  //         label: "Material and Furniture Selections Included",
  //         options: ["Yes", "No"],
  //       },
  //       {
  //         label: "3D Renderings or Visualizations Provided",
  //         options: ["Yes", "No"],
  //       },
  //       {
  //         label: "Recurring Service Packages Available",
  //         options: ["Yes", "No"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   homemadefood: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Homemade Food Available",
  //         options: [
  //           "BAKED GOODS",
  //           "MEALS",
  //           "SNACKS",
  //           "PERSONAL CHEF",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       {
  //         label: "Service Availability",
  //         options: ["DELIVERY", "PICKUP", "AT-HOME PREP", "ALL OF THE ABOVE"],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   insuranceservices: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Insurance Services Offered",
  //         options: [
  //           "HEALTH",
  //           "AUTO",
  //           "HOME",
  //           "LIFE",
  //           "BUSINESS",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   homecarehealth: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Pricing Structure", type: "text", name: "loadcapcity" },
  //       {
  //         label: "Service Area or Travel Radius",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       {
  //         label: "Experience and Qualifications",
  //         type: "text",
  //         name: "loadcapcity",
  //       },
  //       { label: "Other (Specify)", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       {
  //         label: "Payment Options",
  //         options: ["CASH", "CREDIT CARD", "ZELLE", "VENMO", "PAYPAL", "PIX"],
  //       },
  //       {
  //         label: "Types of Home Care Services Provided",
  //         options: [
  //           "NURSING",
  //           "PHYSICAL THERAPY",
  //           "COMPANIANSHIP",
  //           "PERSONAL CARE",
  //           "HOME MAKING",
  //           "OTHER (SPECIFY)",
  //         ],
  //       },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   catering: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Cuisine Type", type: "text", name: "loadcapcity" },
  //       { label: "Services Offered", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   chef: {
  //     fields: [
  //       { label: "Service Type", type: "text", name: "loadcapcity" },
  //       { label: "Cuisine Specialty", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   influencer: {
  //     fields: [
  //       { label: "Platform", type: "text", name: "loadcapcity" },
  //       { label: "Audience Size", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   acservices: {
  //     fields: [
  //       { label: "Services Offered", type: "text", name: "loadcapcity" },
  //       { label: "Brand Specialization", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   personaltrainer: {
  //     fields: [{ label: "Specialization", type: "text", name: "loadcapcity" }],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   cake: {
  //     fields: [{ label: "Types", type: "text", name: "loadcapcity" }],
  //     chips: [
  //       { label: "Customization", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   fingerfood: {
  //     fields: [
  //       { label: "Cuisine Type", type: "text", name: "loadcapcity" },
  //       { label: "Menu", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   buffet: {
  //     fields: [{ label: "Cuisine Type", type: "text", name: "loadcapcity" }],
  //     chips: [
  //       { label: "Menu Customization", options: ["Yes", "No"] },
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  //   transportservices: {
  //     fields: [
  //       { label: "Vehicle Type", type: "text", name: "loadcapcity" },
  //       { label: "Distance", type: "text", name: "loadcapcity" },
  //     ],
  //     chips: [
  //       { label: "Certification", options: ["Yes", "No"] },
  //       { label: "negotiable", options: ["YES", "NO"] },
  //     ],
  //   },
  // },
};
