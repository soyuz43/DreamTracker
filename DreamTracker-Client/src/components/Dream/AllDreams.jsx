// src/components/Dream/AllDreams.jsx

import { useEffect, useState } from "react";
import { fetchAllDreams } from "../../managers/dreamManager";
import { fetchAllTags } from "../../managers/tagManager";
import { fetchAllCategories } from "../../managers/categoryManager";
import DreamList from "./DreamList";

export default function AllDreams() {
  const [dreams, setDreams] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchAllDreams().then(setDreams).catch(console.error);
    fetchAllTags().then(setTags).catch(console.error);
    fetchAllCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleTagChange = (e) => setTagFilter(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);

  const filteredDreams = dreams.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm) ||
      d.content.toLowerCase().includes(searchTerm);

    const matchesTag = tagFilter
      ? d.tags?.some((tag) => tag.id === parseInt(tagFilter))
      : true;

    const matchesCategory = categoryFilter
      ? d.category?.id === parseInt(categoryFilter)
      : true;

    return matchesSearch && matchesTag && matchesCategory;
  });

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">All Dreams</h2>

        <div className="flex flex-col gap-6 md:gap-4 md:flex-row md:items-center mb-4">
          <input
            type="text"
            placeholder="Search dreams..."
            aria-label="Search dreams"
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <fieldset className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
            <legend className="text-gray-700 font-semibold mb-3">
              Filter by Tag
            </legend>
            <div className="flex flex-wrap items-center -mt-2">
              <label className="flex items-center mr-6 mt-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <input
                  type="radio"
                  name="tag"
                  value=""
                  checked={tagFilter === ""}
                  onChange={handleTagChange}
                  className="form-radio text-indigo-600 focus:ring-2 focus:ring-indigo-400"
                />
                <span className="ml-2">All</span>
              </label>

              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center mr-6 mt-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="tag"
                    value={tag.id}
                    checked={tagFilter === String(tag.id)}
                    onChange={handleTagChange}
                    className="form-radio text-indigo-600 focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="ml-2 font-mono text-sm text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm tracking-tight">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </header>
      <DreamList dreams={filteredDreams} />
    </section>
  );
}
