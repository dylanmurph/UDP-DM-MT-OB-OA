import React from "react";
import { Calendar, Bell, Settings, MapPin } from "lucide-react";

// TEMP data – swap this with real data / API later
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
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold">
              Welcome back, {guestData.name}! 👋
            </h2>
            <p className="text-sm text-slate-500">
              Your stay at {guestData.propertyName}
            </p>
          </div>

          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="w-5 h-5" />
              <div>
                <div className="text-sm">
                  <span className="font-medium">Check-in:</span>{" "}
                  {guestData.checkIn}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Check-out:</span>{" "}
                  {guestData.checkOut}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5" />
              <div className="text-sm">{guestData.propertyAddress}</div>
            </div>
          </div>
        </div>

        {/* Current Booking Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold">Current Booking</h3>
          </div>

          <div className="px-5 py-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Code</span>
              <span className="font-medium">{guestData.bookingCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-in Time</span>
              <span className="font-medium">15:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-out Time</span>
              <span className="font-medium">11:00</span>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate && onNavigate("bookings")}
            className="flex flex-col items-center justify-center gap-1 bg-white border border-slate-200 rounded-xl py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("alerts")}
            className="flex flex-col items-center justify-center gap-1 bg-white border border-slate-200 rounded-xl py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("settings")}
            className="flex flex-col items-center justify-center gap-1 bg-white border border-slate-200 rounded-xl py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuestHome;
