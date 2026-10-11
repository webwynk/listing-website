/**
 * Standard Pagination Helper for API endpoints
 */

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Extracts and sanitizes pagination parameters from a URL or searchParams
 */
export function getPaginationParams(
  urlOrParams: URL | URLSearchParams | string,
  defaultLimit = 10,
  maxLimit = 100
): PaginationParams {
  let searchParams: URLSearchParams;

  if (typeof urlOrParams === "string") {
    const parsed = new URL(urlOrParams, "http://localhost");
    searchParams = parsed.searchParams;
  } else if (urlOrParams instanceof URL) {
    searchParams = urlOrParams.searchParams;
  } else {
    searchParams = urlOrParams;
  }

  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") || String(defaultLimit), 10);

  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = isNaN(rawLimit) || rawLimit < 1 ? defaultLimit : Math.min(rawLimit, maxLimit);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit,
  };
}

/**
 * Constructs pagination metadata for standard API responses
 */
export function getPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
