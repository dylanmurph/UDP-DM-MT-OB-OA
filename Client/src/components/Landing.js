import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1>Welcome to BnB Smart Access</h1>
      <p>Please choose an option:</p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <div className="text-center bg-gray-200 p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-blue-600">Hello Tailwind!</h1>
        </div>
      </div>
    </div>
  );
}

export default Landing;
