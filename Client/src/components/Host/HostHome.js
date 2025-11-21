import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, ListChecks, Bell, Settings } from "lucide-react";
import api from "./api";

const HostHome = () => {
  const location = useLocation();

  // --- State ---
  const [guests, setGuests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch data from backend ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [guestsRes, logsRes, alertsRes] = await Promise.all([
          api.get("/host/guests"),
          api.get("/host/logs"),
          api.get("/host/alerts"),
        ]);

        setGuests(guestsRes.data);
        setLogs(logsRes.data);
        setAlerts(alertsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load host data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Computed stats ---
  const activeGuests = guests.filter((g) => g.status === "Active").length;
  const failedAttempts = logs.filter((l) => l.status.toLowerCase() === "failure").length;
  const pendingAlerts = alerts.filter((a) => a.status.toLowerCase() === "pending").length;

  const isActive = (path) => location.pathname === path;

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-slate-900 mb-2 text-lg md:text-2xl font-semibold">
            Dashboard
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Overview of your property access system
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Current Guests" value={activeGuests} />
          <StatCard label="Failed Attempts (24h)" value={failedAttempts} valueClass="text-red-600" />
          <StatCard label="System Status">
            <div className="inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs md:text-sm text-green-700 font-medium">Online</span>
            </div>
          </StatCard>
          <StatCard label="Pending Alerts" value={pendingAlerts} valueClass="text-yellow-600" />
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="border-b px-4 py-3 md:px-5 md:py-4">
            <h2 className="text-base md:text-lg font-semibold">Recent Alerts</h2>
            <p className="text-xs md:text-sm text-slate-500">
              Latest notifications requiring attention
            </p>
          </div>
          <div className="p-3 md:p-4 space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 bg-slate-50 rounded-xl gap-2"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-xs md:text-sm break-words">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(alert.time).toLocaleString()}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                    alert.status.toLowerCase() === "resolved"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-sky-500 text-white"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-xs text-slate-500 text-center">No alerts</p>
            )}
          </div>
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="sticky bottom-0 inset-x-0 bg-white border-t shadow-sm">
        <div className="max-w-md mx-auto flex justify-between px-6 py-2 text-xs">
          <NavItem to="/host/home" label="Home" icon={Home} active={isActive("/host/home")} />
          <NavItem to="/host/guests" label="Guests" icon={Users} active={isActive("/host/guests")} />
          <NavItem to="/host/logs" label="Logs" icon={ListChecks} active={isActive("/host/logs")} />
          <NavItem to="/host/alerts" label="Alerts" icon={Bell} active={isActive("/host/alerts")} />
          <NavItem to="/host/settings" label="Settings" icon={Settings} active={isActive("/host/settings")} />
        </div>
      </nav>
    </div>
  );
};

// --- Reusable StatCard ---
const StatCard = ({ label, value, valueClass, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-3 md:p-4 flex flex-col justify-between border border-slate-100">
    <p className="text-xs md:text-sm text-slate-500 mb-1">{label}</p>
    {children || <div className={`text-2xl md:text-3xl font-semibold ${valueClass || ""}`}>{value}</div>}
  </div>
);

// --- NavItem ---
const NavItem = ({ to, label, icon: Icon, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center gap-1 ${active ? "text-sky-600" : "text-slate-500"}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export default HostHome;