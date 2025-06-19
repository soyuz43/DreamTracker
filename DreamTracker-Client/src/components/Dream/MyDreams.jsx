// src/components/dream/MyDreams.jsx

import { useEffect, useState } from "react";
import { fetchAllDreams, deleteDream } from "../../managers/dreamManager";
import DreamList from "./DreamList";
import EditDreamModal from "./EditDreamModal";

export default function MyDreams({ loggedInUser }) {
  const [dreams, setDreams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingDream, setEditingDream] = useState(null);

  useEffect(() => {
    fetchAllDreams()
      .then((data) => {
        console.log("LoggedInUser.id:", loggedInUser.id);
        console.log("First dream user:", data[0]?.user);
        console.log("Raw dream object:", data[0]);
        const mine = data.filter((d) => d.userProfileId === loggedInUser.id);
        setDreams(mine);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dreams:", err);
        setError("Could not fetch your dreams.");
        setLoading(false);
      });
  }, [loggedInUser]);

  const handleDelete = async (dreamId) => {
    if (!window.confirm("Are you sure you want to delete this dream?")) return;

    try {
      await deleteDream(dreamId);
      setDreams((prev) => prev.filter((d) => d.id !== dreamId));
    } catch (err) {
      console.error("Failed to delete dream:", err);
      setError("Something went wrong while deleting the dream.");
    }
  };

  // Add edit handler
  const handleEdit = (dream) => {
    setEditingDream(dream);
  };

  const handleCloseEdit = () => {
    setEditingDream(null);
  };

  const handleUpdateDream = (dreamId, updatedData) => {
    setDreams(prev => prev.map(d => 
      d.id === dreamId ? {...d, ...updatedData} : d
    ));
    setEditingDream(null);
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-lg text-gray-600">
        Loading your dreams...
      </p>
    );
  }

  if (error) {
    return <p className="text-center mt-12 text-red-600">{error}</p>;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Dreams</h2>
      {dreams.length === 0 ? (
        <p className="text-gray-500 italic">
          You haven't recorded any dreams yet.
        </p>
      ) : (
        <DreamList
          dreams={dreams}
          onDelete={handleDelete}
          onEdit={handleEdit} // Pass the edit handler
          showDelete
          loggedInUser={loggedInUser} // Use loggedInUser instead of currentUserId
          mode="mine"
        />
      )}
      
      <EditDreamModal 
        dream={editingDream}
        isOpen={!!editingDream}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateDream}
      />
    </section>
  );
}