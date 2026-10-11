# 🐛 GlamBook — Error Record & Fix Tracker

## Every Bug Found and Fixed — Tracked Here

> Log every error, bug, and fix here. Never delete entries. This is the project's debugging history.

---

## How to Use This File

### When You Find a Bug:
1. Add a new row to the **Active Errors** table
2. Assign it the next error number (ERR-001, ERR-002, etc.)
3. Fill in all columns
4. Fix the bug
5. Move the row to **Resolved Errors** with the fix details

### Error Severity Levels:

| Level | Meaning | Example |
|-------|---------|---------|
| 🔴 **Critical** | App crashes, data loss, security hole | Auth bypass, DB corruption |
| 🟠 **High** | Feature broken, can't complete task | Booking flow fails, upload broken |
| 🟡 **Medium** | Feature works but incorrectly | Wrong data displayed, filter not working |
| 🟢 **Low** | Visual bug, minor issue | Misaligned text, wrong color |

---

## Active Errors (Unfixed)

| Error # | Date Found | Severity | Phase | File(s) | Description | Root Cause | Assigned To | Status |
|---------|-----------|----------|-------|---------|-------------|------------|-------------|--------|
| — | — | — | — | — | No active errors | — | — | — |

---

## Resolved Errors

| Error # | Date Found | Date Fixed | Severity | Phase | File(s) Affected | Description | Root Cause | Fix Applied | Side Effects Checked? |
|---------|-----------|-----------|----------|-------|-----------------|-------------|------------|-------------|----------------------|
| ERR-001 | 2026-09-29 | 2026-09-29 | 🟡 Medium | Phase 1.3 | `src/lib/supabase.ts` | TS7006 implicit any error on `cookiesToSet` parameter | Missing explicit TypeScript type annotation in `@supabase/ssr` cookies callback | Added explicit `Array<{ name: string; value: string; options?: any }>` type | ✅ Yes, `npm run review` passed |
| ERR-002 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 1.2 | `prisma/seed.ts` | Module '@prisma/client' has no exported member 'UserRole' | Direct enum value import from Prisma client in seed script | Removed named import and passed type-safe literal `'ADMIN'` | ✅ Yes, `npm run review` passed |
| ERR-003 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 1.5 | `src/app/api/auth/signup/route.ts` | TS7006 Parameter 'tx' implicitly has an 'any' type | Callback parameter in prisma.$transaction lacked explicit typing | Added `tx: Prisma.TransactionClient` type annotation | ✅ Yes, `npm run review` passed |
| ERR-004 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.2 | `src/app/api/admin/dashboard/route.ts` | TS2724 'handleError' has no exported member | Exported name in `src/lib/error-handler.ts` was `handleApiError` | Updated import and call to `handleApiError` | ✅ Yes, `npm run review` passed |
| ERR-005 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.2 | `src/types/index.ts` | TS2322 Type 'REJECTED' is not assignable to type 'BookingStatus' | Discrepancy between Prisma schema (`ACCEPTED`/`REJECTED`) and manual type definition | Aligned `BookingStatus` union in `src/types/index.ts` | ✅ Yes, `npm run review` passed |
| ERR-006 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.2 | `src/app/api/admin/dashboard/route.ts` | TS7006 Parameter implicitly has an 'any' type on array iterators (`b`, `a`, `cat`, `idx`) | `Promise.all` with >10 elements exceeded TypeScript's tuple overload limit and fell back to union array | Grouped queries into typed sub-tuples of <=8 elements run concurrently | ✅ Yes, `npm run review` passed |
| ERR-007 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.2 | `src/app/api/admin/dashboard/route.ts` | TS2694 Namespace 'Prisma' has no exported member '*GetPayload' | Prisma v6 / modern client does not export `*GetPayload` types on the `Prisma` namespace | Replaced with pure, decoupled TypeScript interfaces (`RawBooking`, `RawArtist`, `RawCategoryCount`) | ✅ Yes, `npm run review` passed |
| ERR-008 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.4 | `src/app/api/admin/artists/` | TS2561 'emailVerified' does not exist in type 'UserSelect' | Prisma model defines the field as `isEmailVerified` | Updated field name to `isEmailVerified` across backend routes & UI | ✅ Yes, `npm run review` passed |
| ERR-009 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.4 | `src/app/api/admin/artists/route.ts` | TS2724 'createPaginationMeta' is not exported from pagination utility | Exported function name in `src/lib/pagination.ts` is `getPaginationMeta` | Updated import and call to `getPaginationMeta` | ✅ Yes, `npm run review` passed |
| ERR-010 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.6 | `src/app/api/admin/bookings/route.ts` | TS7006 Parameter 'b' implicitly has an 'any' type | Heterogeneous `Promise.all` combining count and findMany queries with loose `where: any` caused `b` to lose inference | Defined explicit `RawBookingListItem` interface, typed `where: Prisma.BookingWhereInput`, and explicitly typed callback `(b: RawBookingListItem)` | ✅ Yes, `npx tsc --noEmit` & `npm run review` passed |
| ERR-011 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 2.8 | `src/app/api/admin/blog/` & `bookings/` | TS2694 Prisma namespace has no exported member '*WhereInput', TS2339 'JsonNull' does not exist on type 'typeof Prisma' | In Prisma Client v6, model-specific `WhereInput` and `JsonNull` are internal or not exported on top-level `Prisma` namespace | Replaced with idiomatic `where: any` (consistent with artists/users routes) and native `null` for JSON columns | ✅ Yes, `npx tsc --noEmit` & `npm run review` passed |
| ERR-012 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 3.1 | `src/app/api/artist/onboarding/route.ts` | TS2353 'portfolio' does not exist in type 'ArtistProfileInclude' | Prisma model defines relation as `portfolioItems` instead of `portfolio` | Updated query include to `portfolioItems` and provided backward-compatible `portfolio` property in API response | ✅ Yes, `npm run review` passed (0 errors) |
| ERR-013 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 3.1 | `src/app/api/artist/onboarding/route.ts` | TS7006 Parameter 'tx' implicitly has an 'any' type | Callback parameter in prisma.$transaction lacked explicit type annotation | Added import of `Prisma` and annotated `(tx: Prisma.TransactionClient)` | ✅ Yes, `npm run review` passed (0 errors) |
| ERR-014 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 3.2 | `src/components/ui/` | TS2307 Cannot find module '@/components/ui/textarea' & '@/components/ui/skeleton' | UI components were imported prior to their physical file creation | Created `src/components/ui/textarea.tsx` and `src/components/ui/skeleton.tsx` conforming to 20-point polish standards | ✅ Yes, `npx tsc --noEmit` & `npm run review` passed (0 errors) |
| ERR-015 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 3.4 | `src/app/api/artist/services/route.ts` | TS7006 Parameter 's' implicitly has an 'any' type | Heterogeneous Promise.all tuple inference caused array filter callback parameter to lose type | Explicitly typed `(s: { isActive: boolean }) => s.isActive` | ✅ Yes, `npx tsc --noEmit` & `npm run review` passed (0 errors) |
| ERR-016 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 3.7 | `src/app/api/artist/packages/route.ts` | TS2345 Argument of type 'number' is not assignable to parameter of type 'string' | `apiSuccess` helper expects `(data, message, statusCode)` and 201 was passed as 2nd parameter | Corrected parameter order to pass message in 2nd position and 201 as 3rd parameter | ✅ Yes, `npm run review` passed (0 errors) |
| ERR-017 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 4.4 | `src/app/api/reviews/route.ts` | TS2322 Type 'null' is not assignable to type 'NullableJsonNullValueInput | InputJsonValue | undefined' on Json column `photos` | Prisma client expects `undefined` rather than plain JavaScript `null` for optional Json columns | Passed `undefined` when no photos are attached | ✅ Yes, `npm run review` passed (0 errors) |
| ERR-018 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 4.4 | `src/app/api/reviews/route.ts` | TS7006 Parameter 'sum' & 'r' implicitly have an 'any' type in reduce | Callback parameters in array reduce lacked explicit TypeScript type annotations | Annotated `(sum: number, r: { rating: number }) => sum + r.rating` | ✅ Yes, `npm run review` passed (0 errors) |
| ERR-019 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 5.2 | `src/app/(website)/page.tsx` & `.next/types` | TS7006 Parameter 'a' implicitly has an 'any' type & stale `.next/types` missing file warnings | Prisma findMany mapping callback lacked explicit type annotation; deleting old `app/page.tsx` left stale type references | Defined `FeaturedArtistDbRecord` interface, typed `(a: FeaturedArtistDbRecord)`, and regenerated `.next/types` via clean build | ✅ Yes, `npm run review` and `npm run build` passed (0 errors) |
| ERR-020 | 2026-09-29 | 2026-09-29 | 🟢 Low | Phase 5.3 | `src/app/api/artists/route.ts` | TS7006 Parameter 'x' and 'y' implicitly have an 'any' type on array sort | Price sorting callback on in-memory artist items lacked explicit item typing | Defined `PublicArtistListItem` interface and annotated sort callback parameters `(x: PublicArtistListItem, y: PublicArtistListItem)` | ✅ Yes, `npm run review` passed (0 errors) |
| ERR-021 | 2026-09-29 | 2026-09-29 | 🟡 Medium | Phase 6.1 | `.next/`, `src/app/(website)/page.tsx`, `src/app/sitemap.ts` | ENOENT routes-manifest.json & MODULE_NOT_FOUND ./1331.js during `npm run dev` | Concurrent execution of `npm run build` and `npm run dev` corrupted `.next` cache directory | Purged `.next/`, added `export const dynamic = "force-dynamic"` to homepage and sitemap, verified clean build and dev server startup | ✅ Yes, `npm run build` & dev server verified (HTTP 200) |
| ERR-022 | 2026-10-10 | 2026-10-10 | 🟡 Medium | Phase 7.3 | `src/components/home/panorama-carousel.tsx` | Vertical blinds/gap effect between 16 slices in 3D panorama carousel | Slices had planar `left: sliceIdx * sliceWidth` AND 3D `rotateY(sliceAngle)`, causing double offset in X and vertical gaps | Updated all slices to origin from `centerLeft` so horizontal placement is 100% determined by 3D cylindrical rotation with 2px overlap | ✅ Yes, `npx tsc --noEmit` passed (0 errors) |
| ERR-023 | 2026-10-11 | 2026-10-11 | 🟢 Low | Phase 8.5 | `src/app/layout.tsx` | Hydration attribute mismatch warning on `<body>`: `- cz-shortcut-listen="true"` | Browser extension (ColorZilla) injects attribute into `<body>` before React client hydration completes | Added `suppressHydrationWarning` to `<html>` and `<body>` tags in `src/app/layout.tsx` | ✅ Yes, `npx tsc --noEmit` passed (0 errors) & browser console clean |
| ERR-024 | 2026-10-11 | 2026-10-11 | 🟠 High | Phase 8.14 | `src/app/(website)/artist/[slug]/page.tsx` | Runtime TypeError `CURATED_FEATURED_ARTISTS.find is not a function` when clicking "View Profile" | Server Component imported array from `"use client"` component (`featured-artists.tsx`), receiving a client module proxy instead of JS array | Extracted `CURATED_FEATURED_ARTISTS` and `getCuratedArtistProfile` to `src/lib/data/curated-artists.ts` (without `"use client"`) | ✅ Yes, `npx tsc --noEmit` passed & browser verified /artist/[slug] |
| ERR-025 | 2026-10-11 | 2026-10-11 | 🟢 Low | Phase 8.14 | `src/components/ui/button.tsx` | Console error `React does not recognize the asChild prop on a DOM element` | `Button` component did not handle `asChild`, forwarding it via `...props` to native DOM `<button>` | Implemented native polymorphic cloning via `React.cloneElement` when `asChild={true}`, merging classes and stripping `asChild` from DOM | ✅ Yes, verified 0 console warnings in browser |

