"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RotateCw,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Star,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ARTIST" | "ADMIN";
  avatarUrl?: string | null;
  city?: string | null;
  state?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  bookingsCount: number;
  reviewsCount: number;
  favoritesCount: number;
  createdAt: string;
}

interface UserCounts {
  all: number;
  user: number;
  artist: number;
  admin: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [counts, setCounts] = useState<UserCounts>({
    all: 0,
    user: 0,
    artist: 0,
    admin: 0,
  });
  const [roleTab, setRoleTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (roleTab !== "ALL") params.append("role", roleTab);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load users.");
      }

      setUsers(data.data?.users || []);
      if (data.data?.counts) setCounts(data.data.counts);
      if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [roleTab, search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Toggle Status
  const handleToggleStatus = async (user: UserItem) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle-status`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteError(null);

    const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error);

    fetchUsers(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>Administrator</span>
          </span>
        );
      case "ARTIST":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span>Artist</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span>Client</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-title text-2xl md:text-3xl font-bold text-[#1e1a19]">
            User Accounts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Oversee registered client profiles, roles, and security access
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchUsers(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs min-h-[40px] disabled:opacity-50"
            title="Refresh list"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? "animate-spin text-[#eb7583]" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 overflow-x-auto pb-1 text-xs">
        {[
          { key: "ALL", label: "All Accounts", count: counts.all },
          { key: "USER", label: "Clients", count: counts.user },
          { key: "ARTIST", label: "Artists", count: counts.artist },
          { key: "ADMIN", label: "Administrators", count: counts.admin },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setRoleTab(tab.key);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
              roleTab === tab.key
                ? "border-[#eb7583] text-[#eb7583] bg-[#eb7583]/5"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                roleTab === tab.key
                  ? "bg-[#eb7583] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold text-rose-700 hover:text-rose-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table & Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4">
          <div className="h-6 w-44 bg-gray-100 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            {search ? "No users match your search" : "No users in this view"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search criteria."
              : "Registered users will appear here as accounts are created."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">User Account</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Contact &amp; Location</th>
                  <th className="py-3 px-6">Activity</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Registered</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* User Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {user.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.isEmailVerified && (
                              <span title="Verified Email">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">{getRoleBadge(user.role)}</td>

                    {/* Contact & Location */}
                    <td className="py-4 px-6 text-xs text-gray-600">
                      {user.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No phone</span>
                      )}
                      <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{user.city || "Location unset"}</span>
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="py-4 px-6 text-xs text-gray-600">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1" title="Total Bookings">
                          <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-gray-900">{user.bookingsCount}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Submitted Reviews">
                          <Star className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-gray-900">{user.reviewsCount}</span>
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-gray-400" />
                            <span>Suspended</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-6 text-xs text-gray-500 font-mono">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </Link>
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteError(null);
                              setDeleteDialogOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (20-Point Polish Standard #11) */}
          <div className="lg:hidden divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {user.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                  <span>{user.city || "No city"}</span>
                  <span>{user.bookingsCount} bookings</span>
                  <span className={user.isActive ? "text-emerald-700 font-semibold" : "text-gray-500"}>
                    {user.isActive ? "Active" : "Suspended"}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700"
                  >
                    View Dossier
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700"
                  >
                    {user.isActive ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg h-8"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg h-8"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        description="Are you sure you want to permanently delete this user account? All associated bookings and favorites will be permanently removed."
        itemName={userToDelete?.name}
        error={deleteError}
      />
    </div>
  );
}
