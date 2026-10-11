import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return handleKeepAlive(req);
}

export async function POST(req: NextRequest) {
  return handleKeepAlive(req);
}

async function handleKeepAlive(req: NextRequest) {
  const startTime = performance.now();

  // 1. Authorization check if CRON_SECRET is configured
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get("secret");

    const isBearerValid = authHeader === `Bearer ${cronSecret}`;
    const isQueryValid = querySecret === cronSecret;

    if (!isBearerValid && !isQueryValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing cron secret.",
        },
        { status: 401 }
      );
    }
  }

  // 2. Execute active SQL transactions to reset Supabase inactivity timer
  try {
    const rawResult: any = await prisma.$queryRaw`SELECT NOW() as current_time, 1 as keep_alive`;
    const categoriesCount = await prisma.category.count();

    const latencyMs = Math.round(performance.now() - startTime);

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        latencyMs,
        message: "Supabase database pinged successfully. 7-day inactivity timer reset.",
        database: {
          status: "connected",
          categoriesCount,
          serverTime: rawResult?.[0]?.current_time || null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    console.error("Supabase keep-alive failed:", error);

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        latencyMs,
        error: error.message || "Failed to communicate with database.",
        database: {
          status: "disconnected",
        },
      },
      { status: 500 }
    );
  }
}
