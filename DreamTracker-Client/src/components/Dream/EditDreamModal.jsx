// src/components/Dream/EditDreamModal.jsx

import { useEffect, useState } from "react"
import { updateDream } from "../../managers/dreamManager"
import { fetchAllCategories } from "../../managers/categoryManager"

export default function EditDreamModal({ dream, isOpen, onClose, onUpdate }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tagsString, setTagsString] = useState("")
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && dream) {
      setTitle(dream.title || "")
      setContent(dream.content || "")
      setCategoryId(dream.category?.id || "")
      setTagsString(dream.tags?.map(t => t.name).join(", ") || "")
    }
  }, [isOpen, dream])

  useEffect(() => {
    if (isOpen) {
      fetchAllCategories().then(setCategories).catch(console.error)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const updatedDream = {
      title,
      content,
      categoryId: categoryId || null,
      tags: tagsString
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0)
    }

    try {
      await updateDream(dream.id, updatedDream)
      onUpdate?.(dream.id, updatedDream)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to update dream.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Edit Dream</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">— No category —</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Comma-separated"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
