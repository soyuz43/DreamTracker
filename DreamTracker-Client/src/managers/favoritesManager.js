// src/managers/favoritesManager.js

const baseUrl = "/api/Favorite";

export async function fetchMyFavorites() {
  const res = await fetch(`${baseUrl}/mine`);
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

export async function fetchFavoriteStatus(dreamId) {
  const res = await fetch(`${baseUrl}/status/${dreamId}`);
  if (!res.ok) throw new Error("Failed to fetch favorite status");
  return res.json(); // { dreamId, isFavorited }
}

export async function addFavorite(dreamId) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dreamId }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
}

export async function removeFavorite(dreamId) {
  const res = await fetch(`${baseUrl}/${dreamId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
}
