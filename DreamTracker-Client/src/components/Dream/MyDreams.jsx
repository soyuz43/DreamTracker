// src/components/dream/MyDreams.jsx

import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchAllDreams,
  fetchDreamById,
  deleteDream,
} from "../../managers/dreamManager";
import DreamList from "./DreamList";
import EditDreamModal from "./EditDreamModal";

export default function MyDreams({ loggedInUser }) {
  const queryClient = useQueryClient();
  const [editingDream, setEditingDream] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all dreams once and cache
  const {
    data: allDreams = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["dreams"],
    queryFn: fetchAllDreams,
    staleTime: 300_000,
  });

  // Filter to only this user's dreams
  const [dreams, setDreams] = useState([]);
  useEffect(() => {
    setDreams(allDreams.filter((d) => d.userProfileId === loggedInUser.id));
  }, [allDreams, loggedInUser.id]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDream,
    onSuccess: (_, dreamId) => {
      setDreams((prev) => prev.filter((d) => d.id !== dreamId));
      // Optionally also update cache
      queryClient.setQueryData(["dreams"], (old = []) =>
        old.filter((d) => d.id !== dreamId)
      );
    },
    onError: (err) => {
      console.error("Failed to delete dream:", err);
      setError("Something went wrong while deleting the dream.");
    },
  });

  // Handlers
  const handleDelete = (dreamId) => {
    if (!window.confirm("Are you sure you want to delete this dream?")) return;
    deleteMutation.mutate(dreamId);
  };

  const handleEdit = (dream) => setEditingDream(dream);
  const handleCloseEdit = () => setEditingDream(null);

  const handleUpdateDream = async (dreamId, updatedData) => {
    try {
      const fresh = await fetchDreamById(dreamId);
      setDreams((prev) =>
        prev.map((d) => (d.id === dreamId ? fresh : d))
      );
      // Sync cache too
      queryClient.setQueryData(["dreams"], (old = []) =>
        old.map((d) => (d.id === dreamId ? fresh : d))
      );
    } catch (err) {
      console.error("Failed to reload updated dream:", err);
      setError("Couldn’t refresh dream after update.");
    } finally {
      setEditingDream(null);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center mt-12 text-lg text-gray-600 dark:text-gray-300">
        Loading your dreams...
      </p>
    );
  }

  if (fetchError) {
    return (
      <p className="text-center mt-12 text-red-600 dark:text-red-400">
        Could not fetch your dreams.
      </p>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        My Dreams
      </h2>
      {error && (
        <p className="text-center text-red-600 dark:text-red-400 mb-4">
          {error}
        </p>
      )}
      {dreams.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">
          You haven't recorded any dreams yet.
        </p>
      ) : (
        <DreamList
          dreams={dreams}
          onDelete={handleDelete}
          onEdit={handleEdit}
          showDelete
          loggedInUser={loggedInUser}
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
