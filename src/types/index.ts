/**
 * GlamBook Core Type Definitions
 * Aligned with PRD_Backend.md and Prisma Schema
 */

export type UserRole = "USER" | "ARTIST" | "ADMIN";

export type ArtistApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type PackageType = "BRIDAL" | "GROOM" | "PARTY" | "PRE_WEDDING" | "CUSTOM";

export type BlogPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BannerPosition = "HOME_HERO" | "HOME_MIDDLE" | "FIND_ARTIST_TOP";

export type NotificationType =
  | "BOOKING_NEW"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_COMPLETED"
  | "ARTIST_APPROVED"
  | "ARTIST_REJECTED"
  | "REVIEW_NEW"
  | "SYSTEM";

/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Safe User Session Object
 */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  emailVerified: boolean;
  createdAt: Date | string;
}

/**
 * Admin Dashboard Data Definitions
 */
export interface AdminDashboardMetrics {
  totalArtists: number;
  approvedArtists: number;
  pendingArtists: number;
  totalUsers: number;
  totalBookings: number;
  thisMonthBookings: number;
  totalReviews: number;
  unreadContacts: number;
}

export interface AdminRecentBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  totalAmount: number | null;
  status: BookingStatus;
  artistName: string;
  serviceName: string;
  createdAt: string;
}

export interface AdminRecentArtist {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  status: ArtistApprovalStatus;
  categoryName?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface AdminBookingTrend {
  date: string;
  label: string;
  count: number;
}

export interface AdminCategoryDistribution {
  name: string;
  count: number;
  color?: string;
}

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  recentBookings: AdminRecentBooking[];
  recentArtists: AdminRecentArtist[];
  bookingTrends: AdminBookingTrend[];
  categoryDistribution: AdminCategoryDistribution[];
}
