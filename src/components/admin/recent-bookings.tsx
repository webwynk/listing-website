"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { AdminRecentBooking, BookingStatus } from "@/types";

interface RecentBookingsProps {
  bookings: AdminRecentBooking[];
  loading?: boolean;
}

export function RecentBookings({ bookings, loading }: RecentBookingsProps) {
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Accepted</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse">
        <div className="h-6 w-44 bg-gray-100 rounded-md mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#fcdadb] text-[#eb7583] flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-title text-lg font-bold text-[#1e1a19]">
              Recent Lead Requests
            </h2>
            <p className="text-xs text-gray-500">
              Latest client bookings (Full lead details privileged to Admin)
            </p>
          </div>
        </div>

        <Link
          href="/admin/bookings"
          className="text-xs font-semibold text-[#eb7583] hover:text-[#d4616f] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">No Bookings Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            When users submit booking requests on the platform, full lead contact information will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Booking #</th>
                  <th className="py-3 px-6">Client / Contact</th>
                  <th className="py-3 px-6">Artist</th>
                  <th className="py-3 px-6">Service &amp; Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Booking Number */}
                    <td className="py-4 px-6 font-mono text-xs font-medium text-gray-900">
                      {b.bookingNumber}
                    </td>

                    {/* Client & Contact (Admin Privacy View) */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{b.customerName}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                        {b.customerPhone && (
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="flex items-center gap-1 hover:text-[#eb7583] transition-colors"
                            title="Call client"
                          >
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{b.customerPhone}</span>
                          </a>
                        )}
                        {b.customerEmail && (
                          <a
                            href={`mailto:${b.customerEmail}`}
                            className="flex items-center gap-1 hover:text-[#eb7583] transition-colors"
                            title="Email client"
                          >
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-[140px]">
                              {b.customerEmail}
                            </span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {b.artistName}
                    </td>

                    {/* Service & Event Date */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {b.serviceName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Event: {b.eventDate}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">{getStatusBadge(b.status)}</td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/bookings?id=${b.id}`}
                        className="text-xs font-semibold text-gray-600 hover:text-[#eb7583] transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (20-Point Polish Standard #11) */}
          <div className="md:hidden divide-y divide-gray-100">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gray-900">
                    {b.bookingNumber}
                  </span>
                  {getStatusBadge(b.status)}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {b.customerName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Artist: <span className="font-medium text-gray-700">{b.artistName}</span>
                  </p>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl space-y-1">
                  <div>
                    <span className="text-gray-400">Service:</span> {b.serviceName}
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span> {b.eventDate}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs">
                  {b.customerPhone && (
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Call</span>
                    </a>
                  )}
                  {b.customerEmail && (
                    <a
                      href={`mailto:${b.customerEmail}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>Email</span>
                    </a>
                  )}
                  <Link
                    href={`/admin/bookings?id=${b.id}`}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#eb7583]"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
