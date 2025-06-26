// src/components/dream/DreamCard.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
  fetchFavoriteStatus,
  addFavorite,
  removeFavorite,
} from "../../managers/favoritesManager";

const PencilIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export default function DreamCard({
  dream,
  onDelete,
  onEdit,
  loggedInUser,
  showDelete = false,
  mode = "all",
}) {
  const isOwner = loggedInUser?.id === dream.userProfileId;
  const [isFavorited, setIsFavorited] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => setConfirmDelete(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmDelete]);

  useEffect(() => {
    if (mode === "all" && !isOwner) {
      fetchFavoriteStatus(dream.id)
        .then((dto) => setIsFavorited(dto.isFavorited))
        .catch(console.error);
    }
  }, [dream.id, isOwner, mode]);

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFavorite(dream.id);
      } else {
        await addFavorite(dream.id);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete?.(dream.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const deleteBtnClass = confirmDelete
    ? "px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-black text-sm font-semibold rounded shadow hover:bg-yellow-600 dark:hover:bg-yellow-700 transition"
    : "px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-sm font-semibold rounded shadow hover:bg-red-700 dark:hover:bg-red-800 transition";

  return (
    <div className="relative bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/20 rounded-lg p-6 space-y-3 border border-gray-100 dark:border-gray-700 transition-colors">

      {/* Title & date */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
          <Link to={`/dreams/${dream.id}`} className="hover:underline">
            {dream.title}
          </Link>
        </h3>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {dream.createdOn
            ? new Date(dream.createdOn).toLocaleDateString()
            : "Unknown date"}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
        {dream.content}
      </p>

      {/* Category & tags */}
      {dream.category?.name && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Category:</strong> {dream.category.name}
        </div>
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <strong>Tags:</strong>{" "}
        {dream.tags?.length ? dream.tags.map((t) => t.name).join(", ") : "None"}
      </div>

      {/* Inline action row */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs italic text-gray-400 dark:text-gray-500">
          — {dream.publishedBy || "Anonymous"}
        </div>
        <div className="flex gap-2 items-center">
          {mode === "mine" && isOwner && onEdit && (
            <button
              onClick={() => onEdit(dream)}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-semibold rounded shadow hover:bg-indigo-700 dark:hover:bg-indigo-800 transition"
            >
              Edit
            </button>
          )}

          {mode === "mine" && showDelete && (
            <>
              <button onClick={handleDeleteClick} className={deleteBtnClass}>
                {confirmDelete ? "Confirm Delete?" : "Delete"}
              </button>
              {confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl leading-none"
                  aria-label="Cancel delete"
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Absolute delete for "all" mode */}
      {showDelete && mode === "all" && (
        <div className="absolute bottom-4 right-20 flex items-center gap-2">
          <button onClick={handleDeleteClick} className={deleteBtnClass}>
            {confirmDelete ? "Confirm Delete?" : "Delete"}
          </button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl leading-none"
              aria-label="Cancel delete"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Favorite button for non-owners in "all" mode */}
      {mode === "all" && !isOwner && (
        <button
          onClick={toggleFavorite}
          className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <HeartSolid className="h-5 w-5 text-red-600 dark:text-red-500" />
          ) : (
            <HeartOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          )}
        </button>
      )}

      {/* Edit icon for owners in "all" mode */}
      {mode === "all" && isOwner && onEdit && (
        <button
          onClick={() => onEdit(dream)}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors"
          title="Edit your dream"
        >
          <PencilIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
        </button>
      )}
    </div>
  );
}
