import { useState } from 'react';
import { adminHosts, adminProperties } from "../../mockData";
import {Search, UserPlus, Mail, Phone, Building2, UserCheck, Calendar, Trash2, Edit} from 'lucide-react';

export function AdminHosts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredHosts = adminHosts.filter((host) => {
    const matchesSearch =
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || host.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Add Host Modal */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Add New Host</h2>
              <p className="text-sm text-slate-500">
                Enter the details of the new host
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="host-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>
                <input
                  id="host-name"
                  placeholder="John Doe"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="host-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="host-email"
                  type="email"
                  placeholder="john.doe@email.com"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="host-phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>
                <input
                  id="host-phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="host-status"
                  className="text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  id="host-status"
                  defaultValue="Active"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
                className="px-3 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-gradient-to-r from-slate-950 to-slate-900 text-cyan-400 hover:from-slate-900 hover:to-slate-800"
              >
                <UserPlus className="w-4 h-4" />
                Add Host
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-slate-900 mb-2 text-xl md:text-2xl font-semibold">
              Host Management
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Manage all hosts in the system
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-r from-slate-950 to-slate-900 hover:from-slate-900 hover:to-slate-800 text-cyan-400"
          >
            <UserPlus className="w-4 h-4" />
            Add Host
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-4 pt-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-[180px] rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Hosts List */}
        <div className="grid gap-4">
          {filteredHosts.map((host) => {
            const hostProperties = adminProperties.filter(
              (p) => p.hostId === host.id
            );
            return (
              <div
                key={host.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <div className="p-4 pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Avatar */}
                    <div className="flex sm:block justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl font-medium">
                          {host.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base md:text-lg font-semibold">
                              {host.name}
                            </h3>
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
                          <div className="space-y-1 text-xs md:text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{host.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{host.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Joined{' '}
                                {new Date(
                                  host.joinedDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <p className="text-lg md:text-xl font-semibold">
                            {host.propertiesCount}
                          </p>
                          <p className="text-xs text-slate-500">Properties</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <p className="text-lg md:text-xl font-semibold">
                            {host.activeGuests}
                          </p>
                          <p className="text-xs text-slate-500">
                            Active Guests
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <p className="text-lg md:text-xl font-semibold">
                            {hostProperties.length}
                          </p>
                          <p className="text-xs text-slate-500">Listed</p>
                        </div>
                      </div>

                      {/* Properties List */}
                      {hostProperties.length > 0 && (
                        <div className="pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-500 mb-2">
                            Properties:
                          </p>
                          <div className="space-y-2">
                            {hostProperties.map((property) => (
                              <div
                                key={property.id}
                                className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <Building2 className="w-3 h-3 text-purple-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {property.name}
                                  </span>
                                </div>
                                <span
                                  className={`inline-flex items-center rounded-full text-xs px-2 py-1 flex-shrink-0 ${
                                    property.status === 'Active'
                                      ? 'bg-slate-900 text-white'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {property.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHosts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="py-12 text-center text-slate-500 text-sm">
              No hosts found matching your search criteria
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminHosts;