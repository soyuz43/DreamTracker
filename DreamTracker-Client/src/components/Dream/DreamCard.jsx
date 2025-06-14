// src/components/Dream/DreamCard.jsx

import { Link } from "react-router-dom"

export default function DreamCard({ dream }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-3 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-indigo-700">
          <Link
            to={`/dreams/${dream.id}`}
            className="hover:underline"
          >
            {dream.title}
          </Link>
        </h3>
        <span className="text-sm text-gray-400">
          {new Date(dream.createdOn).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-700 text-sm whitespace-pre-wrap">{dream.content}</p>

      <div className="text-sm text-gray-500">
        <strong>Category:</strong> {dream.category.name}
      </div>

      <div className="text-sm text-gray-500">
        <strong>Tags:</strong>{" "}
        {dream.tags.length
          ? dream.tags.map((t) => t.name).join(", ")
          : "None"}
      </div>

      <div className="text-right text-xs italic text-gray-400">
        — {dream.publishedBy}
      </div>
    </div>
  )
}
