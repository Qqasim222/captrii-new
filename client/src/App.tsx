import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import SignUp from "./screens/Signup";
import Home from "./screens/Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  email?: string;
  [key: string]: any; // Allows other properties as well
}

const App: React.FC = () => {
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const theUser = sessionStorage.getItem("user");
    const msUser = sessionStorage.getItem("ms_user");

    if (theUser && !theUser.includes("undefined")) {
      setUser(JSON.parse(theUser));
    }

    if (msUser && !msUser.includes("undefined")) {
      setUser(JSON.parse(msUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={user?.email ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={user?.email ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={user?.email ? <Home user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
