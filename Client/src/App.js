import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
  const [user, setUser] = useState(() => {
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
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />

          {/* Guest routes */}
          <Route path="/guest/home" element={<GuestHome />} />
          <Route path="/guest/alerts" element={<GuestAlerts />} />
          <Route path="/guest/bookings" element={<GuestBookings />} />
          <Route path="/guest/settings" element={<GuestSettings />} />

          {/* Host routes */}
          <Route path="/host/home" element={<HostHome />} />
          <Route path="/host/guests" element={<HostGuests />} />
          <Route path="/host/alerts" element={<HostAlerts />} />
          <Route path="/host/logs" element={<HostLogs />} />
          <Route path="/host/settings" element={<HostSettings />} />

          {/* Catch-all */}
          <Route path="*" element={<Landing />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;