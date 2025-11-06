import React, { useState } from "react";
import api from "../api";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });

      const token = res.data.access_token;
      localStorage.setItem("token", token);

      setUser({
        user_id: res.data.user_id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: token
      });

      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}

export default Login;