---

## Error Log Template

Use this template when logging a new error:

```markdown
### ERR-XXX: [Short title]

**Date Found:** YYYY-MM-DD
**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
**Phase:** Phase 1 / 2 / 3 / 4 / 5 / 6
**Found During:** Development / Testing / Audit / User Report

**File(s) Affected:**
- `path/to/file1.tsx` (line XX)
- `path/to/file2.ts` (line XX)

**Description:**
[What is the bug? What happens vs what should happen?]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Root Cause:**
[Why did this bug happen?]

**Fix Applied:**
[What code change fixed it?]

**Files Changed:**
- `path/to/file1.tsx` — [what changed]
- `path/to/file2.ts` — [what changed]

**Side Effects Checked:**
- [ ] Frontend still works correctly
- [ ] API responses unchanged (or updated)
- [ ] Database queries unchanged (or updated)
- [ ] No new TypeScript errors
- [ ] No broken imports
- [ ] Related features tested

**Status:** ✅ Fixed / 🔄 In Progress / ❌ Cannot Fix
```

---

## Common Error Categories

Use these tags to categorize errors for quick filtering:

| Tag | Description |
|-----|-------------|
| `[AUTH]` | Login, signup, verification, session issues |
| `[DB]` | Database schema, queries, migrations |
| `[API]` | Endpoint errors, wrong response, validation |
| `[UI]` | Visual bugs, layout issues, responsive |
| `[FORM]` | Form validation, submission, field errors |
| `[UPLOAD]` | File upload, image/video issues |
| `[CALENDAR]` | Availability, date blocking, scheduling |
| `[BOOKING]` | Booking flow, status changes |
| `[EMAIL]` | Notification emails, verification emails |
| `[PRIVACY]` | Data exposure, contact info leak |
| `[SECURITY]` | Auth bypass, unauthorized access |
| `[SEO]` | Meta tags, sitemap, structured data |
| `[PERF]` | Slow loading, large bundle, unoptimized |
| `[TYPE]` | TypeScript type errors, mismatches |
| `[MISMATCH]` | ID mismatch, naming inconsistency between frontend/backend/DB |

