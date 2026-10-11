"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  Eye,
  Star,
  Inbox,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  Check,
  ChevronRight,
  User,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface StatsData {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  profileViews: number;
  avgRating: number;
  totalReviews: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  rejectionReason: string | null;
  isFeatured: boolean;
}

interface CompletionData {
  percentage: number;
  breakdown: {
    bio: boolean;
    avatar: boolean;
    services: boolean;
    portfolio: boolean;
    workingHours: boolean;
  };
}

interface BookingInquiry {
  id: string;
  bookingNumber: string;
  userName: string;
  bookingDate: string;
  bookingTime: string | null;
  eventType: string | null;
  eventLocation: string | null;
  requirements: string | null;
  numberOfPeople: number;
  status: string;
  createdAt: string;
  user: {
    avatarUrl: string | null;
  };
  service: {
    priceType: string;
    priceFrom: number;
    priceTo: number | null;
    category: { name: string };
    subCategory: { name: string } | null;
  } | null;
}

export default function ArtistDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingInquiry[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/artist/stats");
        const json = await res.json();

        if (json.success && json.data) {
          setStats(json.data.stats);
          setCompletion(json.data.completion);
          setRecentBookings(json.data.recentBookings || []);
        }
      } catch (err) {
        console.error("Failed to load artist stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 w-full rounded-2xl animate-pulse bg-neutral-200/70" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl animate-pulse bg-neutral-200/70" />
          ))}
        </div>
        <div className="h-64 w-full rounded-2xl animate-pulse bg-neutral-200/70" />
      </div>
    );
  }

  const status = stats?.status || "PENDING";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Status Notice Banners */}
      {status === "PENDING" && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 md:p-6 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-neutral-900 flex items-center gap-2">
                Application Under Administrative Review
                <span className="text-[11px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  24–48 Hours
                </span>
              </h2>
              <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                Our verification team is carefully reviewing your profile and portfolio to ensure maximum quality for clients. You can continue uploading photos and refining your services.
              </p>
            </div>
          </div>
          <Link href="/artist/portfolio">
            <Button
              variant="outline"
              className="border-amber-300 text-amber-900 hover:bg-amber-100/60 font-medium shrink-0 min-h-[44px]"
            >
              Upload More Photos
            </Button>
          </Link>
        </div>
      )}

      {status === "REJECTED" && (
        <div className="bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/30 rounded-2xl p-5 md:p-6 text-rose-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-600 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-rose-950">
                Action Required: Profile Needs Updates
              </h2>
              <p className="text-sm text-rose-900/80 mt-1 max-w-2xl">
                The administrative review team requested the following corrections:
              </p>
              {stats?.rejectionReason && (
                <div className="mt-2.5 p-3 rounded-lg bg-white/80 border border-rose-200 text-rose-950 text-xs font-medium">
                  &ldquo;{stats.rejectionReason}&rdquo;
                </div>
              )}
            </div>
          </div>
          <Link href="/artist/profile">
            <Button className="bg-[#eb7583] hover:bg-[#d66573] text-white shrink-0 shadow-xs min-h-[44px]">
              Fix & Resubmit
            </Button>
          </Link>
        </div>
      )}

      {status === "SUSPENDED" && (
        <div className="bg-neutral-900 text-white rounded-2xl p-5 md:p-6 border border-neutral-800 flex items-start gap-3.5">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-base">Account Suspended</h2>
            <p className="text-sm text-neutral-300 mt-1">
              Your profile is currently hidden from public discovery. Please reach out to administrative support at{" "}
              <span className="text-[#eb7583] underline">support@glambook.com</span> to restore access.
            </p>
          </div>
        </div>
      )}

      {status === "APPROVED" && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-950">
                Your profile is active and verified on GlamBook!
              </p>
              <p className="text-xs text-neutral-600">
                Clients searching in your location can discover your work and send booking inquiries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="border border-border/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Inquiries
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-neutral-900">
              {stats?.totalBookings ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.completedBookings ?? 0} completed bookings
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Requests
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-amber-600">
              {stats?.pendingBookings ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires artist response
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Profile Views
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-neutral-900">
              {stats?.profileViews ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime discovery impressions
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Average Rating
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-serif text-neutral-900">
                {stats?.avgRating ? stats.avgRating.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.totalReviews ?? 0} verified client reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Profile Completion & Checklist */}
      {completion && completion.percentage < 100 && (
        <Card className="border border-border/80 shadow-2xs bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#eb7583]" />
                  Profile Optimization
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete all sections to rank higher in client search results and attract more leads.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-neutral-900">
                  {completion.percentage}%
                </span>
                <div className="w-32 bg-neutral-100 rounded-full h-2.5 overflow-hidden border border-neutral-200">
                  <div
                    className="bg-[#eb7583] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Link
                href="/artist/profile"
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between transition-colors min-h-[44px]",
                  completion.breakdown.bio
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-neutral-50 hover:bg-neutral-100/80 border-border text-neutral-700"
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  {completion.breakdown.bio ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  <span>Detailed Bio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/artist/profile"
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between transition-colors min-h-[44px]",
                  completion.breakdown.avatar
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-neutral-50 hover:bg-neutral-100/80 border-border text-neutral-700"
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  {completion.breakdown.avatar ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  <span>Avatar Photo</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/artist/services"
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between transition-colors min-h-[44px]",
                  completion.breakdown.services
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-neutral-50 hover:bg-neutral-100/80 border-border text-neutral-700"
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  {completion.breakdown.services ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  <span>Add Services</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/artist/portfolio"
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between transition-colors min-h-[44px]",
                  completion.breakdown.portfolio
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-neutral-50 hover:bg-neutral-100/80 border-border text-neutral-700"
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  {completion.breakdown.portfolio ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  <span>3+ Portfolio Photos</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/artist/calendar"
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between transition-colors min-h-[44px]",
                  completion.breakdown.workingHours
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-neutral-50 hover:bg-neutral-100/80 border-border text-neutral-700"
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  {completion.breakdown.workingHours ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  <span>Working Hours</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Recent Booking Inquiries (Strict Lead Privacy) */}
      <Card className="border border-border/80 shadow-2xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
          <div>
            <CardTitle className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#eb7583]" />
              Recent Booking Inquiries
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct booking coordination requests from prospective clients.
            </p>
          </div>
          <Link href="/artist/bookings">
            <Button variant="ghost" size="sm" className="text-xs text-[#eb7583] hover:text-[#d66573] hover:bg-[#eb7583]/10 min-h-[44px]">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-900">
                No Booking Inquiries Yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Once your profile is verified and active, requests from interested clients will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Client Avatar */}
                    {b.user?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.user.avatarUrl}
                        alt={b.userName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold text-sm shrink-0 border border-[#eb7583]/20">
                        {b.userName[0]?.toUpperCase() || "C"}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-900">
                          {b.userName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          #{b.bookingNumber}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>
                          {b.service?.category?.name || "Service"}
                          {b.service?.subCategory?.name && ` • ${b.service.subCategory.name}`}
                        </span>
                        <span>•</span>
                        <span>{formatDate(b.bookingDate)} {b.bookingTime ? `at ${b.bookingTime}` : ""}</span>
                        {b.eventLocation && (
                          <>
                            <span>•</span>
                            <span>{b.eventLocation}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge
                      className={cn(
                        "text-xs px-2.5 py-0.5",
                        b.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                        b.status === "ACCEPTED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                        b.status === "COMPLETED" && "bg-blue-50 text-blue-700 border-blue-200",
                        b.status === "REJECTED" && "bg-rose-50 text-rose-700 border-rose-200",
                        b.status === "CANCELLED" && "bg-neutral-100 text-neutral-600 border-neutral-200"
                      )}
                    >
                      {b.status}
                    </Badge>
                    <Link href={`/artist/bookings`}>
                      <Button variant="outline" size="sm" className="text-xs min-h-[44px]">
                        Review Lead
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Quick Actions Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/artist/portfolio"
          className="p-4 rounded-xl border border-border bg-white hover:border-[#eb7583]/50 hover:shadow-xs transition-all flex items-center gap-3 group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-lg bg-pink-50 text-[#eb7583] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-[#eb7583] transition-colors">
              Manage Portfolio
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload photos & videos
            </p>
          </div>
        </Link>

        <Link
          href="/artist/services"
          className="p-4 rounded-xl border border-border bg-white hover:border-[#eb7583]/50 hover:shadow-xs transition-all flex items-center gap-3 group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-[#eb7583] transition-colors">
              Services & Pricing
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit rates and packages
            </p>
          </div>
        </Link>

        <Link
          href="/artist/calendar"
          className="p-4 rounded-xl border border-border bg-white hover:border-[#eb7583]/50 hover:shadow-xs transition-all flex items-center gap-3 group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-[#eb7583] transition-colors">
              Calendar & Schedule
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set availability & hours
            </p>
          </div>
        </Link>

        <Link
          href="/artist/profile"
          className="p-4 rounded-xl border border-border bg-white hover:border-[#eb7583]/50 hover:shadow-xs transition-all flex items-center gap-3 group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-[#eb7583] transition-colors">
              Edit Profile
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bio, location, contact
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
