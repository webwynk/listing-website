# 🎨 GlamBook — Design System & UI Guidelines

## Branding, Colors, Typography, Responsive Design & Component Specs

---

## 1. Brand Colors

### 1.1 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#eb7583` | Buttons, links, active states, highlights, CTA |
| **Primary Light** | `#fcdadb` | Hover backgrounds, selected states, badges, tags |
| **Primary Soft** | `#fcf1ef` | Page backgrounds, card backgrounds, section fills |
| **Dark** | `#1e1a19` | Headings, body text, sidebar, dark sections |
| **White** | `#ffffff` | Card backgrounds, page backgrounds, text on dark |

### 1.2 Extended Palette (Derived)

| Name | Hex | Usage |
|------|-----|-------|
| **Primary Hover** | `#d4616f` | Button hover state (darken primary 10%) |
| **Primary Active** | `#c24e5c` | Button active/pressed state (darken 15%) |
| **Primary 10%** | `#eb758315` | Subtle background tints |
| **Gray 50** | `#faf9f8` | Lightest background |
| **Gray 100** | `#f5f3f2` | Input backgrounds, dividers |
| **Gray 200** | `#e8e5e4` | Borders, separators |
| **Gray 300** | `#d1cdcc` | Disabled text, placeholder |
| **Gray 400** | `#a09b9a` | Secondary text, captions |
| **Gray 500** | `#6e6968` | Muted text |
| **Gray 600** | `#4a4544` | Body text alternative |
| **Gray 700** | `#332e2d` | Strong text |
| **Gray 800** | `#1e1a19` | Same as Dark — headings |
| **Success** | `#22c55e` | Available, approved, completed |
| **Success Light** | `#dcfce7` | Success background |
| **Warning** | `#f59e0b` | Pending, attention |
| **Warning Light** | `#fef3c7` | Warning background |
| **Error** | `#ef4444` | Rejected, errors, required |
| **Error Light** | `#fee2e2` | Error background |
| **Info** | `#3b82f6` | Information, links |
| **Info Light** | `#dbeafe` | Info background |

### 1.3 CSS Variables

```css
:root {
  /* Brand Colors */
  --color-primary: #eb7583;
  --color-primary-light: #fcdadb;
  --color-primary-soft: #fcf1ef;
  --color-primary-hover: #d4616f;
  --color-primary-active: #c24e5c;
  --color-dark: #1e1a19;
  --color-white: #ffffff;

  /* Gray Scale */
  --color-gray-50: #faf9f8;
  --color-gray-100: #f5f3f2;
  --color-gray-200: #e8e5e4;
  --color-gray-300: #d1cdcc;
  --color-gray-400: #a09b9a;
  --color-gray-500: #6e6968;
  --color-gray-600: #4a4544;
  --color-gray-700: #332e2d;
  --color-gray-800: #1e1a19;

  /* Status Colors */
  --color-success: #22c55e;
  --color-success-light: #dcfce7;
  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  --color-error: #ef4444;
  --color-error-light: #fee2e2;
  --color-info: #3b82f6;
  --color-info-light: #dbeafe;
}
```

### 1.4 Color Usage Rules

| Element | Color | Text On It |
|---------|-------|-----------|
| **Primary Button** | `#eb7583` fill | White text |
| **Secondary Button** | `#fcdadb` fill | `#1e1a19` text |
| **Ghost Button** | Transparent, `#eb7583` border | `#eb7583` text |
| **Page Background (Website)** | `#ffffff` or `#fcf1ef` | — |
| **Page Background (Portal)** | `#faf9f8` | — |
| **Card Background** | `#ffffff` | — |
| **Sidebar (Admin/Artist)** | `#1e1a19` | White text |
| **Header/Navbar** | `#ffffff` with border-bottom | `#1e1a19` text |
| **Footer** | `#1e1a19` | White text |
| **Active Nav Link** | `#eb7583` text | — |
| **Hover State** | `#fcf1ef` background | — |
| **Selected/Active Tab** | `#eb7583` underline | `#1e1a19` text |
| **Badge (Featured)** | `#eb7583` fill | White text |
| **Badge (Verified)** | `#22c55e` fill | White text |
| **Status: Pending** | `#f59e0b` fill | White text |
| **Status: Approved/Available** | `#22c55e` fill | White text |
| **Status: Rejected** | `#ef4444` fill | White text |
| **Status: Completed** | `#3b82f6` fill | White text |
| **Star Rating** | `#f59e0b` fill | — |
| **Heart/Favorite** | `#eb7583` fill (active) | — |

---

## 2. Typography

### 2.1 Font Families

