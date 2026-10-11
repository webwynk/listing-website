import prisma from "./prisma";

/**
 * Generates a unique, standardized booking number in the format: GB-YYYYMMDD-XXX
 * Example: GB-20261001-001
 */
export async function generateBookingNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePrefix = `GB-${year}${month}${day}`;

  // Count existing bookings for today to determine sequence
  const startOfDay = new Date(year, now.getMonth(), now.getDate());
  const endOfDay = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const countToday = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(countToday + 1).padStart(3, "0");
  const bookingNumber = `${datePrefix}-${sequence}`;

  // Double check uniqueness in case of race condition
  const existing = await prisma.booking.findUnique({
    where: { bookingNumber },
  });

  if (existing) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${datePrefix}-${sequence}${randomSuffix}`;
  }

  return bookingNumber;
}

/**
 * 🔒 LEAD PRIVACY ENFORCER:
 * Sanitizes booking records before returning them to an Artist.
 * Completely strips userPhone and userEmail to protect the platform business model.
 */
export function sanitizeBookingForArtist<T extends Record<string, any>>(booking: T): Omit<T, "userPhone" | "userEmail"> {
  const { userPhone, userEmail, ...sanitized } = booking;
  return sanitized;
}

/**
 * Sanitizes an array of booking records for Artist consumption.
 */
export function sanitizeBookingsListForArtist<T extends Record<string, any>>(bookings: T[]): Array<Omit<T, "userPhone" | "userEmail">> {
  return bookings.map(sanitizeBookingForArtist);
}
