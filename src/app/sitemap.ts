import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glambook.in";

  // Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic approved artist profiles
  let artistRoutes: MetadataRoute.Sitemap = [];
  try {
    const artists = await prisma.artistProfile.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        updatedAt: true,
        user: { select: { username: true } },
      },
      take: 1000,
    });

    artistRoutes = artists.map((a) => ({
      url: `${baseUrl}/artist/${a.user.username || a.id}`,
      lastModified: a.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Error generating artist sitemap routes:", err);
  }

  // Dynamic published blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
      },
      take: 500,
    });

    blogRoutes = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Error generating blog sitemap routes:", err);
  }

  return [...staticRoutes, ...artistRoutes, ...blogRoutes];
}
