import React, { useEffect, useState } from "react";
import api from "../api";

function Home({ user, setUser }) {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api.get("/hello")
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage("Error connecting to backend"));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
    } catch {
      alert("Error logging out");
    }
  };

  return (
    <div>
      <h2>Welcome, {user}!</h2>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
