const CHIP_FIELD_MAP = {
  Transmission: "transmission",
  condition: "condition",
  Condition: "condition",
  "Number of Doors": "number_of_doors",
  Purpose: "purpose",
  negotiable: "negotiable",
  "For Sale": "for_sale",
  Rentals: "rentals",
  donation: "donation",
  furnished: "furnished",
  Furnished: "furnished",
};

const CHIP_VALUE_MAP = {
  Manual: "MANUAL",
  Automatic: "AUTOMATIC",
  Sale: "SALE",
  Rental: "RENTAL",
  Yes: "YES",
  No: "NO",
  YES: "YES",
  NO: "NO",
  NEW: "NEW",
  USED: "USED",
  "4": "4/5",
  "3": "1/3",
  "1/3": "1/3",
  "4/5": "4/5",
};

export function chipFieldName(chipGroup) {
  if (chipGroup?.name) return chipGroup.name;
  return CHIP_FIELD_MAP[chipGroup?.label] || chipGroup?.label;
}

export function chipFieldValue(option) {
  if (option && typeof option === "object") {
    return option.value || CHIP_VALUE_MAP[option.label] || option.label;
  }
  return CHIP_VALUE_MAP[option] || option || "";
}

export function chipDisplayLabel(option) {
  if (option && typeof option === "object") {
    return option.label || option.value;
  }
  return option;
}
