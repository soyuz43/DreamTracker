// src/components/auth/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (!user) {
      setFailedLogin(true);
    } else {
      setLoggedInUser(user);
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setFailedLogin(false);
              setEmail(e.target.value);
            }}
            required
            className={`w-full px-4 py-2 rounded-md border ${
              failedLogin ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300`}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setFailedLogin(false);
              setPassword(e.target.value);
            }}
            required
            className={`w-full px-4 py-2 rounded-md border ${
              failedLogin ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300`}
          />
        </div>
        {failedLogin && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Invalid email or password.
          </p>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        Not signed up?{" "}
        <Link
          to="/register"
          className="text-indigo-600 hover:underline dark:text-indigo-400 transition-colors duration-300"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
