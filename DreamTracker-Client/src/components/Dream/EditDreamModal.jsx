// src/components/Dream/EditDreamModal.jsx

import { useEffect, useState } from "react"
import { updateDream } from "../../managers/dreamManager"
import { fetchAllCategories } from "../../managers/categoryManager"
import { fetchAllTags } from "../../managers/tagManager"

export default function EditDreamModal({ dream, isOpen, onClose, onUpdate }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState(new Set())

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && dream) {
      setTitle(dream.title || "")
      setContent(dream.content || "")
      setCategoryId(dream.category?.id || "")
      const dreamTagIds = dream.tags?.map(t => t.id) || []
      setSelectedTags(new Set(dreamTagIds))
    }
  }, [isOpen, dream])

  useEffect(() => {
    if (isOpen) {
      fetchAllCategories().then(setCategories).catch(console.error)
      fetchAllTags().then(setTags).catch(console.error)
    }
  }, [isOpen])

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => {
      const updated = new Set(prev)
      updated.has(tagId) ? updated.delete(tagId) : updated.add(tagId)
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const updatedDream = {
      title,
      content,
      categoryId: categoryId || null,
      tagIds: Array.from(selectedTags)
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl transition-colors"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
          Edit Dream
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded mb-3 transition-colors">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:outline-none transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700 transition-colors">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tags.map(tag => (
                  <label key={tag.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={tag.id}
                      checked={selectedTags.has(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 transition-colors"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
