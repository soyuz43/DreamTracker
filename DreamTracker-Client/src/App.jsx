// DreamTracker-Client\src\App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Spinner } from "reactstrap";
import NavBar from "./components/NavBar";
import ApplicationViews from "./components/ApplicationViews";

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    // user will be null if not authenticated
    tryGetLoggedInUser().then((user) => {
      setLoggedInUser(user);
    });
  }, []);

  // wait to get a definite logged-in state before rendering
  if (loggedInUser === undefined) {
    return <Spinner />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        <ApplicationViews
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
      </div>
    </>
  );
}

export default App;
