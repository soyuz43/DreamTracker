// src/components/favorites/Favorites.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyFavorites } from "../../managers/favoritesManager";

export default function Favorites({ loggedInUser }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await fetchMyFavorites();
        setFavorites(favs);
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    };

    if (loggedInUser?.id) {
      loadFavorites();
    }
  }, [loggedInUser]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Favorite Dreams</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-600 text-center">
          You haven’t favorited any dreams yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li
              key={fav.dreamId}
              className="border rounded-lg p-4 shadow-sm bg-white hover:bg-indigo-50 transition"
            >
              <Link to={`/dreams/${fav.dreamId}`} className="block">
                <h3 className="text-lg font-semibold text-blue-700">
                  {fav.dream.title}
                </h3>
                <p className="text-sm text-gray-600 italic mt-1">
                  {fav.dream.content.slice(0, 80)}…
                </p>
                <p className="text-xs text-gray-400 mt-2">
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
