"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Star,
  Check,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchNotifications() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/notifications?filter=${filter}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load notifications.");
      setNotifications(json.data.notifications || []);
      setUnreadCount(json.data.unreadCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  async function handleMarkAllAsRead() {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
    } catch {
      fetchNotifications();
    }
  }

  async function handleMarkSingleAsRead(id: string) {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch {
      // Non-fatal
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "BOOKING_ACCEPTED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "BOOKING_REJECTED":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "REVIEW_RECEIVED":
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case "BOOKING_NEW":
        return <CalendarCheck className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Bell className="w-7 h-7 text-amber-400" />
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Stay updated on appointment confirmations, artist replies, and booking alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold transition min-h-[44px]"
          >
            <Check className="w-3.5 h-3.5" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center gap-2 ${
            filter === "ALL"
              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
          }`}
        >
          All Updates
        </button>

        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center gap-2 ${
            filter === "UNREAD"
              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-neutral-950 font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl animate-pulse h-20"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-red-950/20 border border-red-800/40 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-red-300">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-semibold hover:bg-neutral-700 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Bell className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-serif font-bold text-white">
              No notifications
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              You&apos;re all caught up! New updates on your booking requests and artist replies will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const formattedTime = new Date(n.createdAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.isRead) handleMarkSingleAsRead(n.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition flex items-start gap-4 cursor-pointer ${
                  n.isRead
                    ? "bg-neutral-900/40 border-neutral-800/60 opacity-80"
                    : "bg-neutral-900/90 border-amber-500/30 shadow-md shadow-amber-500/5"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white">
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-neutral-500 whitespace-nowrap">
                      {formattedTime}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {n.message}
                  </p>

                  {n.link && (
                    <div className="pt-2">
                      <Link
                        href={n.link}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
