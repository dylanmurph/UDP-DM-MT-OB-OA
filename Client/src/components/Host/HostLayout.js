import React from "react";
import { Outlet } from "react-router-dom";
import HostNav from "./HostNav";

const HostLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>

      <HostNav />
    </div>
  );
};

export default HostLayout;
