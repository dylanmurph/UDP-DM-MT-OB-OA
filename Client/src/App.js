import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./api";

import Landing from "./components/Landing";
import Unauthorized from "./components/Unauthorized";

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

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUser({ ...res.data, token });
      })
      .catch(err => {
        console.error("Token invalid or expired:", err);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Router>
      <div className="max-w-md mx-auto p-4">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/auth/login"
            element={
              <PublicRoute user={user}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <PublicRoute user={user}>
                <Register/>
              </PublicRoute>
            }
          />

          {/* HOME REDIRECT */}
          <Route
            path="/home"
            element={
              !user ? (
                <Navigate to="/auth/login" replace />
              ) : user.role === "guest" ? (
                <Navigate to="/guest/home" replace />
              ) : user.role === "host" ? (
                <Navigate to="/host/home" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          {/* GUEST ROUTES */}
          <Route
            path="/guest/home"
            element={
              <ProtectedRoute user={user} role="guest">
                <GuestHome user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/alerts"
            element={
              <ProtectedRoute user={user} role="guest">
                <GuestAlerts user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/bookings"
            element={
              <ProtectedRoute user={user} role="guest">
                <GuestBookings user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/settings"
            element={
              <ProtectedRoute user={user} role="guest">
                <GuestSettings user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* HOST ROUTES */}
          <Route
            path="/host/home"
            element={
              <ProtectedRoute user={user} role="host">
                <HostHome user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/guests"
            element={
              <ProtectedRoute user={user} role="host">
                <HostGuests user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/alerts"
            element={
              <ProtectedRoute user={user} role="host">
                <HostAlerts user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/logs"
            element={
              <ProtectedRoute user={user} role="host">
                <HostLogs user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/settings"
            element={
              <ProtectedRoute user={user} role="host">
                <HostSettings user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* UNAUTHORIZED */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;