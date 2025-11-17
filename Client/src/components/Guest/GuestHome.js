import React from "react";
import { Calendar, Bell, Settings, MapPin } from "lucide-react";

// TEMP – replace with real data later
const guestData = {
  name: "Oluwadamilare",
  propertyName: "Dundalk Apartment",
  propertyAddress: "123 Main Street, Dundalk, Ireland",
  checkIn: "2025-11-20",
  checkOut: "2025-11-25",
  bookingCode: "ABC12345",
};

function GuestHome({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* Soft grid background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main content wrapper */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Welcome Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/70">
            <h2 className="text-lg font-semibold text-slate-900">
              Welcome back, {guestData.name}! 👋
            </h2>
            <p className="text-sm text-slate-500">
              Your stay at {guestData.propertyName}
            </p>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Check-in/out */}
            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">Check-in:</span> {guestData.checkIn}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Check-out:</span> {guestData.checkOut}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="w-5 h-5 text-cyan-500" />
              <p className="text-sm">{guestData.propertyAddress}</p>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/70">
            <h3 className="text-base font-semibold text-slate-900">
              Current Booking
            </h3>
          </div>

          <div className="px-5 py-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500">Booking Code</span>
              <span className="font-medium">{guestData.bookingCode}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500">Check-in Time</span>
              <span className="font-medium">15:00</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500">Check-out Time</span>
              <span className="font-medium">11:00</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-3 gap-3">
          {/* Bookings */}
          <button
            onClick={() => onNavigate?.("bookings")}
            className="flex flex-col items-center justify-center gap-1 bg-white/95 backdrop-blur border border-slate-200/70 rounded-xl py-3 text-xs font-medium text-slate-900 hover:bg-cyan-50 transition shadow-md"
          >
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>Bookings</span>
          </button>

          {/* Alerts */}
          <button
            onClick={() => onNavigate?.("alerts")}
            className="flex flex-col items-center justify-center gap-1 bg-white/95 backdrop-blur border border-slate-200/70 rounded-xl py-3 text-xs font-medium text-slate-900 hover:bg-cyan-50 transition shadow-md"
          >
            <Bell className="w-4 h-4 text-cyan-500" />
            <span>Alerts</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => onNavigate?.("settings")}
            className="flex flex-col items-center justify-center gap-1 bg-white/95 backdrop-blur border border-slate-200/70 rounded-xl py-3 text-xs font-medium text-slate-900 hover:bg-cyan-50 transition shadow-md"
          >
            <Settings className="w-4 h-4 text-cyan-500" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default GuestHome;