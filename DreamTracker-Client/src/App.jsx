// DreamTracker-Client/src/App.jsx

import { useEffect, useState } from "react";
import "./App.css";
import { tryGetLoggedInUser } from "./managers/authManager";
import NavBar from "./components/NavBar";
import ApplicationViews from "./components/ApplicationViews";

// React Query setup
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Initialize once outside component
const queryClient = new QueryClient();

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    tryGetLoggedInUser().then(setLoggedInUser);
  }, []);

  if (loggedInUser === undefined) {
    // Tailwind-based spinner instead of Bootstrap
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        <ApplicationViews
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
      </div>

      {/* React Query Devtools (only shown if explicitly enabled) */}
      {import.meta.env.VITE_SHOW_DEVTOOLS === "true" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
