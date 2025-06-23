// src/components/Dream/AllDreams.jsx

import { useEffect, useState, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { fetchAllDreams } from "../../managers/dreamManager";
import { fetchAllTags } from "../../managers/tagManager";
import { fetchAllCategories } from "../../managers/categoryManager";
import DreamList from "./DreamList";
import EditDreamModal from "./EditDreamModal";

export default function AllDreams({ loggedInUser }) {
  const [dreams, setDreams] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingDream, setEditingDream] = useState(null);

  useEffect(() => {
    fetchAllDreams().then(setDreams).catch(console.error);
    fetchAllTags().then(setTags).catch(console.error);
    fetchAllCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleTagChange = (e) => setTagFilter(e.target.value);

  // we'll receive the raw value from Listbox as number | "" so coerce to string
  const handleCategoryChange = (value) =>
    setCategoryFilter(value === "" ? "" : String(value));

  // Edit handlers
  const handleEdit = (dream) => setEditingDream(dream);
  const handleCloseEdit = () => setEditingDream(null);
  const handleUpdateDream = (dreamId, updatedData) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === dreamId ? { ...d, ...updatedData } : d))
    );
    setEditingDream(null);
  };

  const filteredDreams = dreams.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm) ||
      d.content.toLowerCase().includes(searchTerm);
    const matchesTag = tagFilter
      ? d.tags?.some((t) => t.id === parseInt(tagFilter))
      : true;
    const matchesCategory = categoryFilter
      ? d.category?.id === parseInt(categoryFilter)
      : true;
    return matchesSearch && matchesTag && matchesCategory;
  });

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          All Dreams
        </h2>

        <div className="flex flex-col gap-6 md:gap-4 md:flex-row md:items-center mb-4">
          <input
            type="text"
            placeholder="Search dreams..."
            aria-label="Search dreams"
            className="w-full md:w-1/3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <Listbox
            value={categoryFilter}
            onChange={handleCategoryChange}
            as="div"
            className="w-full md:w-1/3 relative"
          >
            <ListboxLabel className="sr-only">Filter by category</ListboxLabel>
            <ListboxButton className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-left text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {categoryFilter === ""
                ? "All Categories"
                : categories.find((c) => String(c.id) === categoryFilter)?.name}
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 max-h-60 overflow-auto focus:outline-none">
              <ListboxOption as={Fragment} key="" value="">
                {({ active, selected }) => (
                  <li
                    className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-100 dark:bg-indigo-900" : ""
                    }`}
                  >
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold" : "font-normal"
                      } text-gray-900 dark:text-gray-300`}
                    >
                      All Categories
                    </span>
                  </li>
                )}
              </ListboxOption>
              {categories.map((cat) => (
                <ListboxOption as={Fragment} key={cat.id} value={cat.id}>
                  {({ active, selected }) => (
                    <li
                      className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        active ? "bg-indigo-100 dark:bg-indigo-900" : ""
                      }`}
                    >
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        } text-gray-900 dark:text-gray-300`}
                      >
                        {cat.name}
                      </span>
                    </li>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>

        <div className="mb-4">
          <fieldset className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-sm">
            <legend className="text-gray-700 dark:text-gray-200 font-semibold mb-3">
              Filter by Tag
            </legend>
            <div className="flex flex-wrap items-center -mt-2">
              <label className="flex items-center mr-6 mt-2 px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors">
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
                  className="flex items-center mr-6 mt-2 px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
                >
                  <input
                    type="radio"
                    name="tag"
                    value={tag.id}
                    checked={tagFilter === String(tag.id)}
                    onChange={handleTagChange}
                    className="form-radio text-indigo-600 focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="ml-2 font-mono text-sm bg-indigo-50 dark:bg-indigo-900 px-1.5 py-0.5 rounded-sm tracking-tight text-indigo-600 dark:text-indigo-300">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </header>

      <DreamList
        dreams={filteredDreams}
        loggedInUser={loggedInUser}
        onEdit={handleEdit}
        mode="all"
      />

      <EditDreamModal
        dream={editingDream}
        isOpen={!!editingDream}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateDream}
      />
    </section>
  );
}
