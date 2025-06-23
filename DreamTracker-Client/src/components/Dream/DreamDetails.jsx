// src/components/Dream/DreamDetails.jsx

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchDreamById } from "../../managers/dreamManager"

export default function DreamDetails() {
  const { dreamId } = useParams()
  const [dream, setDream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDreamById(dreamId)
      .then((data) => {
        setDream(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch dream:", err)
        setError("Could not load dream details.")
        setLoading(false)
      })
  }, [dreamId])

  if (loading) {
    return (
      <p className="text-center mt-12 text-lg text-gray-600 dark:text-gray-400">
        Loading...
      </p>
    )
  }

  if (error || !dream) {
    return (
      <p className="text-center mt-12 text-red-600 dark:text-red-400">
        {error || "Dream not found."}
      </p>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Dream Details
        </h2>
        <p className="inline-block px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 rounded-full">
          {dream.category.name}
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-300">
          {dream.title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {dream.content}
        </p>
        
        {dream.tags.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-400 dark:text-gray-500 mb-2">
              Tags:
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-5">
              {dream.tags.map((tag) => (
                <li key={tag.id}>{tag.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}