| Role | Font | Google Fonts URL | Weight |
|------|------|-----------------|--------|
| **Title / Headings** | **Cormorant Garamond** | `fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700` | 400, 500, 600, 700 |
| **Body / UI** | **DM Sans** | `fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700` | 300, 400, 500, 600, 700 |

### 2.2 CSS Font Setup

```css
/* Import in layout.tsx or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

:root {
  --font-title: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  font-family: var(--font-body);
  color: var(--color-dark);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-title);
}
```

### 2.3 Font Size Scale

#### Desktop (1025px+)

| Element | Size | Weight | Line Height | Letter Spacing | Font |
|---------|------|--------|-------------|---------------|------|
| **Display / Hero Title** | 56px (3.5rem) | 700 | 1.1 | -0.02em | Cormorant Garamond |
| **H1 — Page Title** | 40px (2.5rem) | 700 | 1.2 | -0.01em | Cormorant Garamond |
| **H2 — Section Title** | 32px (2rem) | 600 | 1.25 | -0.01em | Cormorant Garamond |
| **H3 — Card Title / Subsection** | 24px (1.5rem) | 600 | 1.3 | 0 | Cormorant Garamond |
| **H4 — Small Heading** | 20px (1.25rem) | 600 | 1.35 | 0 | Cormorant Garamond |
| **H5 — Label Heading** | 18px (1.125rem) | 600 | 1.4 | 0 | DM Sans |
| **H6 — Tiny Heading** | 16px (1rem) | 600 | 1.4 | 0 | DM Sans |
| **Body Large** | 18px (1.125rem) | 400 | 1.6 | 0 | DM Sans |
| **Body Regular** | 16px (1rem) | 400 | 1.6 | 0 | DM Sans |
| **Body Small** | 14px (0.875rem) | 400 | 1.5 | 0 | DM Sans |
| **Caption** | 12px (0.75rem) | 400 | 1.4 | 0.01em | DM Sans |
| **Overline / Tag** | 11px (0.6875rem) | 600 | 1.4 | 0.08em | DM Sans |
| **Button Large** | 16px (1rem) | 600 | 1 | 0.02em | DM Sans |
| **Button Regular** | 14px (0.875rem) | 600 | 1 | 0.02em | DM Sans |
| **Button Small** | 12px (0.75rem) | 600 | 1 | 0.02em | DM Sans |
| **Input Text** | 14px (0.875rem) | 400 | 1.5 | 0 | DM Sans |
| **Input Label** | 14px (0.875rem) | 500 | 1.4 | 0 | DM Sans |
| **Input Placeholder** | 14px (0.875rem) | 400 | 1.5 | 0 | DM Sans |
| **Table Header** | 12px (0.75rem) | 600 | 1.4 | 0.05em | DM Sans |
| **Table Cell** | 14px (0.875rem) | 400 | 1.5 | 0 | DM Sans |
| **Nav Link** | 15px (0.9375rem) | 500 | 1 | 0.01em | DM Sans |
| **Footer Text** | 14px (0.875rem) | 400 | 1.6 | 0 | DM Sans |
| **Badge** | 11px (0.6875rem) | 600 | 1 | 0.03em | DM Sans |
| **Stat Number** | 36px (2.25rem) | 700 | 1.1 | 0 | Cormorant Garamond |

#### Tablet (769px – 1024px)

| Element | Size | Notes |
|---------|------|-------|
| Display / Hero Title | 44px (2.75rem) | Scale down 20% |
| H1 | 34px (2.125rem) | |
| H2 | 28px (1.75rem) | |
| H3 | 22px (1.375rem) | |
| H4 | 18px (1.125rem) | |
| Body Regular | 15px (0.9375rem) | |
| Body Small | 13px (0.8125rem) | |
| Everything else | Same as desktop | |

#### Mobile (320px – 768px)

| Element | Size | Notes |
|---------|------|-------|
| Display / Hero Title | 32px (2rem) | Scale down 40% |
| H1 | 28px (1.75rem) | |
| H2 | 24px (1.5rem) | |
| H3 | 20px (1.25rem) | |
| H4 | 17px (1.0625rem) | |
| Body Regular | 15px (0.9375rem) | Slightly smaller |
| Body Small | 13px (0.8125rem) | |
| Nav Link | 16px (1rem) | Bigger for touch |
| Button | 15px (0.9375rem) | Bigger for touch |
| Input Text | 16px (1rem) | **16px minimum to prevent iOS zoom** |
| Table Header | 11px (0.6875rem) | |
| Table Cell | 13px (0.8125rem) | |

> **⚠️ CRITICAL:** Input font size MUST be 16px on mobile. iOS Safari auto-zooms the page if input font is smaller than 16px.

