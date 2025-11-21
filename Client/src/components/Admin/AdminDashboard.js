import { Users, Building2, UserCheck, AlertTriangle } from 'lucide-react';

export function AdminDashboard() {
  const totalHosts = adminHosts.length;
  const activeHosts = adminHosts.filter((h) => h.status === 'Active').length;
  const totalProperties = adminProperties.length;
  const activeProperties = adminProperties.filter((p) => p.status === 'Active').length;
  const totalActiveGuests = adminHosts.reduce((sum, host) => sum + host.activeGuests, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2 text-xl md:text-2xl font-semibold">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          System-wide overview and management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Total Hosts */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs md:text-sm text-slate-500">Total Hosts</p>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl md:text-3xl font-semibold">{totalHosts}</div>
                <p className="text-xs text-green-600 mt-1">{activeHosts} active</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Total Properties */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs md:text-sm text-slate-500">Total Properties</p>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl md:text-3xl font-semibold">{totalProperties}</div>
                <p className="text-xs text-green-600 mt-1">{activeProperties} active</p>
              </div>
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Active Guests */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs md:text-sm text-slate-500">Active Guests</p>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl md:text-3xl font-semibold">
                {totalActiveGuests}
              </div>
              <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs md:text-sm text-slate-500">System Health</p>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-medium px-2 py-1">
                Excellent
              </span>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Hosts */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-base md:text-lg font-semibold">
            Top Hosts by Properties
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Hosts with the most properties
          </p>
        </div>
        <div className="px-4 pb-4 space-y-3">
          {adminHosts
            .slice()
            .sort((a, b) => b.propertiesCount - a.propertiesCount)
            .slice(0, 5)
            .map((host) => (
              <div
                key={host.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">
                      {host.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm truncate font-medium">
                      {host.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {host.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs md:text-sm">
                      {host.propertiesCount} properties
                    </p>
                    <p className="text-xs text-slate-500">
                      {host.activeGuests} guests
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full text-xs px-2 py-1 ${
                      host.status === 'Active'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {host.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Properties */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-base md:text-lg font-semibold">All Properties</h2>
          <p className="text-xs md:text-sm text-slate-500">
            Properties across all hosts
          </p>
        </div>
        <div className="px-4 pb-4 space-y-2">
          {adminProperties.slice(0, 6).map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg gap-3"
            >
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <Building2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm truncate font-medium">
                    {property.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    Host: {property.hostName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs">{property.activeGuests} guests</p>
                  <p className="text-xs text-slate-500">
                    {property.nfcDevices} NFC devices
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full text-xs px-2 py-1 ${
                    property.status === 'Active'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;