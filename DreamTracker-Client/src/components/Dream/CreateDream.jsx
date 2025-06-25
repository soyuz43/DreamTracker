// src/components/dream/CreateDream.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"  // ADD THIS
import { createDream } from "../../managers/dreamManager"
import { fetchAllTags } from "../../managers/tagManager"
import { fetchAllCategories } from "../../managers/categoryManager"

export default function CreateDream() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()  // ADD THIS

  // form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [isPublic, setIsPublic] = useState(true)
  const [showAuthor, setShowAuthor] = useState(false)
  const [error, setError] = useState(null)

  // Ollama detection state
  const [ollamaModel, setOllamaModel] = useState(null)
  const [ollamaReady, setOllamaReady] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)

  // fetch tags & categories
  useEffect(() => {
    fetchAllTags().then(setTags).catch(console.error)
    fetchAllCategories().then(setCategories).catch(console.error)
  }, [])

  // poll Ollama for available models once on mount
  useEffect(() => {
    const checkOllama = async () => {
      try {
        const res = await fetch("http://localhost:11434/api/tags")
        if (!res.ok) throw new Error("Ollama not reachable")

        const data = await res.json()

        const usableModels = data.models
          .filter((m) => !m.details?.embedding_only)
          .sort(
            (a, b) =>
              new Date(b.modified_at).getTime() -
              new Date(a.modified_at).getTime()
          )

        if (usableModels.length) {
          setOllamaModel(usableModels[0].name)
          setOllamaReady(true)
        } else {
          setOllamaReady(false)
        }
      } catch {
        setOllamaReady(false)
      }
    }

    checkOllama()
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
      showAuthor,
    }
    try {
      const created = await createDream(dto)
      
      // INVALIDATE THE CACHE - This will cause all components using 
      // the "dreams" query to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ["dreams"] })
      
      navigate(`/dreams/${created.id}`)
    } catch (err) {
      console.error(err)
      setError("Failed to create dream")
    }
  }

  const handleRewriteWithAI = async () => {
    if (!content.trim() || !ollamaReady) return

    setIsRewriting(true)
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: `Rewrite the following into a structured, clear, and coherent narrative. Without adding or expanding upon the content provided. Preserve all important details. Output only the dream—no commentary or formatting:\n\n${content}`,
          stream: false,
        }),
      })

      if (!res.ok) throw new Error("Generate call failed")

      const data = await res.json()

      if (data.response) {
        setContent(data.response.trim())
      } else {
        throw new Error("No response field")
      }
    } catch (err) {
      console.error("Rewrite failed:", err)
      alert(
        "Failed to rewrite with AI. Is Ollama installed, models pulled, and running?"
      )
    } finally {
      setIsRewriting(false)
    }
  }

  return (
    <section className="max-w-4xl mx-auto my-10 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-900/20 rounded-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
        New Dream
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            rows="5"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
          />
          {/* Rewrite with AI button + tooltip */}
          <div className="flex justify-end mt-2 group relative">
            <button
              type="button"
              onClick={handleRewriteWithAI}
              disabled={!ollamaReady || isRewriting || !content.trim()}
              className={`px-4 py-1 text-sm rounded transition-colors shadow ${
                !ollamaReady || isRewriting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isRewriting ? "Rewriting..." : "Rewrite with AI"}
            </button>
            {!ollamaReady && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Ollama either not installed, no models pulled, or not running
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
          >
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.has(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-gray-600 transition-colors"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {tag.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-gray-600 transition-colors"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Public
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showAuthor}
              onChange={(e) => setShowAuthor(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-gray-600 transition-colors"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Show Author
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-colors"
          >
            Create Dream
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 dark:text-red-500 text-sm mt-2">
            {error}
          </p>
        )}
      </form>
    </section>
  )
}