---

## 3. Spacing System

### 3.1 Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | — |
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Small gaps, tag padding |
| `--space-3` | 12px | Input padding, card inner spacing |
| `--space-4` | 16px | Standard padding, gap between elements |
| `--space-5` | 20px | Medium padding |
| `--space-6` | 24px | Card padding, section inner spacing |
| `--space-8` | 32px | Section gaps |
| `--space-10` | 40px | Large section gaps |
| `--space-12` | 48px | Section margins |
| `--space-16` | 64px | Page section spacing (desktop) |
| `--space-20` | 80px | Major section spacing (desktop) |
| `--space-24` | 96px | Hero padding (desktop) |

### 3.2 Responsive Section Spacing

| Section Gap | Desktop | Tablet | Mobile |
|-------------|---------|--------|--------|
| Between page sections (Home) | 80px | 60px | 40px |
| Between cards in grid | 24px | 20px | 16px |
| Card inner padding | 24px | 20px | 16px |
| Page horizontal padding | 80px (max 1280px centered) | 40px | 16px |
| Header height | 72px | 64px | 56px |
| Footer padding | 64px top/bottom | 48px | 32px |

---

## 4. Responsive Breakpoints

### 4.1 Breakpoint Values

```css
/* Tailwind-compatible breakpoints */
--breakpoint-sm: 640px;    /* Small mobile → large mobile */
--breakpoint-md: 768px;    /* Mobile → Tablet */
--breakpoint-lg: 1024px;   /* Tablet → Desktop */
--breakpoint-xl: 1280px;   /* Desktop → Large desktop */
--breakpoint-2xl: 1440px;  /* Large desktop → Ultra wide */
```

### 4.2 Grid Columns per Breakpoint

| Component | Mobile (< 640px) | Mobile L (640-767px) | Tablet (768-1023px) | Desktop (1024-1279px) | Large (1280px+) |
|-----------|-----------------|---------------------|--------------------|--------------------|----------------|
| **Artist Cards (Find Artist)** | 1 col | 2 col | 2 col | 3 col | 3 col |
| **Category Cards (Home)** | 2 col | 3 col | 3 col | 4 col | 6 col |
| **Featured Artists Carousel** | 1.2 visible | 2 visible | 3 visible | 4 visible | 4 visible |
| **Blog Cards** | 1 col | 2 col | 2 col | 3 col | 3 col |
| **Package Cards** | 1 col | 2 col | 2 col | 3 col | 3 col |
| **Stats Bar** | 2x2 grid | 4 col | 4 col | 4 col | 4 col |
| **Portfolio Gallery** | 2 col | 2 col | 3 col | 3 col | 4 col |
| **How It Works Steps** | 1 col (vertical) | 2 col | 4 col | 4 col | 4 col |
| **Testimonials** | 1 visible | 1 visible | 2 visible | 3 visible | 3 visible |

### 4.3 Layout Changes per Breakpoint

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Navbar** | Hamburger + slide-out drawer | Full nav, compact | Full nav, spacious |
| **Hero Search** | Stacked vertical (full-width inputs) | 2 inputs per row | Single row, all inline |
| **Find Artist Filters** | Collapsible drawer (button to open) | Sidebar left | Horizontal bar at top |
| **Artist Profile** | Single column, stacked | Two columns where appropriate | Full layout |
| **Footer** | Single column, stacked | 2 column | 4 column |
| **Admin Sidebar** | Hidden, hamburger overlay | Collapsed icons only (60px) | Full sidebar (260px) |
| **Admin Tables** | Card view (each row = card) | Horizontal scroll | Full table |
| **Calendar** | Compact month view, swipeable | Full month view | Full month view |
| **Booking Modal** | Full-screen bottom sheet | Centered modal (70% width) | Centered modal (500px) |

---

## 5. Component Specs

### 5.1 Buttons

| Variant | Desktop | Mobile |
|---------|---------|--------|
| **Primary** | Height: 44px, Padding: 16px 24px, Radius: 8px, Font: 14px 600, BG: `#eb7583`, Text: white | Height: 48px, Padding: 16px 20px, Font: 15px, **Full-width** on forms |
| **Secondary** | Same size, BG: `#fcdadb`, Text: `#1e1a19` | Same |
| **Ghost/Outline** | Same size, BG: transparent, Border: 1px `#eb7583`, Text: `#eb7583` | Same |
| **Small** | Height: 36px, Padding: 8px 16px, Font: 12px 600 | Height: 40px |
| **Large** | Height: 52px, Padding: 16px 32px, Font: 16px 600 | Height: 52px, Full-width |
| **Icon Button** | 40px × 40px, Radius: 8px | 44px × 44px (bigger touch target) |

