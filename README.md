# IELTS Vocabulary Flashcards PWA

A mobile-first Progressive Web Application (PWA) designed to help students master high-yield academic vocabulary for the IELTS exam. Built using Next.js 14, TypeScript, Tailwind CSS, Clerk (Google OAuth), and Supabase.

## Tech Stack
* **Framework**: Next.js 14 (App Router)
* **Auth**: Clerk (Google OAuth)
* **Database**: Supabase (Postgres)
* **PWA**: `next-pwa`
* **Styling**: Tailwind CSS & Lucide Icons

---

## 1. Database Setup (Supabase SQL)

Run the following SQL queries in your Supabase SQL Editor to set up the database tables:

```sql
-- Create flashcards table
create table flashcards (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  definition text not null,
  example text not null,
  category text default 'Academic'
);

-- Create user progress tracking table
create table user_progress (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  flashcard_id uuid references flashcards(id) on delete cascade,
  status text check (status in ('known', 'learning')) default 'learning',
  last_reviewed timestamp default now(),
  unique(clerk_user_id, flashcard_id)
);
```

---

## 2. Environment Variables (`.env.local`)

Create a `.env.local` file at the root of the project with the following configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wtchadwngewjtnxdrdvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2hhZHduZ2V3anRueGRyZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTI2NzMsImV4cCI6MjA5NTgyODY3M30.DbLW4Vh8yKf6LtWnENv7Y4exh9HatXHfOK0pDoG4cao
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2hhZHduZ2V3anRueGRyZHZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI1MjY3MywiZXhwIjoyMDk1ODI4NjczfQ.5PCWG5fVPiKonfv_GE2GT5RGqjTOugMRDK8XnsRy1jc

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

*Note: Replace the Clerk test keys above with your active Clerk credentials.*

---

## 3. Seeding the Database

To seed the initial **30 high-yield IELTS Academic vocabulary words**, run the application locally or deploy it, and access the seeding API route once:

* Local Seeding: `http://localhost:3000/api/seed`
* Production Seeding: `https://<your-app-domain>.vercel.app/api/seed`

The endpoint will return a JSON report indicating how many cards were successfully seeded. It prevents duplicates if triggered multiple times.

---

## 4. Clerk Authentication Setup

1. Create a new application in the [Clerk Dashboard](https://dashboard.clerk.com/).
2. Enable **Google OAuth** in the User Authentication settings.
3. Configure the redirect paths in Clerk:
   * **Sign-in URL**: `/login`
   * **After Sign-in URL**: `/dashboard`
4. Copy the Publishable Key and Secret Key and add them to your `.env.local` file.

---

## 5. Local Development

Install dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```

Build the application for production (to test service worker and PWA capabilities):
```bash
npm run build
npm start
```
