// src/components/NavBar.jsx

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout().then(() => setLoggedInUser(null));
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800/20 px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          <NavLink to="/" className="hover:scale-105 transform transition-all duration-300 ease-out block">
            DreamTracker
          </NavLink>
        </div>

        {/* Hamburger Menu Toggle - Mobile only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          ☰
        </button>

        {/* Nav Links */}
        <div className={`flex-col md:flex md:flex-row md:items-center md:space-x-2 ${isMenuOpen ? "flex mt-4 space-y-2" : "hidden"} md:mt-0`}>
          {loggedInUser ? (
            <>
              {["/", "/my-dreams", "/favorites"].map((path, idx) => {
                const labels = ["All Dreams", "My Dreams", "Favorites"];
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-purple-600/20 text-white shadow"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/20"
                      }`
                    }
                  >
                    {labels[idx]}
                  </NavLink>
                );
              })}
              <NavLink
                to="/dreams/new"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600/10 to-pink-600/10 text-purple-300 hover:from-purple-600/20 hover:to-pink-600/20 hover:text-white transition-all duration-200"
              >
                + New Dream
              </NavLink>
              <NavLink
                to="/profile"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/20 transition-all duration-200"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-1 md:mt-0 ml-0 md:ml-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all duration-200 border border-red-500/10 hover:border-red-400/20"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
