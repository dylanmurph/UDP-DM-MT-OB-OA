import React, { useEffect } from "react";
import { usePubNub } from "pubnub-react";

function Home({ user, setUser }) {
  const pubnub = usePubNub();

  useEffect(() => {
    // Setup PubNub subscription
    const channel = pubnub.channel("door-entry");
    const subscription = channel.subscription();

    pubnub.addListener({
      status: (s) => {
        console.log("PubNub Status:", s.category);
      },
    });

    subscription.onMessage = (messageEvent) => {
      console.log("Message received:", messageEvent.message);
      handleMessage(messageEvent.message);
    };

    subscription.subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [pubnub]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const publishMessage = async (message) => {
    try {
      const publishPayload = {
        channel: "door-entry",
        message: message,
      };
      await pubnub.publish(publishPayload);
      console.log("Message published successfully");
    } catch (error) {
      console.error("Publish failed:", error);
    }
  };

  const handleMessage = (message) => {
    console.log("Handling message:", message);
    // Add your message handling logic here
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
      <button onClick={() => publishMessage("Door entry attempt")}>
        Publish Entry
      </button>
    </div>
  );
}

export default Home;
