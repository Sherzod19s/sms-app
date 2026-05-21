# Aqlvoy Sen — School Management System

A Next.js 14 (App Router) + TypeScript + Tailwind + ShadCN/UI school
management system, backed by Supabase (PostgreSQL + Auth).

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** + **ShadCN/UI** primitives
- **Supabase** — Postgres database, authentication, Row Level Security
- **FullCalendar** for scheduling, **Recharts** for charts
- **Lucide React** icons, **date-fns**, **react-hook-form + zod**, **Sonner**,
  **next-themes**

## Getting started

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and from
**Project Settings → API** copy:

- `Project URL`
- `anon` public key

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the database migration

In the Supabase dashboard go to **SQL Editor → New query**, paste the contents
of [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql),
and run it. This creates the six tables (`profiles`, `classes`, `students`,
`invoices`, `expenses`, `sessions`), enables RLS, and adds policies.

### 4. Create your first admin user

The signup page registers users with `role = 'teacher'` by default. To create
an admin:

1. In Supabase go to **Authentication → Users → Add user → Create new user**
2. Enter an email/password and click **Create user**
3. Go to **Table Editor → profiles**, click **Insert row**, and add:
   - `id`: the UUID of the user you just created
   - `full_name`: e.g. `Botir Karimov`
   - `role`: `admin`
4. Save.

You can now sign in at `/login`. Subsequent users can sign up at `/signup` and
will be created as teachers; promote them by editing their `profiles.role`.

> **Recommended (optional)**: add a Postgres trigger that auto-creates a
> `profiles` row whenever a new user is added to `auth.users`. The signup page
> attempts the insert from the client, but with email confirmation enabled the
> insert is unauthenticated and will fail RLS. A trigger is the durable fix.

### 5. Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## Authorisation model

- **Admins** can create, edit and delete every record.
- **Teachers** can read everything but cannot mutate. UI controls still render
  for them; their mutations are rejected by Row Level Security and surface as a
  toast error.

If you want teachers to have any write access, add additional RLS policies in
the Supabase dashboard (or extend the migration file).

## Module overview

| Route          | Module          | What it does |
|----------------|-----------------|--------------|
| `/dashboard`   | Dashboard       | KPI cards, income-vs-expenses chart, today's classes, recent enrolments. |
| `/students`    | Students        | Searchable / filterable / sortable / paginated table; add / edit / delete; click into detail page. |
| `/students/[id]` | Student detail | Profile, parent info, class, lead teacher, invoice history. |
| `/classes`     | Classes         | Card grid; add / edit / delete classes; assign teachers; pick schedule days. |
| `/finance`     | Finance         | Income / Expenses / Net Balance summary, invoice status donut, invoice table, expenses table. |
| `/schedule`    | Schedule        | FullCalendar month + week views; click an event for details; add sessions. |
| `/teachers`    | Teachers        | Read-only list of profiles with `role='teacher'`. New teachers join by signing up. |
| `/settings`    | Settings        | My Account (read-only profile) + Appearance (theme). |

## Folder structure

```
/app
  /(auth)
    /login                  — sign-in page (no chrome)
    /signup                 — sign-up page (no chrome)
    layout.tsx              — centred auth layout
  /dashboard, /students, /classes, /finance, /schedule, /teachers, /settings
  layout.tsx                — root layout (wraps everything in AppShell)
/components
  /layout                   — AppShell, Sidebar, Header (with user menu), MobileNav, ThemeProvider
  /modules                  — feature components grouped by module
  /shared                   — AvatarInitials, ConfirmDelete, EmptyState
  /ui                       — ShadCN primitives
/hooks
  create-crud-hook.ts       — Supabase-backed CRUD factory
  use-students.ts           — wraps create-crud-hook
  use-classes.ts            — wraps create-crud-hook
  use-invoices.ts           — wraps create-crud-hook
  use-expenses.ts           — wraps create-crud-hook
  use-sessions.ts           — wraps create-crud-hook
  use-teachers.ts           — custom (reads profiles + classes join)
/lib
  /supabase
    client.ts               — browser Supabase client
    server.ts               — server (cookie-aware) Supabase client
    mappers.ts              — snake_case ↔ camelCase row mappers
  types.ts                  — shared TypeScript interfaces
  utils.ts                  — cn(), formatCurrency() (SM), formatDate(), helpers
/supabase
  /migrations
    001_initial_schema.sql  — full DB schema + RLS policies
/middleware.ts              — session refresh + route protection
```

## Notes

- All UI components still use the **same hook interface** (`{ data, add,
  update, remove, hydrated, loading }`) — only the data source changed.
- DB columns are snake_case; TypeScript fields are camelCase. The mapping lives
  in `lib/supabase/mappers.ts`.
- The attendance figure on student detail pages is a static placeholder (85%).
- The Teacher interface has fields (`subject`, `contact`, `joinDate`) that
  aren't in the `profiles` schema. They're populated as empty defaults so the
  existing UI still renders; edits to those fields are silently dropped.
