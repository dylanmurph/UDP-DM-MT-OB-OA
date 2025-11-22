import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, ListChecks, Bell, Settings } from "lucide-react";

const HostNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, label, icon: Icon }) => (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 ${
        isActive(to) ? "text-sky-600" : "text-slate-500"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </Link>
  );

  return (
    <nav className="sticky bottom-0 inset-x-0 bg-white border-t shadow-sm">
      <div className="max-w-md mx-auto flex justify-between px-6 py-2 text-xs">
        <NavItem to="/host/home" label="Home" icon={Home} />
        <NavItem to="/host/guests" label="Guests" icon={Users} />
        <NavItem to="/host/logs" label="Logs" icon={ListChecks} />
        <NavItem to="/host/alerts" label="Alerts" icon={Bell} />
        <NavItem to="/host/settings" label="Settings" icon={Settings} />
      </div>
    </nav>
  );
};

export default HostNav;
