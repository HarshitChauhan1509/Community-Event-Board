# Gather — Community Events Board

A curated, editorial discovery platform for local culture, live music, creative workshops, and community gatherings. Built with Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

---

## 1. Project Overview

**Gather** is designed as a modern, typography-driven event discovery platform. 

Instead of a generic SaaS dashboard or template appearance, it offers an intentional editorial layout with generous whitespace, authentic Indian currency formatting (₹), friendly date representations, responsive mobile navigation, optimistic reminders, a live interactive card designer, and a server-protected admin management portal.

---

## 2. Tech Stack

- **Framework**: Next.js 16 (App Router, Partial Prerendering, Turbopack)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4, custom theme tokens (`globals.css`)
- **Typography**: Playfair Display (Display headings) & Inter (UI/Body)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (`jose`), secure `httpOnly` cookies, `bcrypt` password hashing
- **Validation**: Zod (all request bodies, query params, and mutation schemas)
- **Icons**: Lucide React
- **Animations**: CSS transitions & Framer Motion

---

## 3. Quick Setup (< 5 Minutes)

Run the following commands in your terminal:

```bash
# 1. Clone repository
git clone <repository-url>
cd "Community Event Board"

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env

# 4. Start PostgreSQL container
docker compose up -d

# 5. Push database schema & seed initial 15 events + admin
npx prisma db push
npm run seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Default Admin Credentials

- **Email**: `admin@gather.com`
- **Password**: `admin123`

*Note: You can log in via `/login` and access the management portal at `/admin`.*

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/signup` — Create user account with hashed password and issue JWT cookie.
- `POST /api/auth/login` — Verify credentials and establish JWT session.
- `GET /api/auth/me` — Verify server-side JWT session and return current user.
- `POST /api/auth/logout` — Clear session cookie.

### Visitor Discovery & Filtering
- `GET /api/events` — Paginated upcoming active events with composable filters (`category`, `city`, `q`, `page`, `limit`).
- `GET /api/events/[id]` — Single event details, reminder status, and custom card design.
- `GET /api/categories` — Predefined categories (`Music`, `Workshop`, `Food`, `Sports`, `Kids`) with event counts.
- `GET /api/cities` — Dynamic distinct city listing.

### Personalization & Reminders
- `GET /api/me/favourites` — Retrieve authenticated user's favourite categories.
- `PUT /api/me/favourites` — Atomically update favourite categories via database transaction.
- `GET /api/feed` — Curated feed of upcoming active events matching user favourites (nearest date first).
- `GET /api/me/reminders` — Listing of all events the user has saved reminders for.
- `POST /api/events/[id]/reminder` — Optimistically add reminder with duplicate prevention (`upsert`).
- `DELETE /api/events/[id]/reminder` — Remove reminder.

### Interactive Card Customization
- `GET /api/events/[id]/card-design` — Retrieve user's custom badge configuration (`theme`, `stickers`).
- `PUT /api/events/[id]/card-design` — Persist custom badge design (enforcing exactly 3 themes & max 3 stickers).

### Admin Portal (Protected)
- `GET /api/admin/events` — List all events (including inactive/past events) for administrative oversight.
- `POST /api/admin/events` — Create new event with Zod validation.
- `PATCH /api/admin/events/[id]` — Update event details or toggle Active/Inactive visibility.
- *(Note: In accordance with project requirements, events cannot be deleted, only deactivated).*

---

## 6. Architectural Questions & Rationale (Assignment Requirements)

### Question 1: Show your database structure. Why did you design it this way?
```text
User ────< FavouriteCategory >──── Category
  │                                    │
  ├───< Reminder >───────────┐         │
  │                          │         │
  └───< EventCardDesign >── Event ─────┘
```
- **Relational Normalization**: The database is structured across 6 normalized entities (`User`, `Category`, `Event`, `FavouriteCategory`, `Reminder`, and `EventCardDesign`) rather than denormalized JSON arrays to enforce relational integrity and concurrency safety.
- **Deduplication Constraints**: Junction entities utilize composite primary unique keys (`@@unique([userId, categoryId])` and `@@unique([userId, eventId])`), which guarantee at the PostgreSQL storage engine level that duplicate reminders or preferences cannot occur.
- **Lifecycle Integrity**: Foreign keys employ `onDelete: Cascade` so account removals cleanly purge personal badges and reminders without corrupting core community event catalog records.

### Question 2: How does your filter query work, and what index would you add?
- **Query Mechanism**: The query dynamically composes an `AND` criteria clause in Prisma/SQL filtering `isActive = true`, `date >= startOfToday`, with optional category ID match, city match, and case-insensitive substring searching (`ILIKE` via `mode: 'insensitive'`) across `title`, `description`, and `city`.
- **Sorting & Paging**: Results are ordered by `date ASC` (nearest date first) with SQL `LIMIT` and `OFFSET` pagination to guarantee O(1) page rendering times.
- **Indexes Added**: We implemented a composite B-tree index on `@@index([isActive, date])` alongside single-column indexes on `@@index([city])` and `@@index([categoryId])`. This composite index allows PostgreSQL to perform an index range scan directly on upcoming active events without scanning past or deactivated events.

