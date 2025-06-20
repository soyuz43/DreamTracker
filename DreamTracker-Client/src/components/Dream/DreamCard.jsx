// src/components/Dream/DreamCard.jsx

import { Link } from "react-router-dom"

// Simple pencil icon component if @heroicons is not available
const PencilIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

export default function DreamCard({
  dream,
  onDelete,
  onEdit,
  loggedInUser,
  showDelete = false,
  mode = "all" // "mine" or "all"
}) {
  // Correct ownership check using userProfileId
  const isOwner = loggedInUser?.id === dream.userProfileId
  


  return (
    <div className="relative bg-white shadow rounded-lg p-6 space-y-3 border border-gray-100">

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-indigo-700">
          <Link to={`/dreams/${dream.id}`} className="hover:underline">
            {dream.title}
          </Link>
        </h3>
        <span className="text-sm text-gray-400">
          {dream.createdOn
            ? new Date(dream.createdOn).toLocaleDateString()
            : "Unknown date"}
        </span>
      </div>

      <p className="text-gray-700 text-sm whitespace-pre-wrap">
        {dream.content}
      </p>

      {dream.category?.name && (
        <div className="text-sm text-gray-500">
          <strong>Category:</strong> {dream.category.name}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <strong>Tags:</strong>{" "}
        {dream.tags?.length ? dream.tags.map((t) => t.name).join(", ") : "None"}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-xs italic text-gray-400">
          — {dream.publishedBy || "Anonymous"}
        </div>

        <div className="flex gap-2">
          {showDelete && isOwner && (
            <button
              onClick={() => onDelete?.(dream.id)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded shadow hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}

          {mode === "mine" && isOwner && onEdit && (
            <button
              onClick={() => onEdit(dream)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded shadow hover:bg-indigo-700 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {mode === "all" && isOwner && onEdit && (
        <button
          onClick={() => onEdit(dream)}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors"
          title="Edit your dream"
        >
          <PencilIcon className="h-4 w-4 text-indigo-600" />
        </button>
      )}
    </div>
  )
}