**Hover:** Darken background 10% + subtle shadow  
**Active:** Darken 15% + scale(0.98)  
**Disabled:** Opacity 0.5, cursor not-allowed  
**Focus:** 2px `#eb7583` outline offset 2px  

### 5.2 Form Inputs

| Property | Desktop | Mobile |
|----------|---------|--------|
| **Height** | 44px | 48px |
| **Font Size** | 14px | **16px** (prevents iOS zoom) |
| **Padding** | 12px 16px | 12px 16px |
| **Border** | 1px solid `#e8e5e4` | Same |
| **Border Radius** | 8px | 8px |
| **Focus Border** | 1px solid `#eb7583` | Same |
| **Focus Shadow** | 0 0 0 3px `#eb758320` | Same |
| **Label** | 14px 500, margin-bottom 6px | Same |
| **Error Text** | 12px 400, color `#ef4444`, margin-top 4px | Same |
| **Placeholder** | Color `#a09b9a` | Same |
| **Disabled** | BG `#f5f3f2`, opacity 0.7 | Same |
| **Gap between fields** | 20px | 16px |

### 5.3 Cards

| Property | Desktop | Mobile |
|----------|---------|--------|
| **Background** | `#ffffff` | Same |
| **Border** | 1px solid `#e8e5e4` | Same |
| **Border Radius** | 12px | 10px |
| **Padding** | 24px | 16px |
| **Shadow** | `0 1px 3px rgba(30,26,25,0.06)` | Same |
| **Hover Shadow** | `0 4px 12px rgba(30,26,25,0.1)` | None (no hover on mobile) |
| **Hover Transform** | `translateY(-2px)` | None |
| **Transition** | `all 0.2s ease` | None |
| **Image Radius** | 10px (top corners if full-width) | 8px |

### 5.4 Badges & Tags

| Type | Style |
|------|-------|
| **Status Badge** | Padding: 4px 10px, Radius: 20px (pill), Font: 11px 600 uppercase, Specific color per status |
| **Category Tag** | Padding: 4px 12px, Radius: 6px, BG: `#fcf1ef`, Text: `#eb7583`, Font: 12px 500 |
| **Featured Badge** | BG: `#eb7583`, Text: white |
| **Verified Badge** | BG: `#22c55e`, Text: white |

### 5.5 Avatars

| Size | Dimensions | Usage |
|------|-----------|-------|
| **XS** | 24px × 24px | Inline mentions, comment avatars |
| **SM** | 32px × 32px | Table rows, small cards |
| **MD** | 40px × 40px | Header user avatar, list items |
| **LG** | 64px × 64px | Profile cards, booking cards |
| **XL** | 96px × 96px | Artist profile header |
| **2XL** | 128px × 128px | User/Artist profile page hero |

All avatars: `border-radius: 50%`, `object-fit: cover`, `border: 2px solid #e8e5e4`

---

## 6. Tables

### 6.1 Desktop Table (1024px+)

```
┌───────────────────────────────────────────────────────────────┐
│  Header Cell      Header Cell       Header Cell       Actions │  ← BG: #faf9f8, Font: 12px 600 uppercase, Color: #6e6968
├───────────────────────────────────────────────────────────────┤
│  Cell Content     Cell Content      Cell Content      [Edit]  │  ← BG: #ffffff, Font: 14px 400, Color: #1e1a19
├───────────────────────────────────────────────────────────────┤
│  Cell Content     Cell Content      Cell Content      [Edit]  │  ← Alternate: BG #faf9f8 (striped)
├───────────────────────────────────────────────────────────────┤
│  Cell Content     Cell Content      Cell Content      [Edit]  │
└───────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Header BG** | `#faf9f8` |
| **Header Font** | 12px, 600, uppercase, `#6e6968`, letter-spacing 0.05em |
| **Header Padding** | 12px 16px |
| **Row BG** | Alternating `#ffffff` / `#faf9f8` |
| **Row Border** | Bottom: 1px solid `#e8e5e4` |
| **Row Padding** | 14px 16px |
| **Row Hover** | BG: `#fcf1ef` |
| **Cell Font** | 14px, 400, `#1e1a19` |
| **Border Radius** | 8px on table container |
| **Shadow** | `0 1px 3px rgba(30,26,25,0.06)` on container |
| **Action Buttons** | Small ghost buttons or icon buttons |

### 6.2 Tablet Table (768px – 1023px)

