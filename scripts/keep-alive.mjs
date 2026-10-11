/**
 * GlamBook — Supabase Keep-Alive CLI Script
 * Executes an active SQL query against Supabase PostgreSQL to reset the 7-day inactivity timer.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const start = performance.now();
  console.log("🔄 Pinging Supabase database to reset 7-day inactivity timer...");

  try {
    const rawResult = await prisma.$queryRaw`SELECT NOW() as current_time, 1 as keep_alive`;
    const categoriesCount = await prisma.category.count();
    const duration = Math.round(performance.now() - start);

    console.log("✅ Supabase Keep-Alive Succeeded!");
    console.log(`⏱️ Latency: ${duration}ms`);
    console.log(`📅 DB Server Time: ${rawResult[0]?.current_time}`);
    console.log(`📊 Active Categories: ${categoriesCount}`);
    console.log("🎉 7-day inactivity timer successfully reset.");
  } catch (error) {
    console.error("❌ Database Keep-Alive Failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
