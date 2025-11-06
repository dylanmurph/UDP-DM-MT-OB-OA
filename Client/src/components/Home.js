import React from "react";

function Home({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      <h2>{user?.name ? `Welcome, ${user.name}!` : "Welcome!"}</h2>
      {user ? (
        <>
          <p>You are a {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>Please log in or register</p>
        </>
      )}
    </div>
  );
}

export default Home;
