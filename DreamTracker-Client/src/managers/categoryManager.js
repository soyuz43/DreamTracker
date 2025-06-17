// src/managers/categoryManager.js
const baseUrl = "/api/Category"

/**
 * Fetches all categories.
 * Returns an array of { id, name }.
 */
export async function fetchAllCategories() {
  const res = await fetch(baseUrl)
  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }
  return res.json()
}
