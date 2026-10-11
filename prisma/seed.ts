import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting GlamBook database seeding...");

  // 1. Seed Super Admin User
  const adminEmail = "admin@glambook.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "GlamBook Super Admin",
        username: "admin",
        role: "ADMIN",
        isEmailVerified: true,
        locationCity: "Mumbai",
        locationState: "Maharashtra",
        locationCountry: "India",
      },
    });
    console.log(`✅ Super Admin created: ${admin.email}`);
  } else {
    console.log(`ℹ️ Super Admin already exists: ${existingAdmin.email}`);
  }

  // 2. Seed Categories & Sub-Categories
  const categoriesData = [
    {
      name: "Makeup Artist",
      slug: "makeup-artist",
      description: "Professional bridal, party, and occasion makeup artists",
      sortOrder: 1,
      subCategories: [
        { name: "Bridal Makeup", slug: "bridal-makeup", sortOrder: 1 },
        { name: "Groom Makeup", slug: "groom-makeup", sortOrder: 2 },
        { name: "Party Makeup", slug: "party-makeup", sortOrder: 3 },
        { name: "Engagement Makeup", slug: "engagement-makeup", sortOrder: 4 },
        { name: "HD / Airbrush Makeup", slug: "hd-airbrush-makeup", sortOrder: 5 },
      ],
    },
    {
      name: "Hair Stylist",
      slug: "hair-stylist",
      description: "Expert bridal hair styling, coloring, and treatments",
      sortOrder: 2,
      subCategories: [
        { name: "Bridal Hair", slug: "bridal-hair", sortOrder: 1 },
        { name: "Hair Coloring", slug: "hair-coloring", sortOrder: 2 },
        { name: "Hair Extensions", slug: "hair-extensions", sortOrder: 3 },
        { name: "Hair Spa", slug: "hair-spa", sortOrder: 4 },
      ],
    },
    {
      name: "Mehndi Artist",
      slug: "mehndi-artist",
      description: "Intricate traditional and contemporary henna designs",
      sortOrder: 3,
      subCategories: [
        { name: "Bridal Mehndi", slug: "bridal-mehndi", sortOrder: 1 },
        { name: "Arabic Mehndi", slug: "arabic-mehndi", sortOrder: 2 },
        { name: "Rajasthani Mehndi", slug: "rajasthani-mehndi", sortOrder: 3 },
        { name: "Minimal Mehndi", slug: "minimal-mehndi", sortOrder: 4 },
      ],
    },
    {
      name: "Nail Artist",
      slug: "nail-artist",
      description: "Creative nail art, gel, acrylic extensions, and manicure",
      sortOrder: 4,
      subCategories: [
        { name: "Nail Art", slug: "nail-art", sortOrder: 1 },
        { name: "Gel / Acrylic Nails", slug: "gel-acrylic-nails", sortOrder: 2 },
        { name: "Bridal Nails", slug: "bridal-nails", sortOrder: 3 },
        { name: "Pedicure & Manicure", slug: "pedicure-manicure", sortOrder: 4 },
      ],
    },
    {
      name: "Beauty & Skin Care",
      slug: "beauty-skin-care",
      description: "Pre-bridal rejuvenation, facials, and skincare treatments",
      sortOrder: 5,
      subCategories: [
        { name: "Facial & Cleanup", slug: "facial-cleanup", sortOrder: 1 },
        { name: "Body Polishing", slug: "body-polishing", sortOrder: 2 },
        { name: "Waxing & Threading", slug: "waxing-threading", sortOrder: 3 },
        { name: "Pre-Bridal Package", slug: "pre-bridal-package", sortOrder: 4 },
      ],
    },
    {
      name: "Photographer",
      slug: "photographer",
      description: "Cinematic wedding photography, pre-wedding shoots, and portraits",
      sortOrder: 6,
      subCategories: [
        { name: "Wedding Photography", slug: "wedding-photography", sortOrder: 1 },
        { name: "Pre-Wedding Shoot", slug: "pre-wedding-shoot", sortOrder: 2 },
        { name: "Bridal Portrait", slug: "bridal-portrait", sortOrder: 3 },
        { name: "Event Photography", slug: "event-photography", sortOrder: 4 },
        { name: "Fashion / Portfolio Shoot", slug: "fashion-portfolio-shoot", sortOrder: 5 },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });

    for (const sub of cat.subCategories) {
      await prisma.subCategory.upsert({
        where: { slug: sub.slug },
        update: {
          name: sub.name,
          sortOrder: sub.sortOrder,
          categoryId: category.id,
        },
        create: {
          name: sub.name,
          slug: sub.slug,
          sortOrder: sub.sortOrder,
          categoryId: category.id,
        },
      });
    }

    console.log(`✅ Seeded category: ${cat.name} with ${cat.subCategories.length} sub-categories`);
  }

  // 3. Seed Default Site Settings
  const defaultSettings = [
    { key: "site_name", value: "GlamBook", group: "general" },
    { key: "site_tagline", value: "Find and book top makeup artists & photographers", group: "general" },
    { key: "contact_email", value: "support@glambook.com", group: "contact" },
    { key: "contact_phone", value: "+91 98765 43210", group: "contact" },
    { key: "lead_privacy_mode", value: "true", group: "security" },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
        group: setting.group,
      },
    });
  }
  console.log(`✅ Seeded ${defaultSettings.length} site settings`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
