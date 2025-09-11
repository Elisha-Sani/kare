"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

type Request = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  details: string;
  eventType: string;
  status: string;
  createdAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [selected, setSelected] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchRequests = async (
    page = 1,
    limit = 5,
    status = "",
    search = ""
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.append("status", status);
      if (search) params.append("search", search);

      const res = await fetch(`/api/requests?${params.toString()}`);
      const result = await res.json();

      setRequests(result.data.requests);
      setPagination(result.data.pagination);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(pagination.page, pagination.limit, statusFilter, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, statusFilter, search]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchRequests(pagination.page, pagination.limit, statusFilter, search);
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Client Requests</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            className="pl-8 pr-4 py-2 border rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Event</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : requests.length > 0 ? (
              requests.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {r.firstName} {r.lastName}
                  </td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.eventType}</td>
                  <td className="px-4 py-2 font-medium">{r.status}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 text-blue-600 hover:underline text-sm"
                      onClick={() => setSelected(r)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages} — {pagination.total}{" "}
          total
        </p>
        <div className="flex gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            className="p-2 border rounded disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            className="p-2 border rounded disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-2">
              Request #{selected.id} — {selected.status}
            </h2>
            <p>
              <b>User:</b> {selected.firstName} {selected.lastName}
            </p>
            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Event:</b> {selected.eventType}
            </p>
            <p>
              <b>Description:</b> {selected.details}
            </p>
            <p className="text-sm text-gray-500">
              Submitted: {new Date(selected.createdAt).toLocaleString()}
            </p>

            {/* Status update buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "PENDING",
                "APPROVED",
                "IN_PROGRESS",
                "COMPLETED",
                "REJECTED",
                "CANCELLED",
                "ON_HOLD",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    s === "PENDING"
                      ? "bg-yellow-500"
                      : s === "APPROVED"
                      ? "bg-green-500"
                      : s === "IN_PROGRESS"
                      ? "bg-blue-500"
                      : s === "COMPLETED"
                      ? "bg-emerald-600"
                      : s === "REJECTED"
                      ? "bg-red-500"
                      : s === "CANCELLED"
                      ? "bg-gray-600"
                      : "bg-amber-500"
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 bg-slate-500 text-white rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
