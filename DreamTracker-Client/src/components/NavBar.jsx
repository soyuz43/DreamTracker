// src/components/NavBar.jsx

import { NavLink } from "react-router-dom"
import { logout } from "../managers/authManager"

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 px-6 py-4 shadow-2xl sticky top-0 z-50">
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
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`
              }
            >
              All Dreams
            </NavLink>
            <NavLink
              to="/my-dreams"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`
              }
            >
              My Dreams
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`
              }
            >
              Favorites
            </NavLink>
            <NavLink
              to="/dreams/new"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/25" 
                    : "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 hover:text-white border border-purple-500/30"
                }`
              }
            >
              + New Dream
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2 ${
                  isActive 
                    ? "bg-gray-700 text-white shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`
              }
            >
              Profile
            </NavLink>
            
            {/* Logout Button */}
            <button
              onClick={() => {
                logout().then(() => setLoggedInUser(null))
              }}
              className="relative ml-4 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <NavLink
              to="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transform hover:scale-105 transition-all duration-200"
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}