- Same as desktop but with **horizontal scroll** if columns exceed viewport
- Wrap in container with `overflow-x: auto`
- First column (Name) **sticky left** with shadow indicator
- Show scroll hint gradient on right edge

### 6.3 Mobile Table (< 768px) — Card View

Each table row becomes a **card**:

```
┌─────────────────────────────┐
│  👤 Priya Sharma             │  ← Name (bold, 15px)
│  📧 priya@email.com          │  ← Secondary info
│  📍 Mumbai                   │
│  ⭐ 4.8 (120 reviews)       │
│  Status: [🟢 Approved]       │  ← Status badge
│  Joined: Oct 15, 2026        │
│  ──────────────────────────  │
│  [View]  [Edit]  [⋯ More]   │  ← Action buttons
└─────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Card Gap** | 12px between cards |
| **Card Padding** | 16px |
| **Label** | 12px, 500, `#6e6968` |
| **Value** | 14px, 400, `#1e1a19` |
| **Actions** | Bottom of card, separated by border-top |

---

## 7. Pagination

### 7.1 Desktop Pagination

```
← Previous   1   2   [3]   4   5   ...   12   Next →
```

| Property | Value |
|----------|-------|
| **Container** | Flex, centered, gap 4px, margin-top 32px |
| **Page Button** | 40px × 40px, radius 8px, font 14px 500 |
| **Active Page** | BG `#eb7583`, text white |
| **Inactive Page** | BG transparent, text `#4a4544`, hover BG `#fcf1ef` |
| **Prev/Next** | Text buttons with arrow icons, font 14px 500, color `#eb7583` |
| **Disabled** | Opacity 0.4, cursor default |
| **Ellipsis** | "..." text, not clickable |
| **Items Per Page** | Dropdown on right: "Show 10 / 20 / 50 per page" |
| **Results Count** | Left-aligned: "Showing 21-30 of 156 results", font 14px, color `#6e6968` |

### 7.2 Tablet Pagination

Same as desktop but:
- Hide page numbers, keep only: ← Previous | Page 3 of 12 | Next →
- OR show max 5 page numbers

### 7.3 Mobile Pagination

**Option A: Load More Button** (for public website listings)

```
┌─────────────────────────────┐
│     [Load More Artists]      │  ← Secondary button, full-width
│   Showing 20 of 156         │  ← Caption text below
└─────────────────────────────┘
```

**Option B: Compact Pagination** (for portal tables)

```
┌─────────────────────────────┐
│  ← Prev    Page 3/12    Next → │
└─────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Container** | Flex, space-between, full-width |
| **Prev/Next** | 44px height buttons (touch-friendly) |
| **Page Indicator** | Center-aligned text, 14px |

### 7.4 Where Pagination Is Used

| Page | Type | Items Per Page |
|------|------|---------------|
| **Find Artist** (website) | Load More button (mobile) / Page numbers (desktop) | 20 |
| **Blog Listing** (website) | Page numbers | 9 |
| **Admin — Artists List** | Page numbers + items per page selector | 20 |
| **Admin — Users List** | Page numbers + items per page selector | 20 |
| **Admin — Bookings List** | Page numbers + items per page selector | 20 |
| **Admin — Blog List** | Page numbers | 10 |
| **Admin — Reviews List** | Page numbers | 20 |
| **Admin — Contact Submissions** | Page numbers | 20 |
| **Artist — Booking Requests** | Page numbers | 10 |
| **Artist — Reviews** | Load More button | 10 |
| **User — My Bookings** | Page numbers | 10 |
| **User — Notifications** | Load More button | 20 |
| **Artist Profile — Reviews** | Load More button | 5 |
| **Artist Profile — Portfolio** | Load More button or "View All" | 12 (initial) |

---

## 8. Charts & Data Visualization

### 8.1 Bar Charts

#### Vertical Bar Chart (Default for dashboards)

| Property | Value |
|----------|-------|
| **Library** | Recharts or Chart.js |
| **Bar Color** | `#eb7583` (primary) |
| **Bar Hover** | `#d4616f` |
| **Second Bar** (if comparison) | `#fcdadb` |
| **Bar Radius** | 4px top corners |
| **Bar Width** | Desktop: 32px, Tablet: 24px, Mobile: 16px |
| **Grid Lines** | Horizontal only, `#e8e5e4`, dashed |
| **Axis Labels** | Font: 12px DM Sans, Color: `#6e6968` |
| **Axis Line** | `#e8e5e4` |
| **Tooltip BG** | `#1e1a19`, text white, radius 6px, padding 8px 12px |
| **Container Height** | Desktop: 300px, Mobile: 200px |
| **Responsive** | Reduce bar count on mobile, show scroll or summarize |

