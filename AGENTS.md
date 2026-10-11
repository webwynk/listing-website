# GlamBook Coding & Review Agent Protocol

This file defines the mandatory behaviors, code review requirements, and operational rules for any AI agent working on GlamBook.

## 1. Prime Directives

1. **Plan Before Implementation**: Always propose a detailed step-by-step plan using the template in `DEVELOPMENT_RULES.md` and wait for explicit user approval before writing code.
2. **Phase by Phase**: Build features in small, testable chunks. Never implement an entire phase in a single step.
3. **Double-Check Everything**: Run type checks, lint checks, and schema verifications after every change.
4. **Lead Privacy Guarantee**: Never expose client contact details (`phone`, `email`) in artist queries or interfaces. Full lead data is restricted to Admin only.
5. **20-Point UI/UX Polish Standard**: Enforce the 20-Point Modern Web UI/UX Polish Standard on all UI components and pages.
6. **File-by-File Review**: Conduct code reviews on a single file at a time. Never batch audit multiple files at once.
7. **Record Keeping**: Immediately update `IMPLEMENTATION_RECORD.md` when a file/feature is verified. Log any fixed issues in `ERROR_RECORD.md`.

## 2. Active Custom Skills & gstack Virtual Engineering Team

### GlamBook Core Skills:
- `glambook-guardian`: Enforces lead privacy (zero client contact info to artists), mobile UX rules, Prisma-to-API consistency.
- `code-review-agent`: Conducts line-by-line security, quality, and dead code audits.

### gstack Virtual Engineering Skills (by Garry Tan / Y Combinator):
- `plan-ceo-review`: Strategic product challenge & feature scoping.
- `plan-eng-review`: Technical architecture, scale, and schema verification.
- `plan-design-review`: Senior designer UX review & 20-point polish auditing.
- `cso`: Chief Security Officer security audit (OWASP, data privacy, auth).
- `qa` / `qa-only`: Comprehensive quality assurance & testing lead.
- `design-review` / `design-html`: UI design anti-pattern removal & prototyping.
- `office-hours`: Product pressure-testing and strategic prioritization.
- `ship`: Release checklist, branch hygiene, and deployment sign-off.
- `investigate`: Root cause bug analysis & remediation.

### Vercel Performance & Engineering Skills (by Vercel Labs):
- `vercel-react-best-practices`: 70 official rules across 8 performance tiers (eliminating async waterfalls, bundle optimization, server/client rendering balance, React 19 / Next.js 15 caching).
- `vercel-composition-patterns`: Component composition, inversion of control, slot patterns, and clean React architecture.

### UI/UX Pro Max Design Intelligence (by NextLevelBuilder):
- `ui-ux-pro-max`: Design intelligence system with 79 styles, 192 product palettes, 74 font pairings, 119 UX guidelines, and 22 technology stack profiles.
- `design-system`: Three-layer design token architecture (primitive → semantic → component) and CSS variable systems.
- `ui-styling`: Advanced layout, spacing, and micro-interaction specifications.

## 3. Technology Stack Reference

- Framework: Next.js 15 (App Router), React 19, TypeScript
- Styling: Tailwind CSS v4, custom brand CSS variables
- Database & ORM: PostgreSQL via Supabase, Prisma ORM
- Auth: Supabase Auth (Email + Password only, email verification link)
- UI Library: Custom shadcn/ui components
- Fonts: Cormorant Garamond (headings), DM Sans (body)
