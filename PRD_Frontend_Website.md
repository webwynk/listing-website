# 📋 GlamBook — PRD Frontend Website

## 7 Public Website Pages — Design, Layout & SEO

---

## 1. Global Layout & Navigation

### 1.1 Header / Navbar

```
┌──────────────────────────────────────────────────────────────┐
│  🎨 GlamBook           Find Artist  Packages  How It Works  │
│                         About Us  Contact Us  Blog           │
│                                            [Login] [Sign Up] │
└──────────────────────────────────────────────────────────────┘
```

| Feature | Details |
|---------|---------|
| **Logo** | Left-aligned, links to home |
| **Navigation Links** | Center — Find Artist, Packages, How It Works, About Us, Contact Us, Blog |
| **Auth Buttons** | Right — Login + Sign Up (if not logged in); User Avatar + dropdown (if logged in) |
| **Sticky** | Header sticks on scroll with backdrop blur |
| **Mobile** | Hamburger menu with slide-out drawer |
| **User Dropdown** | (When logged in) My Dashboard, My Bookings, Favorites, Profile, Logout |
| **Active State** | Current page link highlighted |

### 1.2 Footer

```
┌──────────────────────────────────────────────────────────────┐
│  GlamBook                Quick Links         For Artists     │
│  Your beauty, our       Home                 Register as     │
│  experts.               Find Artist           Artist         │
│                         Packages             Artist Login    │
│  📧 hello@glambook.com  How It Works         Artist FAQ      │
│  📱 +91-XXXXXXXXXX      About Us                             │
│                         Blog                 Follow Us       │
│  © 2026 GlamBook.       Contact Us           📘 📸 🐦 📺    │
│  All rights reserved.   Privacy Policy                       │
│                         Terms of Service                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Home Page (`/`)

### Section 1: Hero Banner

| Element | Details |
|---------|---------|
| **Type** | Full-width image/video slider (admin-managed banners) |
| **Overlay** | Semi-transparent dark gradient overlay |
| **Headline** | "Find the Perfect Beauty Professional for Your Special Day" |
| **Subheadline** | "Browse verified makeup artists, photographers, and stylists near you" |
| **Search Bar** | Prominent search with 3 fields: |
| → Location | Dropdown/autocomplete — "Select your city" |
| → Date | Date picker — "Select your date" |
| → Service | Dropdown — categories list — "What do you need?" |
| → Search Button | "Find Artists" → navigates to Find Artist page with filters pre-applied |
| **Auto-slide** | Banners auto-rotate every 5 seconds |

### Section 2: Browse by Category

| Element | Details |
|---------|---------|
| **Layout** | Horizontal scrolling cards or grid (3-4 per row) |
| **Each Card** | Category icon/image, category name, artist count (e.g., "150+ Artists") |
| **Click** | Navigate to Find Artist page filtered by that category |
| **Animated** | Cards have hover scale + shadow effect |
| **Data Source** | All active categories from database |

### Section 3: Featured Artists

| Element | Details |
|---------|---------|
| **Layout** | Carousel/slider of artist cards (4 visible, arrows to scroll) |
| **Each Card** | Profile photo, name, primary category, location, rating (stars + count), starting price, "View Profile" button |
| **Selection** | Artists with `is_featured: true` (admin-managed) |
| **Fallback** | If no featured artists, show top-rated artists |
| **Animated** | Smooth slide transition, auto-play option |

### Section 4: How It Works (Preview)

| Element | Details |
|---------|---------|
| **Layout** | 3-4 step horizontal cards with icons |
| **Steps** | 1. Search & Browse → 2. View Portfolio & Reviews → 3. Send Booking Request → 4. Get Confirmed |
| **Animation** | Steps animate in on scroll (staggered fade-up) |
| **CTA** | "Learn More" → links to How It Works page |

### Section 5: Testimonials

| Element | Details |
|---------|---------|
| **Layout** | Carousel with client photo, name, testimonial text, rating |
| **Data Source** | Admin-managed testimonials |
| **Auto-play** | Rotates every 6 seconds |

### Section 6: Recent Blog Posts

| Element | Details |
|---------|---------|
| **Layout** | 3-column grid showing latest published posts |
| **Each Card** | Cover image, title, excerpt, date, "Read More" link |
| **CTA** | "View All Posts" → Blog page |

### Section 7: CTA Banner

| Element | Details |
|---------|---------|
| **For Artists** | "Are you a beauty professional? Join GlamBook and grow your business!" + "Register Now" button |
| **Design** | Gradient background, large text, prominent CTA |

### Section 8: Statistics Bar

| Element | Details |
|---------|---------|
| **Layout** | Horizontal bar with 4 animated counters |
| **Stats** | "500+ Artists", "1000+ Bookings", "50+ Cities", "4.8★ Avg Rating" |
| **Animation** | Numbers count up on scroll into view |
| **Data Source** | Real-time or cached from database |

---

## 3. Find Artist Page (`/find-artist`)

### 3.1 Search & Filter Bar (Top)

| Filter | Type | Details |
|--------|------|---------|
| **Search** | Text input | Search by artist name or keyword |
| **Location** | Autocomplete dropdown | City filter |
| **Date** | Date picker | Shows only artists available on that date |
| **Category** | Dropdown | Main categories |
| **Sub-Category** | Dropdown | Depends on selected category |
| **Price Range** | Range slider | Min-Max price filter |
| **Experience** | Dropdown | "Any", "1-3 years", "3-5 years", "5-10 years", "10+ years" |
| **Rating** | Star filter | "4+ stars", "3+ stars", etc. |
| **Clear Filters** | Button | Reset all filters |

### 3.2 Filter Logic (Backend Query)

```sql
WHERE artist_profiles.status = 'approved'
  AND (location filter: city match OR within radius)
  AND (date filter: artist_availability.date = selected_date AND status = 'available')
  AND (category filter: artist_services.category_id = selected)
  AND (sub-category filter: artist_services.sub_category_id = selected)
  AND (price filter: price_from >= min AND price_from <= max)
  AND (experience filter: experience_years within range)
  AND (rating filter: avg_rating >= selected)
  AND (search: name ILIKE '%query%' OR bio ILIKE '%query%')
