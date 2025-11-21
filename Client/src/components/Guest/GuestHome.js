import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Bell, Settings, MapPin, Home } from "lucide-react";
import api from "./api"; // Axios instance with baseURL

// Example test bookings for testing
const testBookings = [
  {
    id: 1,
    propertyName: "Dundalk Apartment",
    propertyAddress: "123 Main Street, Dundalk, Ireland",
    checkIn: "2025-11-20T15:00:00",
    checkOut: "2025-11-25T11:00:00",
    bookingCode: "TEST123"
  },
  {
    id: 2,
    propertyName: "Dublin Suite",
    propertyAddress: "456 O'Connell Street, Dublin, Ireland",
    checkIn: "2025-12-01T14:00:00",
    checkOut: "2025-12-05T11:00:00",
    bookingCode: "TEST456"
  },
  {
    id: 3,
    propertyName: "Galway Loft",
    propertyAddress: "789 High Street, Galway, Ireland",
    checkIn: "2025-12-10T15:00:00",
    checkOut: "2025-12-15T11:00:00",
    bookingCode: "TEST789"
  }
];

function GuestHome() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [guestData, setGuestData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guest data and alerts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resBooking = await api.get("/guest/current-booking");
        setGuestData(resBooking.data);

        const resAlerts = await api.get("/guest/alerts");
        setAlerts(resAlerts.data);
      } catch (err) {
        console.error("Error fetching guest data:", err);
        setError("Failed to load guest data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to add a test booking
  const addTestBooking = async (booking) => {
    try {
      await api.post("/guest/add-booking", {
        bnb_id: booking.id,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        booking_code: booking.bookingCode
      });

      // Refresh guest data
      const res = await api.get("/guest/current-booking");
      setGuestData(res.data);
    } catch (err) {
      console.error("Failed to add booking:", err);
      alert("Failed to add booking");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  // Show test booking selection if no booking exists
  if (!guestData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">No booking found</h2>
        <p className="text-sm text-slate-600 mb-6">Select a test booking to add:</p>
        <div className="flex flex-col gap-3">
          {testBookings.map((b) => (
            <button
              key={b.id}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              onClick={() => addTestBooking(b)}
            >
              {b.propertyName}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 px-4 pt-4 pb-24">
        <div className="w-full max-w-sm mx-auto space-y-4">
          {/* Welcome card */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="px-4 py-3">
              <h2 className="text-base font-semibold text-slate-900">
                Welcome back, {guestData.name}! 👋
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your stay at {guestData.propertyName}
              </p>
            </div>

            <div className="px-4 pb-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-cyan-500 mt-0.5" />
                <div>
                  <p>
                    <span className="font-medium">Check-in:&nbsp;</span>
                    {guestData.checkIn} {guestData.checkInTime}
                  </p>
                  <p>
                    <span className="font-medium">Check-out:&nbsp;</span>
                    {guestData.checkOut} {guestData.checkOutTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-500 mt-0.5" />
                <p>{guestData.propertyAddress}</p>
              </div>
            </div>
          </section>

          {/* Booking card */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Current Booking
              </h3>
            </div>

            <div className="px-4 py-3 space-y-3 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Code</span>
                <span className="font-medium text-slate-900">
                  {guestData.bookingCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-in Time</span>
                <span className="font-medium text-slate-900">
                  {guestData.checkInTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-out Time</span>
                <span className="font-medium text-slate-900">
                  {guestData.checkOutTime}
                </span>
              </div>
            </div>
          </section>

          {/* Alerts */}
          {alerts.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Alerts</h3>
              </div>
              <div className="px-4 py-3 space-y-2">
                {alerts.map((a) => (
                  <div key={a.id} className="flex justify-between text-xs">
                    <span>{a.message}</span>
                    <span
                      className={`px-2 rounded-full ${
                        a.status === "Pending"
                          ? "bg-red-500 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 inset-x-0 bg-white border-t shadow-sm">
        <div className="max-w-sm mx-auto flex justify-between px-6 py-2 text-xs">
          <NavItem to="/guest/home" label="Home" icon={Home} active={isActive("/guest/home")} />
          <NavItem to="/guest/bookings" label="Bookings" icon={Calendar} active={isActive("/guest/bookings")} />
          <NavItem
            to="/guest/alerts"
            label="Alerts"
            icon={Bell}
            active={isActive("/guest/alerts")}
            showDot={alerts.some(a => a.status === "Pending")}
          />
          <NavItem to="/guest/settings" label="Settings" icon={Settings} active={isActive("/guest/settings")} />
        </div>
      </nav>
    </div>
  );
}

const NavItem = ({ to, label, icon: Icon, active, showDot }) => (
  <Link to={to} className={`relative flex flex-col items-center gap-0.5 ${active ? "text-sky-600" : "text-slate-500"}`}>
    <Icon className="w-5 h-5" />
    {showDot && <span className="absolute -top-0.5 right-3 w-2 h-2 rounded-full bg-red-500" />}
    <span>{label}</span>
  </Link>
);

export default GuestHome;