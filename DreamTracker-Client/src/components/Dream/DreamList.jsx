// src/components/Dream/DreamList.jsx

import DreamCard from "./DreamCard"

export default function DreamList({ dreams }) {
  if (!dreams.length) {
    return <p className="text-gray-500 italic mt-4">No dreams found.</p>
  }

  return (
    <div className="grid gap-6 mt-6">
      {dreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} />
      ))}
    </div>
  )
}
