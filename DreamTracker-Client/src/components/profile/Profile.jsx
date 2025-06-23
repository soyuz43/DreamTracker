// src/components/profile/Profile.jsx

import { useState, useEffect } from "react";
import { fetchAllDreams } from "../../managers/dreamManager";

export default function Profile({ loggedInUser }) {
  const [dreamCount, setDreamCount] = useState(0);

  useEffect(() => {
    const fetchDreamCount = async () => {
      try {
        const allDreams = await fetchAllDreams();
        const mine = allDreams.filter(
          (d) => d.userProfileId === loggedInUser.id
        );
        setDreamCount(mine.length);
      } catch (err) {
        console.error("Failed to fetch dream count", err);
      }
    };

    if (loggedInUser?.id) {
      fetchDreamCount();
    }
  }, [loggedInUser]);

  const handleEdit = () => {
    console.log("Edit button clicked — TODO: open modal to edit name");
  };

  const handleDelete = () => {
    console.log("Delete button clicked — TODO: confirm and delete profile");
  };

  const fullName = loggedInUser?.firstName
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Anonymous";

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        My Profile
      </h1>

      <div className="flex gap-4 justify-start mb-6">
        <button
          onClick={handleEdit}
          className="px-5 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
        >
          Edit Name
        </button>
        <button
          onClick={handleDelete}
          className="px-5 py-2 border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
        >
          Delete Profile
        </button>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Full Name
        </label>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {fullName}
        </p>

        <p className="text-md text-gray-800 dark:text-gray-200">
          <strong>Number of Dreams Written:</strong>{" "}
          <span className="ml-2 font-mono">{dreamCount}</span>
        </p>
      </div>
    </section>
  );
}
