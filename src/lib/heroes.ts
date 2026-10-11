import prisma from "./prisma";
import { DEFAULT_PAGE_HEROES, PageHeroConfig } from "./heroes-types";

/**
 * Retrieves the hero configuration for a specific page with instant fallback defaults
 */
export async function getPageHeroConfig(page: string): Promise<PageHeroConfig> {
  const fallback = DEFAULT_PAGE_HEROES[page] || DEFAULT_PAGE_HEROES.home;

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: `hero_${page}` },
    });

    if (!setting) return fallback;

    const parsed = JSON.parse(setting.value);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}
