// src/components/NavBar.jsx

import { NavLink } from "react-router-dom";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800/20 px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          <NavLink
            to="/"
            className="hover:scale-105 transform transition-all duration-300 ease-out block"
          >
            DreamTracker
          </NavLink>
        </div>

        {loggedInUser ? (
          <div className="flex items-center space-x-1 relative z-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600/20 text-white shadow-lg shadow-purple-600/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/20"
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#7c3aed" } : {}
              }
            >
              All Dreams
            </NavLink>
            <NavLink
              to="/my-dreams"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600/20 text-white shadow-lg shadow-purple-600/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/20"
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#7c3aed" } : {}
              }
            >
              My Dreams
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600/20 text-white shadow-lg shadow-purple-600/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/20"
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#7c3aed" } : {}
              }
            >
              Favorites
            </NavLink>
            <NavLink
              to="/dreams/new"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/10"
                    : "bg-gradient-to-r from-purple-600/10 to-pink-600/10 text-purple-300 hover:from-purple-600/20 hover:to-pink-600/20 hover:text-white"
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#7c3aed" } : {}
              }
            >
              + New Dream
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2 ${
                  isActive
                    ? "bg-gray-700/20 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/20"
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#7c3aed" } : {}
              }
            >
              Profile
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout().then(() => setLoggedInUser(null));
              }}
              className="relative ml-4 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all duration-200 border border-red-500/10 hover:border-red-400/20"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-6 py-2.5 rounded-lg font-semibold transform transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 hover:scale-105"
                }`
              }
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
