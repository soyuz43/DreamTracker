// src/components/Dream/DreamList.jsx

import DreamCard from "./DreamCard"

export default function DreamList({ 
  dreams, 
  onDelete, 
  onEdit, // Add this prop
  showDelete = false, 
  loggedInUser,
  currentUserId, // Keep for backward compatibility
  mode = "all" 
}) {
  if (!dreams.length) {
    return <p className="text-gray-500 italic mt-4">No dreams found.</p>
  }

  // Use loggedInUser if available, otherwise create object from currentUserId
  const userForCard = loggedInUser || (currentUserId ? { id: currentUserId } : null);

  return (
    <div className="grid gap-6 mt-6">
      {dreams.map((dream) => (
        <DreamCard 
          key={dream.id} 
          dream={dream} 
          onDelete={onDelete}
          onEdit={onEdit} // Pass the onEdit prop
          showDelete={showDelete} 
          loggedInUser={userForCard}
          mode={mode}
        />
      ))}
    </div>
  )
}