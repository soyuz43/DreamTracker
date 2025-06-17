// src/components/ApplicationViews.jsx
import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AllDreams from "./dream/AllDreams";
import DreamDetails from "./dream/DreamDetails";
import CreateDream from "./dream/CreateDream";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <AllDreams />
            </AuthorizedRoute>
          }
        />
        <Route
          path="dreams/:dreamId"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <DreamDetails />
            </AuthorizedRoute>
          }
        />
        <Route
          path="dreams/new"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <CreateDream />
            </AuthorizedRoute>
          }
        />
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
