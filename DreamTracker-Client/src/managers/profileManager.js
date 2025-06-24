// src/managers/profileManager.js
const base = "/api/Profile";

export async function fetchProfile() {
  const res = await fetch(base);
  if (!res.ok) throw new Error("Could not load profile");
  return res.json();
}

export async function updateProfile(dto) {
  const res = await fetch(base, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Could not update profile");
}

export async function deleteProfile() {
  const res = await fetch(base, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete profile");
}
