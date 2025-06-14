// src/components/Dream/AllDreams.jsx

import { useEffect, useState } from "react"
import { fetchAllDreams } from "../../managers/dreamManager"
import { fetchAllTags } from "../../managers/tagManager"
import DreamList from "./DreamList"

export default function AllDreams() {
  const [dreams, setDreams] = useState([])
  const [tags, setTags] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    fetchAllDreams().then(setDreams).catch(console.error)
    fetchAllTags().then(setTags).catch(console.error)
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
  }

  const filteredDreams = dreams.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm) ||
      d.content.toLowerCase().includes(searchTerm)
    const matchesCategory = categoryFilter
      ? d.category.id === parseInt(categoryFilter)
      : true
    return matchesSearch && matchesCategory
  })

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">All Dreams</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <input
            type="text"
            placeholder="Search dreams..."
            aria-label="Search dreams"
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <DreamList dreams={filteredDreams} />
    </section>
  )
}
