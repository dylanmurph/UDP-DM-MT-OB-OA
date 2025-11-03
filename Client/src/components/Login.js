import React, { useState } from "react";
import api from "../api";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { username, password });
      setMessage(res.data.message);
      setUser(username);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}

export default Login;
