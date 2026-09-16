import { deleteData, getData, postData, updateData } from "@/app/API/method";

export function extractTaxonomy(payload) {
  const categories =
    payload?.data?.categories || payload?.categories || [];
  return Array.isArray(categories) ? categories : [];
}

export function slugifyKey(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export async function fetchAdminTaxonomy() {
  const response = await getData("/admin-panel/taxonomy");
  return extractTaxonomy(response);
}

export async function createAdminTaxonomy(body) {
  const response = await postData("/admin-panel/taxonomy", body);
  return {
    categories: extractTaxonomy(response),
    entry: response?.data?.entry || null,
  };
}

export async function patchAdminTaxonomy(body) {
  const response = await updateData("/admin-panel/taxonomy", body);
  return extractTaxonomy(response);
}

export async function deleteAdminTaxonomy(body) {
  const response = await deleteData("/admin-panel/taxonomy", body);
  return extractTaxonomy(response);
}
