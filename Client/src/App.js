import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

// Guest pages
import GuestHome from "./components/Guest/GuestHome";
import GuestAlerts from "./components/Guest/GuestAlerts";
import GuestBookings from "./components/Guest/GuestBookings";
import GuestSettings from "./components/Guest/GuestSettings";

// Host pages
import HostHome from "./components/Host/HostHome";
import HostGuests from "./components/Host/HostGuests";
import HostAlerts from "./components/Host/HostAlerts";
import HostLogs from "./components/Host/HostLogs";
import HostSettings from "./components/Host/HostSettings";

function App() {
  const [, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { token };
  });

  return (
    <Router>
      <div className="max-w-md mx-auto p-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/home"
            element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/" replace />}
          />

          {/* Guest routes */}
          <Route path="/guest/home" element={user ? <GuestHome user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/guest/alerts" element={user ? <GuestAlerts user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/guest/bookings" element={user ? <GuestBookings user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/guest/settings" element={user ? <GuestSettings user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />

          {/* Host routes */}
          <Route path="/host/home" element={user ? <HostHome user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/host/guests" element={user ? <HostGuests user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/host/alerts" element={user ? <HostAlerts user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/host/logs" element={user ? <HostLogs user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/host/settings" element={user ? <HostSettings user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
