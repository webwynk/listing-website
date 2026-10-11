"use client";

import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Tag,
} from "lucide-react";
import { AdminRecentArtist, ArtistApprovalStatus } from "@/types";

interface RecentArtistsProps {
  artists: AdminRecentArtist[];
  loading?: boolean;
}

export function RecentArtists({ artists, loading }: RecentArtistsProps) {
  const getStatusBadge = (status: ArtistApprovalStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Needs Review</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <AlertTriangle className="w-3 h-3" />
            <span>Suspended</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl" />
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
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-title text-lg font-bold text-[#1e1a19]">
              Recent Artist Signups
            </h2>
            <p className="text-xs text-gray-500">
              Profiles needing admin verification and approvals
            </p>
          </div>
        </div>

        <Link
          href="/admin/artists"
          className="text-xs font-semibold text-[#eb7583] hover:text-[#d4616f] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Empty State */}
      {artists.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">No New Artists</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            When makeup artists or photographers sign up, their profiles will appear here for verification.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar Initials / Image */}
                <div className="w-10 h-10 rounded-xl bg-[#eb7583]/10 text-[#eb7583] font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                  {artist.businessName ? artist.businessName.substring(0, 2) : "AR"}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900">
                      {artist.businessName}
                    </h3>
                    {getStatusBadge(artist.status)}
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Owner: <span className="text-gray-700">{artist.ownerName}</span> ({artist.email})
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 flex-wrap">
                    {artist.categoryName && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span>{artist.categoryName}</span>
                      </span>
                    )}
                    {artist.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{artist.city}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0">
                <Link
                  href={`/admin/artists/${artist.id}`}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors min-h-[36px] flex items-center justify-center gap-1"
                >
                  <span>Review Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
