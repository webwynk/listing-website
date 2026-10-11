---
name: glambook-guardian
description: Enforces GlamBook development rules, lead privacy (zero client contact info to artists), mobile UX rules, Prisma-to-API consistency, and step-by-step code auditing.
---

# 🛡️ GlamBook Guardian — Quality, Privacy & Consistency Skill

This skill provides an automated guardrail system for developing the **GlamBook** platform. It ensures strict adherence to project business rules, data privacy, mobile responsiveness, and senior-developer standards.

---

## 1. 🔒 Lead Protection & Privacy Guard (CRITICAL)

GlamBook operates on a managed-lead model with **no online payment integration**. The platform monetizes through lead control.

### Strict Data Exposure Rules:

| Role | Access to Client Phone / Email | API Behavior |
|------|--------------------------------|--------------|
| **Admin** | **FULL ACCESS** | Receives all booking details including `user_phone`, `user_email`, `venue_address`, and `notes`. |
| **Artist** | **ZERO ACCESS** (Masked/Omitted) | **MUST NEVER receive `user_phone` or `user_email`**. Only receives `user_name`, `event_type`, `booking_date`, `booking_time`, `service_name`, and general location city. |
| **User** | **SELF ONLY** | Can view their own submitted booking details and artist's public profile info. |

### Code Audit Verification Pattern:
Whenever reviewing or creating an endpoint for artists (e.g. `/api/artist/bookings`):
```typescript
// ✅ CORRECT: Explicit projection or sanitization
const artistBookings = await prisma.booking.findMany({
  where: { artistId },
  select: {
    id: true,
    bookingNumber: true,
    bookingDate: true,
    bookingTime: true,
    eventType: true,
    userName: true,
    status: true,
    service: { select: { name: true, price: true } },
    // ⛔ NEVER include userPhone or userEmail here!
  }
});
```

---

## 2. 📱 Mobile-First UX & Design System Guard

All components and pages must follow the [DESIGN_SYSTEM.md](file:///d:/Download/Listing%20Website/DESIGN_SYSTEM.md) specifications.

### Mandatory Rules:
1. **iOS Auto-Zoom Prevention**:
   - All `<input>`, `<select>`, and `<textarea>` elements must have a font size of at least `16px` on mobile (`< 768px`). Use Tailwind class `text-base md:text-sm`.
2. **Touch Targets**:
   - Every clickable element (buttons, links, icon triggers, tabs) must have a minimum touch target of `44px x 44px` on mobile screens.
3. **Data Tables on Mobile**:
   - Desktop standard tables (`<table>`) must transform into stacked card views on screens `< 768px`. Never allow horizontal table overflow without cards.
4. **Color Palette Compliance**:
   - Primary: `#eb7583`
   - Primary Light: `#fcdadb`
   - Primary Soft: `#fcf1ef`
   - Dark / Text: `#1e1a19`
   - White: `#ffffff`
5. **Typography**:
   - Headings: `Cormorant Garamond` (`font-title`)
   - Body & UI: `DM Sans` (`font-body`)

---

## 3. 🔄 Schema & Cross-Layer Consistency Guard

When writing API routes and components, verify consistency across all three layers:

```
[Prisma Schema Model]  <===>  [Zod Validation Schema]  <===>  [Frontend TypeScript Types]
```

### Checklist:
- **Field Names**: CamelCase in TypeScript (`bookingNumber`, `artistId`), snake_case in raw DB tables (`booking_number`, `artist_id`).
- **ENUM Values**: Strict uppercase matching (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- **Required vs Optional**: If a field is optional in Prisma (`phone?`), it must be optional in Zod (`z.string().optional()`) and frontend types (`phone?: string`).

---

## 4. 🧹 Senior Developer Audit Protocol

Follow this checklist before declaring any file complete:

1. **Dead Code**:
   - Remove unused imports, uncalled helper functions, and commented-out legacy code.
2. **Error Handling**:
   - All async operations must be wrapped in `try/catch` and return standard `ApiResponse<T>` objects with appropriate HTTP status codes.
3. **Logging**:
   - No leftover `console.log` statements in production routes.
4. **Tracking**:
   - Record completed files in [IMPLEMENTATION_RECORD.md](file:///d:/Download/Listing%20Website/IMPLEMENTATION_RECORD.md).
   - Log any bugs or schema corrections in [ERROR_RECORD.md](file:///d:/Download/Listing%20Website/ERROR_RECORD.md).

---

## 5. 🌟 20-Point Modern Web UI/UX Polish Enforcer

Verify that the following polish standards are respected during UI audits:
1. `[ ]` **⌘K Search**: Command palette keyboard integration
2. `[ ]` **↩ Undo Toasts**: Toasts with actionable undo triggers
3. `[ ]` **🔲 Empty States**: Friendly, branded empty views with CTAs
4. `[ ]` **🔲 Skeletons**: Content-matched shimmering placeholders
5. `[ ]` **⇧ Drag & Drop**: Smooth media dropzones and reordering
6. `[ ]` **💾 Autosave**: Background draft autosaving with status label
7. `[ ]` **⚡ Offline Banner**: Network loss detection notification
8. `[ ]` **# Focus Rings**: Visible, accessible brand focus rings
9. `[ ]` **🌙 Dark Accents**: Rich dark `#1e1a19` surfaces for sidebars & chrome
10. `[ ]` **✦ Hover States**: Fluid hover micro-interactions & card lift
11. `[ ]` **☰ Sticky Header**: Blurred glassmorphic header on scroll
12. `[ ]` **↑ Back to Top**: Floating return-to-top button on deep scroll
13. `[ ]` **📋 Copy Buttons**: Instant copy with checkmark confirmation
14. `[ ]` **+ FAQs**: Smooth expandable question accordions
15. `[ ]` **━ Progress Bar**: Multi-step booking and page route indicators
16. `[ ]` **⚠ Confirm Modals**: Two-step confirmations for destructive actions
17. `[ ]` **📅 Updated Dates**: Humanized relative time formatting
18. `[ ]` **💬 Support Float**: Floating direct inquiry/WhatsApp CTA
19. `[ ]` **✓ Success State**: Celebration screens with booking badges
20. `[ ]` **✕ Error State**: Inline field alerts and clear problem descriptions

