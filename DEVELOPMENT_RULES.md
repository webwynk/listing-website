# 🛡️ GlamBook — Development Rules & Code Audit Protocol

## Mandatory Rules for Every Task

---

## Rule 1: Think Like a Senior Developer

- **Never rush.** Slow is smooth, smooth is fast.
- **Read the requirement twice** before writing a single line of code.
- **Ask "why"** before "how". Understand the purpose, not just the task.
- **Think about edge cases** — what can go wrong? What if the data is empty? What if the user does something unexpected?
- **Keep it simple.** Short functions, clear names, no clever tricks.
- **Write code that a junior developer can read and understand.**

---

## Rule 2: Always Plan Before Coding

### Before touching any code, follow this order:

```
Step 1: UNDERSTAND  →  What exactly needs to be done?
Step 2: PLAN        →  How will I do it? What files are involved?
Step 3: EXPLAIN     →  Write the plan in short, simple English.
Step 4: WAIT        →  Get approval before implementing.
Step 5: IMPLEMENT   →  Code it phase by phase, not all at once.
Step 6: VERIFY      →  Double-check everything after coding.
```

### Planning Template (Use Before Every Task)

```markdown
## Task: [What are we building/fixing?]

### What I Understand:
- [Requirement 1]
- [Requirement 2]

### Files I Will Touch:
- [file path 1] — [what changes]
- [file path 2] — [what changes]

### Implementation Steps:
1. [Step 1 — what I do first]
2. [Step 2 — what I do next]
3. [Step 3 — etc.]

### Things to Watch Out For:
- [Potential issue 1]
- [Potential issue 2]

### Status: ⏳ Waiting for Approval
```

> **⚠️ NEVER skip the planning step. NEVER implement without approval.**

---

## Rule 3: Implement Phase by Phase

- **Break every task into small phases.**
- **Implement one phase at a time.**
- **Show the result of each phase before moving to the next.**
- **Never implement the full feature in one go.**

### Phase Implementation Flow:

```
Phase 1: Build the foundation (database/schema/types)
   → Show result → Get approval → Next phase

Phase 2: Build the backend (API routes/logic)
   → Show result → Get approval → Next phase

Phase 3: Build the frontend (UI components/pages)
   → Show result → Get approval → Next phase

Phase 4: Connect everything (integration)
   → Show result → Get approval → Next phase

Phase 5: Test and fix (verify everything works)
   → Show result → Get approval → Done ✅
```

---

## Rule 4: Double-Check Everything Before Submitting

### Checklist — Run This After Every Change:

#### 4.1 Database Checks
- [ ] Are all table names correct and consistent?
- [ ] Are all column names matching what the API expects?
- [ ] Are foreign keys pointing to the right tables?
- [ ] Are ENUM values matching between database, backend, and frontend?
- [ ] Are there any missing columns the frontend needs?
- [ ] Are default values set correctly?
- [ ] Are unique constraints where they should be?
- [ ] Are indexes added for frequently queried columns?

#### 4.2 API / Backend Checks
- [ ] Does the API endpoint path match what the frontend calls?
- [ ] Does the request body schema match what the frontend sends?
- [ ] Does the response schema match what the frontend expects?
- [ ] Are all required fields validated with Zod?
- [ ] Is auth middleware applied to protected routes?
- [ ] Is the correct role guard applied (user/artist/admin)?
- [ ] Are error responses consistent and meaningful?
- [ ] Does the booking API hide user contact info from artist?
- [ ] Does the booking API show full user info to admin?

#### 4.3 Frontend Checks
- [ ] Do all API calls use the correct endpoint URL?
- [ ] Do all API calls send the correct request body?
- [ ] Do all API calls handle the response correctly?
- [ ] Are all form field names matching the API schema?
- [ ] Are all IDs unique across the page?
- [ ] Are all links pointing to the correct routes?
- [ ] Is the UI responsive on mobile/tablet/desktop?
- [ ] Are loading states shown during API calls?
- [ ] Are error states handled and displayed?
- [ ] Are empty states handled (no data)?