**Usage:** Bookings per month, signups per week, revenue per category

#### Horizontal Bar Chart (For comparisons)

| Property | Value |
|----------|-------|
| **Same styling as vertical** | — |
| **Bar Height** | 28px |
| **Labels** | Left-aligned before each bar |
| **Container Height** | Auto (depends on number of bars) |

**Usage:** Bookings by category, artists by city, rating distribution

### 8.2 Line Charts

| Property | Value |
|----------|-------|
| **Line Color** | `#eb7583` |
| **Line Width** | 2px |
| **Point** | 4px circle, filled `#eb7583` |
| **Point Hover** | 6px circle |
| **Fill Area** | Gradient from `#eb758320` to transparent |
| **Grid Lines** | Horizontal only, `#e8e5e4` |
| **Container Height** | Desktop: 300px, Mobile: 200px |

**Usage:** Booking trends, profile views over time

### 8.3 Pie / Donut Charts

| Property | Value |
|----------|-------|
| **Colors** | `#eb7583`, `#fcdadb`, `#1e1a19`, `#a09b9a`, `#22c55e`, `#f59e0b` |
| **Inner Radius** (donut) | 60% |
| **Center Text** (donut) | Total number, font: 24px 700 Cormorant Garamond |
| **Labels** | Legend below chart on mobile, right side on desktop |
| **Container Size** | Desktop: 250px × 250px, Mobile: 200px × 200px |

**Usage:** Bookings by category (pie), booking status distribution (donut)

### 8.4 Stats Cards

```
┌──────────────────┐
│  📊              │
│  156             │  ← Number: 36px Cormorant Garamond 700, color: #1e1a19
│  Total Artists    │  ← Label: 14px DM Sans 400, color: #6e6968
│  ↑ 12% vs last  │  ← Trend: 12px DM Sans 500, color: #22c55e (up) or #ef4444 (down)
└──────────────────┘
```

| Property | Desktop | Mobile |
|----------|---------|--------|
| **Layout** | 4 cards in row | 2×2 grid |
| **Card Padding** | 24px | 16px |
| **Number Font** | 36px | 28px |
| **Icon** | 40px × 40px, BG `#fcf1ef`, color `#eb7583` | 32px × 32px |

### 8.5 Rating Distribution Bar

For artist profile reviews section:

```
5 ★ ████████████████████░░░  78%
4 ★ ██████░░░░░░░░░░░░░░░░░  15%
3 ★ ██░░░░░░░░░░░░░░░░░░░░░   5%
2 ★ ░░░░░░░░░░░░░░░░░░░░░░░   1%
1 ★ ░░░░░░░░░░░░░░░░░░░░░░░   1%
```

| Property | Value |
|----------|-------|
| **Bar BG** | `#e8e5e4` |
| **Bar Fill** | `#f59e0b` (star yellow) |
| **Bar Height** | 8px |
| **Bar Radius** | 4px |
| **Label Font** | 14px DM Sans |
| **Star Icon** | 14px, color `#f59e0b` |
| **Percentage** | Right-aligned, 14px |

---

## 9. Mobile-Specific Optimizations

### 9.1 Touch Targets

| Element | Minimum Size | Standard |
|---------|-------------|----------|
| **Buttons** | 44px × 44px | 48px height |
| **Nav Links** | 44px height | 48px height |
| **List Items (clickable)** | 44px height | 52px height |
| **Checkboxes / Toggles** | 44px × 44px touch area | |
| **Close Buttons** | 44px × 44px | |
| **Tab Items** | 44px height | |
| **Calendar Day Cell** | 44px × 44px | |

### 9.2 Mobile Navigation Patterns

**Website (Public):**
- Hamburger menu → full-screen slide-out drawer from right
- Logo left, hamburger right
- Search icon in header → opens full-screen search overlay
- Bottom sticky CTA bar on artist profile ("Book Now" button)

**User/Artist Portal:**
- Bottom tab navigation (5 tabs max)
- Tab icons + labels
- Active tab: `#eb7583` icon + text
- Inactive tab: `#a09b9a` icon + text
- Tab bar height: 56px + safe area

```
┌─────────────────────────────────┐
│          Page Content            │
│                                  │
│                                  │
├──────────────────────────────────┤
│  🏠    📅    ➕    💬    👤     │  ← Bottom tab bar
│ Home  Bookings  New  Chat  Profile│
└──────────────────────────────────┘
```

**Admin Panel:**
- Hamburger menu → slide-out sidebar overlay
- No bottom tabs (admin rarely used on mobile)

### 9.3 Mobile-Specific UI Patterns

