import { getData, updateData } from "@/app/API/method";

export function extractTaxonomy(payload) {
  const categories =
    payload?.data?.categories || payload?.categories || [];
  return Array.isArray(categories) ? categories : [];
}

export async function fetchAdminTaxonomy() {
  const response = await getData("/admin-panel/taxonomy");
  return extractTaxonomy(response);
}

export async function patchAdminTaxonomy(body) {
  const response = await updateData("/admin-panel/taxonomy", body);
  return extractTaxonomy(response);
}
