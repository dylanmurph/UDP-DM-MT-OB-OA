import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import api from "./api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/me")
      .then(res => {
        if (res.data.username) {
          setUser(res.data.username);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
      {!user ? (
        <>
          <h1>React + Flask App</h1>
          <Register setUser={setUser} />
          <Login setUser={setUser} />
        </>
      ) : (
        <Home user={user} setUser={setUser} />
      )}
    </div>
  );
}

export default App;