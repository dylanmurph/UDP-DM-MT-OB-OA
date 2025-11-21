import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./api";

import Landing from "./components/Landing";

// Auth pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

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

// helper: where should this user land?
const getHomePath = (user) => {
  if (!user) return "/auth/login";
  return user.role === "host" ? "/host/home" : "/guest/home";
};

// wrapper to protect role-specific routes
function RequireRole({ user, role, children }) {
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  if (user.role !== role) {
    // logged in but wrong role -> send to THEIR home
    return <Navigate to={getHomePath(user)} replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const handleSetUser = (u) => {
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("token", u.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setUser(u);
  };

  return (
    <Router>
      <div className="max-w-md mx-auto p-4">
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Landing />} />

          {/* Register:
              - if logged in -> go to their home
              - if not logged in -> show register */}
          <Route
            path="/auth/register"
            element={
              !user ? <Register /> : <Navigate to={getHomePath(user)} replace />
            }
          />

          {/* Login:
              - if logged in -> go to their home
              - if not logged in -> show login */}
          <Route
            path="/auth/login"
            element={
              !user ? (
                <Login setUser={handleSetUser} />
              ) : (
                <Navigate to={getHomePath(user)} replace />
              )
            }
          />

          {/* Generic /home just bounces to role home */}
          <Route
            path="/home"
            element={
              user ? (
                <Navigate to={getHomePath(user)} replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          {/* Guest routes (only guests can see) */}
          <Route
            path="/guest/home"
            element={
              <RequireRole user={user} role="guest">
                <GuestHome user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/guest/alerts"
            element={
              <RequireRole user={user} role="guest">
                <GuestAlerts user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/guest/bookings"
            element={
              <RequireRole user={user} role="guest">
                <GuestBookings user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/guest/settings"
            element={
              <RequireRole user={user} role="guest">
                <GuestSettings user={user} setUser={handleSetUser} />
              </RequireRole>
            }
          />

          {/* Host routes (only hosts can see) */}
          <Route
            path="/host/home"
            element={
              <RequireRole user={user} role="host">
                <HostHome user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/host/guests"
            element={
              <RequireRole user={user} role="host">
                <HostGuests user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/host/alerts"
            element={
              <RequireRole user={user} role="host">
                <HostAlerts user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/host/logs"
            element={
              <RequireRole user={user} role="host">
                <HostLogs user={user} />
              </RequireRole>
            }
          />
          <Route
            path="/host/settings"
            element={
              <RequireRole user={user} role="host">
                <HostSettings user={user} setUser={handleSetUser} />
              </RequireRole>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;