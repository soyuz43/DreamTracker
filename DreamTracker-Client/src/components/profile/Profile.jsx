// src/components/profile/Profile.jsx

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  updateProfile,
  deleteProfile,
} from "../../managers/profileManager";

export default function Profile() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  // Mutations
const { mutate: saveProfile, isLoading: saving } = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    // Force a fresh fetch from the server
    qc.invalidateQueries({ queryKey: ["profile"] });
    setIsEditing(false);
  },
});

  const { mutate: removeProfile, isLoading: deleting } = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      navigate("/login");
    },
  });

  // Local state for edit form
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <p className="text-center mt-12 text-red-600">
        {error?.message ?? "Failed to load profile."}
      </p>
    );
  }

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setAddress(profile.address ?? "");
  };
  const handleSave = () => {
    saveProfile({ firstName, lastName, address });
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      removeProfile();
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        My Profile
      </h1>

      <div className="flex gap-4 justify-center mb-6">
        {!isEditing ? (
          <>
            <button
              onClick={handleEditClick}
              className="px-5 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-2 border border-gray-500 text-gray-500 dark:border-gray-400 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            First Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:outline-none"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{profile.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Last Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:outline-none"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{profile.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:outline-none"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{profile.address}</p>
          )}
        </div>
      </div>
    </section>
  );
}
