import React from "react";
import { usePubNub } from "pubnub-react";

function Home({ user, setUser }) {
  const pubnub = usePubNub();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const publishMessage = (message) => {
    pubnub.publish({
      channel: "your_channel",
      message: message,
    });
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
      <button onClick={() => publishMessage("Hello, World!")}>
        Publish a message
      </button>
    </div>
  );
}

export default Home;
