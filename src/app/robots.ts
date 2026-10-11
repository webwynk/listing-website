import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glambook.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/artist",
          "/artist/*",
          "/user",
          "/user/*",
          "/api/admin",
          "/api/admin/*",
          "/api/artist",
          "/api/artist/*",
          "/api/user",
          "/api/user/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
