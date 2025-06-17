// src/components/Dream/CreateDream.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createDream } from "../../managers/dreamManager"
import { fetchAllTags } from "../../managers/tagManager"
import { fetchAllCategories } from "../../managers/categoryManager"

export default function CreateDream() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [isPublic, setIsPublic] = useState(true)
  const [showAuthor, setShowAuthor] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllTags().then(setTags).catch(console.error)
    fetchAllCategories().then(setCategories).catch(console.error)
  }, [])

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) => {
      const updated = new Set(prev)
      updated.has(tagId) ? updated.delete(tagId) : updated.add(tagId)
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dto = {
      title,
      content,
      categoryId: parseInt(categoryId),
      tagIds: Array.from(selectedTags),
      isPublic,
      showAuthor
    }
    try {
      const created = await createDream(dto)
      navigate(`/dreams/${created.id}`)
    } catch (err) {
      console.error(err)
      setError("Failed to create dream")
    }
  }

  return (
    <section className="max-w-4xl mx-auto my-10 bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-indigo-700">New Dream</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            rows="5"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.has(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <span className="ml-2 text-gray-700">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <span className="ml-2 text-gray-700">Public</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showAuthor}
              onChange={(e) => setShowAuthor(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <span className="ml-2 text-gray-700">Show Author</span>
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
          >
            Create Dream
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </section>
  )
}
