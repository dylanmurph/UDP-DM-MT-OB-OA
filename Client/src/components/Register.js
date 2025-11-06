import React, { useState } from "react";
import api from "../api";

function Register({ setUser }) {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        contact_number: contactNumber,
        role,
      });

      localStorage.setItem("token", res.data.access_token);

      setUser({
        user_id: res.data.user_id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.access_token,
      });

      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div>
      <h2>Register Account</h2>

      <form onSubmit={handleRegister}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <input
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Contact Number"
        />

        <div style={{ margin: "1rem 0" }}>
          <label>
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />{" "}
            Register as User
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              value="host"
              checked={role === "host"}
              onChange={() => setRole("host")}
            />{" "}
            Register as Host
          </label>
        </div>

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Register;
