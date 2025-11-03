import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import api from "./api";

function App() {
  const [guest, setGuest] = useState(null);

  useEffect(() => {
    api.get("/me")
      .then(res => {
        if (res.data && res.data.name) {
          setGuest({
            name: res.data.name,
            email: res.data.email,
            guest_id: res.data.guest_id
          });
        } else {
          setGuest(null);
        }
      })
      .catch(() => setGuest(null));
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
      {!guest ? (
        <>
          <h1>BnB Smart Access</h1>
          <Register setGuest={setGuest} />
          <Login setGuest={setGuest} />
        </>
      ) : (
        <Home guest={guest} setGuest={setGuest} />
      )}
    </div>
  );
}

export default App;