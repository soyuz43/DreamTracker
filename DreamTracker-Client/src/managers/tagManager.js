// src/managers/tagManager.js

const baseUrl = "/api/Tag";

/**
 * Fetch all tags.
 * Returns an array of TagDTOs.
 */
export async function fetchAllTags() {
  const res = await fetch(baseUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  return res.json();
}