#### 4.4 ID & Naming Consistency
- [ ] Are database column names matching Prisma schema?
- [ ] Are Prisma field names matching API response keys?
- [ ] Are API response keys matching frontend variable names?
- [ ] Are route paths consistent (`/api/artist/...` not mixed with `/api/artists/...`)?
- [ ] Are status ENUM values identical everywhere? (e.g., `pending` not `Pending`)
- [ ] Are role names identical everywhere? (e.g., `artist` not `Artist`)

#### 4.5 Function & Logic Checks
- [ ] Are there any duplicate functions doing the same thing?
- [ ] Are there any functions that are defined but never called (dead code)?
- [ ] Are there any conflicting function names?
- [ ] Are there any circular imports?
- [ ] Are there any missing error handlers in try/catch blocks?
- [ ] Are there any hardcoded values that should be environment variables?
- [ ] Are there any console.log statements left in production code?

#### 4.6 Security Checks
- [ ] Can a user access admin routes? (should NOT)
- [ ] Can an artist see user contact info? (should NOT)
- [ ] Can an unauthenticated user access protected routes? (should NOT)
- [ ] Are file uploads validated for type and size?
- [ ] Is user input sanitized before database queries?
- [ ] Are rate limits applied to sensitive endpoints?

---

## Rule 5: Code Audit Protocol — Step by Step

### When to Audit:
- After completing each phase
- After fixing a bug
- Before marking any task as "done"
- When something feels "off"

### How to Audit — File by File:

```
⚠️ AUDIT ONE FILE AT A TIME.
⚠️ WAIT FOR APPROVAL BEFORE AUDITING THE NEXT FILE.
⚠️ NEVER AUDIT ALL FILES AT ONCE.
```

### Audit Checklist Per File:

```markdown
## Audit: [filename]

### 1. Purpose
- [ ] Is this file necessary? Does it serve a clear purpose?
- [ ] Is the file in the correct directory?

### 2. Imports
- [ ] Are all imports used? (no unused imports)
- [ ] Are imports from correct paths?
- [ ] Are there any missing imports?

### 3. Types & Interfaces
- [ ] Do types match the database schema?
- [ ] Do types match the API contract?
- [ ] Are there any `any` types that should be specific?

### 4. Functions & Logic
- [ ] Does each function do ONE thing?
- [ ] Are function names clear and descriptive?
- [ ] Are there any dead/unused functions?
- [ ] Are edge cases handled?
- [ ] Are errors caught and handled?

### 5. API Calls (Frontend) / Database Queries (Backend)
- [ ] Correct endpoint/query?
- [ ] Correct request/response shape?
- [ ] Error handling present?
- [ ] Loading states handled?

### 6. IDs & Keys
- [ ] All element IDs unique?
- [ ] All React keys unique and stable?
- [ ] No duplicate keys?

### 7. Consistency
- [ ] Naming conventions followed?
- [ ] Code style matches rest of project?
- [ ] No conflicting patterns?

### 8. Dead Code
- [ ] No commented-out code left
- [ ] No unused variables
- [ ] No unreachable code

### 9. Security
- [ ] Auth check present (if needed)?
- [ ] Role guard present (if needed)?
- [ ] Input validation present (if needed)?
- [ ] Data privacy respected (artist can't see user contact)?

### Status: ✅ Clean / ⚠️ Issues Found / ❌ Needs Fix
### Issues Found:
1. [Issue description + line number]
2. [Issue description + line number]

### Waiting for approval to audit next file: [next filename]
```

---

## Rule 6: After Every Fix — Re-Verify

### After fixing any bug or issue:

1. **Re-read the original requirement** — does the fix actually solve it?
2. **Check the fix didn't break something else** — test related features
3. **Check for mismatches:**
   - Did the fix change an API response? → Update frontend too
   - Did the fix change a database column? → Update Prisma schema + API + frontend
   - Did the fix change a route? → Update all links/redirects
   - Did the fix change an ENUM? → Update everywhere (DB, backend, frontend)
4. **Run the full checklist (Rule 4) again for affected files**
5. **Record the fix in the Error Record file**

---

## Rule 7: Communication Style