| Pattern | Where Used | Implementation |
|---------|-----------|----------------|
| **Bottom Sheet** | Filters, booking flow, confirmations | Slide up from bottom, draggable handle, backdrop |
| **Pull to Refresh** | Lists (bookings, notifications, artists) | Pull down gesture refreshes data |
| **Swipe Actions** | Notification list, booking cards | Swipe left to dismiss/archive |
| **Sticky Header** | All pages | Header sticks, collapses on scroll down, expands on scroll up |
| **Sticky CTA** | Artist profile page | "Book Now" button fixed at bottom |
| **Infinite Scroll** | Find Artist, Portfolio gallery | Load more as user scrolls |
| **Image Carousel** | Artist card (Find Artist), Portfolio | Swipeable image gallery with dots |
| **Date Picker** | Booking flow | Native mobile date picker or custom bottom sheet calendar |

### 9.4 Safe Areas

```css
/* For devices with notch/dynamic island */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

Apply to:
- Header/navbar top padding
- Bottom tab bar bottom padding
- Full-screen modals/drawers
- Sticky bottom CTA buttons

---

## 10. Shadows & Effects

| Token | Value | Usage |
|-------|-------|-------|
| **shadow-sm** | `0 1px 2px rgba(30,26,25,0.05)` | Inputs, small elements |
| **shadow-md** | `0 1px 3px rgba(30,26,25,0.06), 0 1px 2px rgba(30,26,25,0.04)` | Cards, dropdowns |
| **shadow-lg** | `0 4px 12px rgba(30,26,25,0.08)` | Card hover, modals |
| **shadow-xl** | `0 8px 24px rgba(30,26,25,0.12)` | Drawers, overlays |

| Effect | Value |
|--------|-------|
| **Border Radius — Small** | 6px (badges, tags) |
| **Border Radius — Medium** | 8px (buttons, inputs, small cards) |
| **Border Radius — Large** | 12px (cards, modals) |
| **Border Radius — XL** | 16px (hero sections, large containers) |
| **Border Radius — Full** | 9999px (pills, avatars) |
| **Transition — Fast** | `150ms ease` |
| **Transition — Normal** | `200ms ease` |
| **Transition — Slow** | `300ms ease` |
| **Backdrop Blur** | `backdrop-filter: blur(8px)` (sticky header, modals) |

---

## 11. Icons

| Library | Usage |
|---------|-------|
| **Lucide React** (recommended) | All UI icons — clean, consistent, 24px default |
| **Size — Small** | 16px (inline, badges) |
| **Size — Default** | 20px (buttons, nav, inputs) |
| **Size — Large** | 24px (cards, features) |
| **Stroke Width** | 1.5px (default) |
| **Color** | Inherit from parent text color |

---

## 12. Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| **Base** | 0 | Normal content |
| **Dropdown** | 10 | Dropdown menus, tooltips |
| **Sticky** | 20 | Sticky header, sticky CTA |
| **Sidebar** | 30 | Admin sidebar overlay (mobile) |
| **Modal Backdrop** | 40 | Dark overlay behind modals |
| **Modal** | 50 | Modal dialogs, bottom sheets |
| **Toast** | 60 | Toast notifications |
| **Tooltip** | 70 | Tooltips on hover |

---

## 13. Animation Guidelines

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| **Fade In** | 200ms | ease-out | Page transitions, modal appearance |
| **Slide Up** | 300ms | cubic-bezier(0.16, 1, 0.3, 1) | Bottom sheets, mobile menus |
| **Slide Right** | 300ms | cubic-bezier(0.16, 1, 0.3, 1) | Mobile nav drawer |
| **Scale** | 150ms | ease | Button press, card hover |
| **Skeleton Pulse** | 1.5s | ease-in-out, infinite | Loading skeletons |
| **Count Up** | 2s | ease-out | Stats numbers on home page |
| **Stagger** | 50ms delay between items | — | List items appearing (Find Artist results) |

> **Rule:** No animations on mobile that trigger on hover. Only use animations that respond to tap, scroll, or page load.

---

---

## 11. 20-Point Modern Web UI/UX Polish Matrix

Every user-facing interface, portal, and view across GlamBook is built to adhere to this 20-point standard:

| # | Standard | Trigger / Behavior | Styling & Design System Specs |
|---|---|---|---|
| 1 | **⌘K Search** | Pressing `⌘ + K` or `Ctrl + K`, or clicking top search bar | Centered modal backdrop (`rgba(0,0,0,0.4)`), instant fuzzy search, arrow key navigation, keyboard badges (`ESC` to close). |
| 2 | **↩ Undo Toasts** | Mutating actions (deleting service, unfavoriting, archiving) | Sonner/toast container at bottom-right (desktop) / bottom-center (mobile), duration 5s, primary outline button *"Undo"*. |
| 3 | **🔲 Empty States** | Zero items in listing, favorites, bookings, reviews | Branded SVG illustration, centered layout, `#6e6968` helper text, high-contrast primary CTA button. |
| 4 | **🔲 Skeletons** | API loading / data fetch in flight | Pulse/shimmer animation with `bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200`, exact dimensions of target cards. |
| 5 | **⇧ Drag & Drop** | Uploading images & reordering portfolio items | Dashed border `#eb7583` on drag-over, smooth layout transitions, preview thumbnails with delete icons. |
| 6 | **💾 Autosave** | Artist profile forms, package creation, blog editor | Debounced (800ms) background draft save to localStorage/API with quiet *"Saved draft"* checkmark. |
| 7 | **⚡ Offline Banner** | Network disconnect detection (`window.onoffline`) | Fixed top banner in warning amber (`#fef3c7`), dark amber text (`#92400e`), automatically slides out when online restored. |
| 8 | **# Focus Rings** | Keyboard Tab navigation | `focus-visible:ring-2 focus-visible:ring-[#eb7583] focus-visible:ring-offset-2 outline-none` on all interactive elements. |
| 9 | **🌙 Dark Accents / Theme** | Admin & Artist portal sidebars, header accents | Deep `#1e1a19` dark surfaces with `#ffffff` and `#a09b9a` typography for luxury high contrast. |
| 10 | **✦ Hover States** | Mouse enter / hover on desktop (`hover:`) | `transform -translate-y-1 hover:shadow-md transition-all duration-200`, button background changes to `#d4616f`. |
| 11 | **☰ Sticky Header** | Scrolling down any page | `sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100 transition-shadow duration-200`. |
| 12 | **↑ Back to Top** | Scrolling past 400px window scroll Y | Floating circular button at bottom-right (`h-11 w-11 rounded-full shadow-lg bg-white text-dark hover:bg-primary-soft`). |
| 13 | **📋 Copy Buttons** | Booking ID, artist URL, phone/email sharing | Click triggers clipboard API, replaces icon with green checkmark and displays tooltip *"Copied!"* for 2s. |
| 14 | **+ FAQs** | Collapsible Q&A sections | Accordion with smooth height transitions, rotating chevron icon, clean typography with `#4a4544` answers. |
| 15 | **━ Progress Bar** | Multi-step booking flow, page route loading | Top page slim animated bar in `#eb7583`, step indicator (1: Date & Time, 2: Event Details, 3: Review & Submit). |
| 16 | **⚠ Confirm Modals** | Canceling booking, deleting service, rejecting artist | Accessible modal with warning icon, explicit warning copy, gray *"Cancel"* button and destructive red action button. |
| 17 | **📅 Updated Dates** | Activity logs, booking timestamps, reviews | Relative time formatted using `date-fns` or Intl (*"2 hours ago"*, *"Yesterday at 4:30 PM"*). |
| 18 | **💬 Support Float** | Public website bottom-right corner | Floating round pill button with WhatsApp/chat icon, pulse badge, smooth click-to-chat inquiry trigger. |
| 19 | **✓ Success State** | Booking requested, profile saved, verified | Confetti/check animation, green `#22c55e` icon badge, booking reference number, and expected timeline guidance. |
| 20 | **✕ Error State** | Form validation failure, network rejection | Red border `#ef4444`, red subtext with alert triangle icon, auto-scroll to first invalid form field. |

---

## Quick Reference Card

```
BRAND COLORS:
  Primary:      #eb7583
  Primary Lt:   #fcdadb
  Primary Soft:  #fcf1ef
  Dark:         #1e1a19
  White:        #ffffff

FONTS:
  Titles:  Cormorant Garamond (400, 500, 600, 700)
  Body:    DM Sans (300, 400, 500, 600, 700)

KEY SIZES (DESKTOP → MOBILE):
  H1:     40px → 28px
  H2:     32px → 24px
  Body:   16px → 15px
  Input:  14px → 16px (iOS!)
  Button: 44px → 48px height

BREAKPOINTS:
  sm: 640px  md: 768px  lg: 1024px  xl: 1280px

MOBILE & POLISH RULES:
  ✅ 20-Point UI/UX Polish Standard Enforced
  ✅ Min touch target: 44px
  ✅ Input font: 16px (iOS zoom)
  ✅ Bottom tab nav for portals
  ✅ Bottom sheet for filters
  ✅ Sticky CTA on artist profile
  ✅ Safe area padding
  ✅ No hover animations on touch devices
```

