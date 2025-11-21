import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get("/users");
        const data = await res.data;
        console.log("Users from backend:", data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }

    loadUsers();
  }, []);
  return (
    <div>
      <h1>Welcome to HostLock</h1>
      <p>Please choose an option:</p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/auth/register">
          <button>Register</button>
        </Link>
        <Link to="/auth/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
