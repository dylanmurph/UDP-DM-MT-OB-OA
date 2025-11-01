import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hello")
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error(err);
        setMessage("Error connecting to Flask backend");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>React + Flask App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;