### Question 3: How do you store passwords and protect the admin pages and APIs?
- **Password Storage**: Passwords are never stored in plaintext; they are salted and hashed using `bcrypt` (work factor 10) before database insertion.
- **Cryptographic JWT Session**: Authentication issues an HMAC SHA-256 signed JWT (`jose`) returned in the login JSON body and stored inside a hardened `httpOnly`, `sameSite: 'lax'`, secure cookie to protect against XSS and CSRF.
- **Server-Side Authorization**: Both the Admin UI page (`/admin`) and all admin endpoints (`/api/admin/*`) independently invoke `requireAdminSession()`. This decodes the JWT signature server-side and checks `user.isAdmin === true` in PostgreSQL, immediately returning a `403 Forbidden` response for unauthorized requests before any sensitive data or UI components load.

---

## 7. What is Left (If Any)

- **Core Scope**: **Zero features left.** All mandatory functional criteria (Admin management, active/inactive toggle, visitor discovery, composable multi-filters with pagination, auth, favourite categories, personalized feed, optimistic reminders, 3-theme/5-sticker card designer, Indian currency formatting, and responsive design) are 100% complete and tested.
- **Production Enhancements (Optional Beyond Scope)**:
  1. *Direct Cloud Storage*: Connecting an S3/Cloudflare R2 bucket for direct admin image uploads instead of external image URLs.
  2. *Full-Text Search Engine*: Adding PostgreSQL `tsvector` with GIN indexing for multi-language fuzzy search at scale (>100,000 events).

---

## 8. AI Tools Disclosure

As permitted by the evaluation guidelines, AI assistance (Claude / Google DeepMind Antigravity) was utilized during development:
- **Where Used**: Rapid boilerplate scaffolding of initial Prisma schema, synthesis of diverse sample event seeds, and drafting end-to-end integration test assertions.
- **Architectural Verification**: All security boundaries (`httpOnly` JWT middleware, `bcrypt` salting), relational constraints (`@@unique`), optimistic UI rollbacks, and responsive styles were manually reviewed, validated, and tested. Every line of code submitted is fully understood and can be modified during the live evaluation call.
- **README.md**: Created README.md document.

---

## 9. Manual Test Matrix Verification

| Feature Area | Scenario Tested | Result |
| :--- | :--- | :--- |
| **Authentication** | Sign up with new email & password | Passed (Account created, JWT cookie established) |
| **Authentication** | Duplicate email rejection | Passed (Returns 409 Conflict) |
| **Authentication** | Invalid password login | Passed (Returns 401 with error message) |
| **Authentication** | Logout | Passed (Clears cookie, resets navbar state) |
| **Admin** | Unauthenticated `/admin` page access | Passed (403 Forbidden banner with Sign In CTA) |
| **Admin** | Non-admin API request to `/api/admin/events` | Passed (403 Forbidden response) |
| **Admin** | Create event via Admin modal | Passed (Saved to DB, visible on discovery) |
| **Admin** | Edit event details | Passed (Updates price, date, description) |
| **Admin** | Toggle Active/Inactive status | Passed (Immediate state change, updates public visibility) |
| **Events** | Upcoming vs past filtering | Passed (Past events excluded from visitor board) |
| **Events** | Category filter (e.g. Music) | Passed (Only Music events returned) |
| **Events** | City filter (e.g. Mumbai) | Passed (Only Mumbai events returned) |
| **Events** | Combined filter (Music + Mumbai + search) | Passed (Returns exact match intersection) |
| **Events** | Pagination (Previous, Next, Direct numbers) | Passed (Maintains active filter params) |
| **Feed** | Logged-in user with no favourites | Passed (Empty state prompting category selection) |
| **Feed** | Logged-in user with favourite categories | Passed (Curates upcoming events for chosen categories) |
| **Feed** | Favourite categories with no scheduled events | Passed (Empty state explaining no matching events) |
| **Reminders** | Click "Remind me" on event card | Passed (Optimistic UI update to "Reminder set") |
| **Reminders** | Page refresh retention | Passed (Reminder state preserved from DB) |
| **Reminders** | Network failure rollback | Passed (Reverts state and shows error notification) |
| **Card Designer** | Switch between 3 themes | Passed (Live card preview updates instantly) |
| **Card Designer** | Add up to 3 stickers | Passed (Stickers float on preview card) |
| **Card Designer** | Attempt to add 4th sticker | Passed (Blocked with visual warning notice) |
| **Card Designer** | Save custom design and refresh page | Passed (Design restored from database) |

---

Assignment Walkthrough Video - https://drive.google.com/file/d/18xlHAhF30nNqcYVMBY3Cz-rjJ1m7a6FO/view?usp=drive_link