import React, { useState } from "react";
import api from "../api";

function Register({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", { username, password });
      setMessage(res.data.message);
      setUser(username); // simple example, set username as "logged-in user"
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
}

export default Register;