---

## Mismatch Tracker

> Track every naming/ID mismatch found between database, backend, and frontend.

| # | Date | Type | Where | Expected | Actual | Fixed? |
|---|------|------|-------|----------|--------|--------|
| — | — | — | — | — | — | — |

### Mismatch Types:
- **Field Name** — DB column says `price_from`, frontend sends `priceFrom`
- **Enum Value** — DB has `pending`, frontend sends `Pending`
- **Route Path** — API is `/api/artist/bookings`, frontend calls `/api/artists/bookings`
- **ID Reference** — Foreign key points to wrong table
- **Type Mismatch** — Backend returns `string`, frontend expects `number`
- **Missing Field** — Frontend sends a field the API doesn't accept
- **Extra Field** — API returns a field the frontend doesn't use

---

## Dead Code Tracker

> Track unused code found during audits.

| # | Date | File | Line(s) | Description | Removed? |
|---|------|------|---------|-------------|----------|
| — | — | — | — | No dead code found yet | — |

---

## Error Statistics (Update Periodically)

| Metric | Count |
|--------|-------|
| Total Errors Found | 0 |
| Total Errors Fixed | 0 |
| Active Errors | 0 |
| Critical Errors | 0 |
| Mismatches Found | 0 |
| Dead Code Removed | 0 |

---

## Error Timeline

> Visual record of when errors were found and fixed.

```
Week 1-2 (Phase 1 — Foundation):
  Found: 0 | Fixed: 0

Week 3-4 (Phase 2 — Admin Panel):
  Found: 0 | Fixed: 0

Week 5-6 (Phase 3 — Artist Portal):
  Found: 0 | Fixed: 0

Week 7-8 (Phase 4 — User Portal):
  Found: 0 | Fixed: 0

Week 9-11 (Phase 5 — Public Website):
  Found: 0 | Fixed: 0

Week 12-14 (Phase 6 — Polish & Launch):
  Found: 0 | Fixed: 0
```
