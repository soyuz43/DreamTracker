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

/**
 * Create a new dream.
 * Requires an authenticated user context.
 */
export async function createDream(dream) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dream)
  });

  if (!res.ok) {
    throw new Error("Failed to create dream");
  }

  return res.json();
}

/**
 * Delete a dream by ID.
 * Requires appropriate authorization.
 */
export async function deleteDream(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error(`Failed to delete dream with id ${id}`);
  }
}

/**
 * Update an existing dream by ID.
 * Accepts a dream ID and a partial or full update payload (DreamDTO format).
 * Returns nothing on success (204 No Content).
 * Throws on error.
 */
export async function updateDream(id, updatedDream) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedDream)
  });

  if (!res.ok) {
    throw new Error(`Failed to update dream with id ${id}`);
  }
}