- **Use short, simple English.**
- **Explain what you're doing in 2-3 sentences before doing it.**
- **Show, don't tell** — provide code snippets, not long descriptions.
- **When in doubt, ask.** Don't assume.
- **When reporting issues, be specific:**
  - ❌ Bad: "There's an error in the API"
  - ✅ Good: "The `/api/bookings` POST endpoint returns 500 because `service_id` is missing from the request body validation"

---

## Rule 8: Never Leave Loose Ends

Before marking any task as complete:

- [ ] All planned features implemented?
- [ ] All files saved?
- [ ] No TODO comments left unresolved?
- [ ] No placeholder text left? (e.g., "Lorem ipsum", "TODO", "FIXME")
- [ ] No hardcoded test data left?
- [ ] No console.log left?
- [ ] Implementation Record updated?
- [ ] Error Record updated (if any bugs were fixed)?
- [ ] All affected files audited?

---

## Rule 9: The 20-Point Modern Web UI/UX Polish Standard

Every user-facing page, portal, and component must adhere to these 20 UI/UX quality standards:

1. **⌘K Search**: Keyboard-shortcut driven instant search palette for artists, categories, packages, and portal records.
2. **↩ Undo Toasts**: Actionable toast notifications allowing users to undo actions (e.g., deleted item, unfavorited artist).
3. **🔲 Empty States**: Beautiful, branded zero-data states with helpful illustrations and clear CTA buttons.
4. **🔲 Skeletons**: Content-matched shimmering placeholders for all loading states — zero layout shift.
5. **⇧ Drag & Drop**: Smooth drag-and-drop file uploaders and portfolio media reordering for artists.
6. **💾 Autosave**: Background saving with subtle "Draft saved" indicators on forms and profile editors.
7. **⚡ Offline Banner**: Non-intrusive notification alerting users when network connection drops.
8. **# Focus Rings**: High-visibility, brand-tailored focus rings (`#eb7583` / `#fcdadb`) for full keyboard accessibility.
9. **🌙 Dark Mode / Dark Accents**: Rich, high-contrast dark surfaces using `#1e1a19` for sidebars and headers.
10. **✦ Hover States**: Fluid hover micro-interactions, subtle elevation, and smooth transitions on all interactive elements.
11. **☰ Sticky Header**: Glassmorphic sticky navbar with backdrop blur and delicate bottom border on scroll.
12. **↑ Back to Top**: Floating smooth-scroll button appearing dynamically after scrolling 400px down.
13. **📋 Copy Buttons**: 1-click copy with instant visual checkmark confirmation for booking IDs and profile links.
14. **+ FAQs**: Smooth expandable accordions for frequently asked questions on informational pages.
15. **━ Progress Bar**: Multi-step booking request tracker and top-of-page navigation loading bar.
16. **⚠ Confirm Modals**: Modal alerts preventing accidental destructive actions (cancellations, deletions).
17. **📅 Updated Dates**: Contextual, human-friendly timestamps (*"Updated 2 hours ago"*, *"Joined Sept 2026"*).
18. **💬 Support Float**: Floating inquiry/WhatsApp support trigger available on public website pages.
19. **✓ Success State**: Celebration screens, green confirmation badges, and clear next steps upon submission.
20. **✕ Error State**: Real-time inline field validation, red borders, and clear, human-readable error messages.

---

## Quick Reference Card

```
┌────────────────────────────────────────┐
│          DEVELOPMENT FLOW              │
│                                        │
│  1. READ requirement twice             │
│  2. PLAN in simple English             │
│  3. WAIT for approval                  │
│  4. IMPLEMENT phase by phase           │
│  5. DOUBLE-CHECK with checklist        │
│  6. ENFORCE 20-Point UI/UX Polish      │
│  7. AUDIT file by file                 │
│  8. RECORD what was done              │
│  9. VERIFY no loose ends              │
│                                        │
│  ⚠️  Never skip steps                 │
│  ⚠️  Never implement without approval │
│  ⚠️  Never audit all files at once    │
│  ⚠️  Never assume — ask              │
└────────────────────────────────────────┘
```

