// src/components/Dream/DreamCard.jsx

import { Link } from "react-router-dom";

export default function DreamCard({ dream, onDelete, showDelete = false }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-3 border border-gray-100">
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

        {showDelete && (
          <button
            onClick={() => onDelete?.(dream.id)}
            className="px-4 py-2 !bg-red-600 text-white text-sm font-semibold rounded shadow hover:!bg-red-700 transition"
            style={{ backgroundColor: "#dc2626" }} // red-600
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
