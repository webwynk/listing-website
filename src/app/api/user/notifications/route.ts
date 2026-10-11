import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/notifications
 * Returns notifications and unread counter for the authenticated client
 */
export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL";

    const where: any = {
      userId: user.id,
    };

    if (filter === "UNREAD") {
      where.isRead = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false,
        },
      }),
    ]);

    return apiSuccess({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/user/notifications
 * Marks a single notification or all notifications as read
 */
export async function PATCH(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json().catch(() => ({}));
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return apiSuccess(null, "All notifications marked as read.");
    }

    if (notificationId) {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: user.id,
        },
        data: {
          isRead: true,
        },
      });

      return apiSuccess(null, "Notification marked as read.");
    }

    return apiError("Missing notification ID or action.", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