ORDER BY is_featured DESC, avg_rating DESC, total_reviews DESC
```

### 3.3 Results Area

| View Mode | Details |
|-----------|---------|
| **Grid View** (default) | 3-column card grid |
| **List View** | Single-column detailed cards |
| **Toggle** | Grid/List toggle button |

### 3.4 Artist Card (Grid View)

```
┌─────────────────────────┐
│  [Portfolio Image]       │
│                          │
│  ⭐ Verified  ⭐ Featured│
│  ─────────────────────── │
│  Priya Sharma            │
│  💄 Bridal Makeup Artist │
│  📍 Mumbai, Maharashtra  │
│  ⭐ 4.8 (120 reviews)   │
│  💰 Starting ₹8,000     │
│  📅 Available            │
│  ─────────────────────── │
│  [View Profile] [♡ Save] │
└─────────────────────────┘
```

| Element | Details |
|---------|---------|
| **Image** | First portfolio image or profile photo |
| **Badges** | "Verified" (admin approved), "Featured" (admin picked), "Top Rated" (4.5+ stars) |
| **Name** | Artist name (clickable → profile page) |
| **Category** | Primary service category |
| **Location** | City, State |
| **Rating** | Star icons + number + review count |
| **Price** | "Starting ₹X,XXX" (lowest service price) |
| **Availability** | Green "Available" if selected date is available |
| **Actions** | "View Profile" button + Heart icon to save to favorites |

### 3.5 Results Meta

| Feature | Details |
|---------|---------|
| **Result Count** | "Showing 24 of 156 artists" |
| **Sort By** | Dropdown: Relevance, Rating (High to Low), Price (Low to High), Price (High to Low), Experience, Newest |
| **Pagination** | Load more button or page numbers (20 per page) |
| **No Results** | Friendly empty state with suggestions to adjust filters |

---

## 4. Artist Profile Page (`/artist/[slug]`)

### Section 1: Profile Header

| Element | Details |
|---------|---------|
| **Cover Image** | First portfolio image as full-width banner (or default gradient) |
| **Profile Photo** | Circular photo overlapping cover image |
| **Name** | Large heading |
| **Category** | Primary category badge |
| **Location** | City, State with map pin icon |
| **Rating** | ⭐ 4.8 (120 reviews) |
| **Experience** | "8 Years Experience" |
| **Badges** | Verified, Featured, Top Rated |
| **CTA Buttons** | "Book Now" (primary) + "♡ Save" + "📤 Share" |

### Section 2: About

| Element | Details |
|---------|---------|
| **Bio** | Artist's bio/about text |
| **Key Info** | Service radius, languages spoken (if added), years active |

### Section 3: Services & Pricing

| Element | Details |
|---------|---------|
| **Table/Cards** | Service name, sub-category, price, duration |
| **Book Button** | "Book" next to each service → opens booking flow |
| **Grouped** | Grouped by category if artist offers multiple categories |

### Section 4: Packages

| Element | Details |
|---------|---------|
| **Cards** | Package name, description, included services list, total price, "Book Package" button |
| **Highlight** | Best value or most popular package highlighted |

### Section 5: Portfolio Gallery

| Element | Details |
|---------|---------|
| **Layout** | Masonry grid or uniform grid |
| **Lightbox** | Click any image to open full-screen lightbox with navigation |
| **Videos** | Video items play inline or in lightbox |
| **Filter** | Tabs to filter by category (e.g., "Bridal", "Party", "All") |
| **Count** | Total images/videos count |

### Section 6: Availability Calendar

| Element | Details |
|---------|---------|
| **View** | Read-only monthly calendar |
| **Color Code** | 🟢 Available, 🔴 Unavailable |
| **Interaction** | Click an available date → auto-fills date in booking flow |
| **Months** | Show current and next month |

### Section 7: Reviews

| Element | Details |
|---------|---------|
| **Summary** | Average rating (large number + stars), rating distribution bar chart |
| **List** | Individual reviews: user name, rating, date, comment, photos, artist reply |
| **Sort** | Newest, Highest, Lowest |
| **Pagination** | Show 5 initially, "Load More" button |

### Section 8: Location

| Element | Details |
|---------|---------|
| **Map** | Embedded map showing approximate service area (not exact address) |
| **Service Area** | "Serves within [X] km of [City]" |

### Section 9: Similar Artists

| Element | Details |
|---------|---------|
| **Carousel** | 4 artist cards from same category and city |
| **Algorithm** | Same category + nearby location + similar price range |

---

## 5. Packages Page (`/packages`)

| Element | Details |
|---------|---------|
| **Filter** | By category, by city, by price range |
| **Layout** | Card grid showing packages from all artists |
| **Each Card** | Artist photo + name, package name, included services, price, "View Details" |
| **Click** | Opens artist profile with package highlighted |
| **Sort** | Price (low/high), Rating, Popular |

---

## 6. How It Works Page (`/how-it-works`)

### For Clients

| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 🔍 | Search & Browse | Find beauty professionals near you using our smart filters |
| 2 | 👁️ | Explore Profiles | View portfolios, read reviews, compare pricing |
| 3 | 📅 | Send Booking Request | Choose your date, describe your needs, and request a booking |
| 4 | ✅ | Get Confirmed | The artist reviews and accepts your request. You're all set! |

### For Artists

| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 📝 | Create Your Profile | Showcase your work, set your prices, define your services |
| 2 | 📋 | Get Verified | Our team reviews your profile to ensure quality |
| 3 | 📩 | Receive Requests | Clients find and send you booking requests |
| 4 | 💼 | Grow Your Business | Build your reputation with reviews and featured listings |

### FAQ Accordion

| Question | Answer |
|----------|--------|
| Is it free to create an account? | Yes, creating an account is completely free for both clients and artists. |
| How long does artist verification take? | Typically 24-48 hours after submitting your complete profile. |
| Do I need to pay online? | No, there are no online payments on the platform currently. |
| How do I contact a booked artist? | After your booking is accepted, our team will facilitate the connection. |
| Can I cancel a booking? | Yes, you can cancel from your dashboard before the booking date. |

---

## 7. About Us Page (`/about`)

| Section | Content |
|---------|---------|
| **Hero** | "Our Story" + cover image |
| **Mission** | Company mission statement |
| **What We Do** | Platform description, value proposition |
| **Numbers** | Stats bar (artists, bookings, cities, satisfaction rate) |
| **Team** | Team member photos, names, roles (optional) |
| **Values** | Core values with icons |

---

## 8. Contact Us Page (`/contact`)

| Element | Details |
|---------|---------|
| **Contact Form** | Name, Email, Phone (optional), Subject, Message, Submit button |
| **Contact Info** | Email, Phone, Address |
| **Map** | Embedded Google Map / Leaflet with office location |
| **Social Links** | Facebook, Instagram, YouTube, Twitter |
| **Working Hours** | Monday-Saturday: 10AM - 7PM |
| **Success Message** | "Thank you! We'll get back to you within 24 hours." |
| **Validation** | All required fields validated, email format checked |
| **Spam Protection** | Rate limiting (max 3 submissions per hour per IP) |

---

## 9. Blog (`/blog`)

### 9.1 Blog Listing (`/blog`)

| Element | Details |
|---------|---------|
| **Featured Post** | Latest post displayed prominently at top |
| **Grid** | Remaining posts in 3-column card grid |
| **Card** | Cover image, category badge, title, excerpt, date, "Read More" |
| **Sidebar** | Categories list, Recent posts list, Tags cloud |
| **Search** | Search posts by title/content |
| **Pagination** | 9 posts per page with page numbers |

### 9.2 Blog Post (`/blog/[slug]`)

| Element | Details |
|---------|---------|
| **Header** | Cover image, title, author, date, category, read time |
| **Content** | Full article with formatted text, images, embedded media |
| **Share** | Social sharing buttons (WhatsApp, Facebook, Twitter, Copy Link) |
| **Related Posts** | 3 related posts at the bottom (same category) |
| **SEO** | Custom meta title, description, Open Graph tags |

---

## 10. SEO Implementation

### 10.1 Page-Level SEO

| Page | Meta Title Format | URL Format |
|------|------------------|------------|
| Home | "GlamBook - Find Makeup Artists & Photographers Near You" | `/` |
| Find Artist | "Find [Category] in [City] - GlamBook" | `/find-artist?category=X&city=Y` |
| Artist Profile | "[Artist Name] - [Category] in [City] \| GlamBook" | `/artist/priya-sharma-mumbai` |
| Packages | "Beauty Packages & Deals - GlamBook" | `/packages` |
| Blog Post | "[Post Title] \| GlamBook Blog" | `/blog/bridal-makeup-tips-2026` |
| How It Works | "How GlamBook Works - Find & Book Beauty Professionals" | `/how-it-works` |
| About | "About GlamBook - Your Beauty Marketplace" | `/about` |
| Contact | "Contact GlamBook - Get in Touch" | `/contact` |

### 10.2 Technical SEO

| Feature | Implementation |
|---------|---------------|
| **Sitemap** | Auto-generated `sitemap.xml` with all public pages and artist profiles |
| **robots.txt** | Properly configured to allow/disallow crawling |
| **Structured Data** | JSON-LD for LocalBusiness, Service, Review (Schema.org) |
| **Open Graph** | OG tags for social sharing with images |
| **Twitter Cards** | Summary card with large image |
| **Canonical URLs** | Prevent duplicate content issues |
| **Alt Text** | All images have descriptive alt text |
| **Loading Speed** | Image optimization (WebP, lazy loading), code splitting |
| **Mobile-First** | Responsive design, mobile-optimized |

---

## 11. Responsive Design Breakpoints

| Breakpoint | Width | Priority |
|------------|-------|----------|
| **Mobile** | 320px - 480px | 🔴 Critical |
| **Mobile Large** | 481px - 768px | 🔴 Critical |
| **Tablet** | 769px - 1024px | 🟡 High |
| **Desktop** | 1025px - 1440px | 🔴 Critical |
| **Large Desktop** | 1441px+ | 🟢 Medium |

### Mobile Adjustments

| Component | Mobile Behavior |
|-----------|----------------|
| Navbar | Hamburger menu, slide-out drawer |
| Hero Search | Stack filters vertically |
| Artist Cards | 1-column on mobile, 2 on tablet |
| Portfolio Gallery | 2-column masonry on mobile |
| Calendar | Scrollable or compact view |
| Footer | Stack columns vertically |
| Blog Grid | 1-column on mobile |

---

## 12. Performance Optimization

| Optimization | Implementation |
|-------------|---------------|
| **Image Optimization** | Next.js `<Image>` component, WebP format, responsive sizes |
| **Lazy Loading** | Images below fold, portfolio gallery, blog images |
| **Code Splitting** | Dynamic imports for heavy components (calendar, lightbox) |
| **API Caching** | Cache category list, featured artists, site settings (revalidate every 5 min) |
| **CDN** | Vercel Edge Network for static assets |
| **Font Loading** | Google Fonts with `display: swap` |
| **Lighthouse Target** | Performance > 90, SEO > 90, Accessibility > 85 |
