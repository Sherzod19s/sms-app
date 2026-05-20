# Aqlvoy Sen — School Management System (Prototype)

A front-end-only prototype of a School Management System (SMS) for a small
kids' educational centre. No backend, no database, no auth — every change is
persisted to `localStorage` via a custom `useLocalStorage` hook.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** + **ShadCN/UI** primitives
- **FullCalendar** for the scheduling module
- **Recharts** for finance + dashboard charts
- **Lucide React** icons, **date-fns** date handling
- **react-hook-form + zod** for form validation
- **Sonner** for toasts, **next-themes** for light/dark mode

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:3000
```

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## How data persists

On first load the app seeds `localStorage` with realistic dummy data
(8 students, 3 teachers, 4 classes, 6 invoices, 5 calendar sessions).
After that, every add / edit / delete persists across page refreshes.

To reset to seed data, clear your browser's `localStorage` for the site
(`sms:*` keys) and refresh.

## Module overview

| Route          | Module          | What it does |
|----------------|-----------------|--------------|
| `/dashboard`   | Dashboard       | 4 KPI cards (students, monthly revenue, unpaid invoices, classes today), 6-month revenue bar chart, today's classes list, recent enrolments table. |
| `/students`    | Students        | Searchable / filterable / sortable / paginated table. Add & edit via dialog with zod-validated form. Delete with confirm. |
| `/students/[id]` | Student detail | Profile, parent info, class assignment, lead teacher, attendance (static), full invoice history with totals. |
| `/finance`     | Finance         | Collected / outstanding / month-to-date summary, donut chart of invoice statuses, sortable invoice table with row actions. |
| `/schedule`    | Schedule        | FullCalendar (month + week views), colour-coded events per class, click for popover (class, teacher, time, room, student count), add-session dialog with auto-filled teacher. |
| `/teachers`    | Teachers        | Search, sortable table with avatars + assigned-class chips, add/edit dialog (multi-select classes), detail modal with this-week sessions. |

## Folder structure

```
/app                       — pages (App Router)
  /dashboard
  /students
    /[id]                  — student detail page
  /finance
  /schedule
  /teachers
/components
  /layout                  — Sidebar, Header, MobileNav, ThemeProvider, transitions
  /modules                 — feature components grouped by module
  /shared                  — AvatarInitials, ConfirmDelete, EmptyState
  /ui                      — ShadCN UI primitives
/hooks
  use-local-storage.ts     — SSR-safe persistent state with cross-tab sync
  create-crud-hook.ts      — generic CRUD factory used by every module hook
  use-students.ts          — students CRUD
  use-teachers.ts          — teachers CRUD
  use-classes.ts           — classes CRUD
  use-invoices.ts          — invoices CRUD
  use-sessions.ts          — calendar sessions CRUD
/lib
  types.ts                 — shared TypeScript interfaces
  seed-data.ts             — initial dummy data
  utils.ts                 — cn(), formatCurrency() (TJ Somoni), formatDate(), helpers
```

## UX standards built in

- Every empty state has icon + message + primary CTA
- ShadCN `Skeleton` loaders on first mount (hydration-aware)
- All forms use `react-hook-form` + zod with inline error messages
- Toasts via Sonner (success on add/edit, warning on delete)
- ShadCN `AlertDialog` confirmation before every destructive action
- Light + dark mode toggle in header (uses `next-themes`)
- All tables are sortable by clicking column headers
- All monetary values formatted as `TJ Somoni 1,200.00`
- TypeScript strict mode — no `any` anywhere
- Sidebar collapses to icon-only on desktop; hamburger sheet on mobile
- Smooth fade-up page transitions between routes
- Header notification bell shows a live badge of unpaid invoice count

## Customising

- **Centre name / branding** — edit `components/layout/sidebar.tsx` and `header.tsx` (look for "Aqlvoy Sen")
- **Currency** — change `formatCurrency` in `lib/utils.ts`
- **Seed data** — edit `lib/seed-data.ts` (only used on first load)
- **Theme colours** — edit the HSL variables in `app/globals.css`

## Notes

- This is a front-end prototype — closing the browser and clearing storage
  resets everything to the seed.
- All CRUD operations are synchronous and instant since there's no network.
- The "attendance" figure on student detail pages is a static placeholder (85%).
