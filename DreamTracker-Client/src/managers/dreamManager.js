// src/managers/dreamManager.js

const baseUrl = "/api/Dream";

/**
 * Fetch all public dreams.
 * Returns an array of DreamDTOs.
 */
export async function fetchAllDreams() {
  const res = await fetch(baseUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch dreams");
  }
  return res.json();
}

/**
 * Fetch a single dream by ID.
 * Useful for detail views if needed later.
 */
export async function fetchDreamById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dream with id ${id}`);
  }
  return res.json();
}
