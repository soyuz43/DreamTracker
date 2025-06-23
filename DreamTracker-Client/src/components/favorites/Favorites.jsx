// src/components/favorites/Favorites.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMyFavorites } from "../../managers/favoritesManager";

export default function Favorites({ loggedInUser }) {
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites", loggedInUser?.id],
    queryFn: fetchMyFavorites,
    enabled: !!loggedInUser?.id,
    staleTime: 300_000,
  });

  if (isLoading) {
    return (
      <p className="text-center mt-12 text-gray-600 dark:text-gray-400">
        Loading favorites…
      </p>
    );
  }

  if (error) {
    console.error("Error fetching favorites", error);
    return (
      <p className="text-center mt-12 text-red-600 dark:text-red-400">
        Failed to load favorites.
      </p>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-400">
        My Favorite Dreams
      </h2>

      {favorites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          You haven’t favorited any dreams yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li
              key={fav.dreamId}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Link to={`/dreams/${fav.dreamId}`} className="block">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  {fav.dream.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-1">
                  {fav.dream.content.slice(0, 80)}…
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Favorited on:{" "}
                  {new Date(fav.favoritedOn).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
