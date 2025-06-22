// src/managers/favoritesManager.js

const baseUrl = "/api/Favorite";

/**
 * Fetch the current user's favorites.
 * Returns an array of FavoriteDTOs.
 */
export async function fetchMyFavorites() {
  const res = await fetch(`${baseUrl}/mine`);
  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }
  return res.json();
}
