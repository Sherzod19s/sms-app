create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text not null check (role in ('admin', 'teacher')) default 'teacher',
  created_at timestamptz default now()
);
create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  teacher_id uuid references profiles(id) on delete set null,
  schedule_days text[] not null default '{}',
  max_capacity int not null default 20,
  room text,
  color text,
  created_at timestamptz default now()
);
create table students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age int not null,
  class_id uuid references classes(id) on delete set null,
  parent_name text,
  parent_contact text,
  enrollment_date date not null default current_date,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz default now()
);
create table invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  description text not null,
  amount numeric(10,2) not null,
  amount_paid numeric(10,2) not null default 0,
  status text not null check (status in ('Paid', 'Unpaid', 'Partial')) default 'Unpaid',
  issue_date date not null default current_date,
  due_date date not null,
  created_at timestamptz default now()
);
create table expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null,
  amount numeric(10,2) not null,
  date date not null,
  created_at timestamptz default now()
);
create table sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  teacher_id uuid references profiles(id) on delete set null,
  date date not null,
  start_time text not null,
  end_time text not null,
  room text,
  created_at timestamptz default now()
);
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table students enable row level security;
alter table classes enable row level security;
alter table invoices enable row level security;
alter table expenses enable row level security;
alter table sessions enable row level security;
-- Profiles policies
create policy "admins manage profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "users read own profile" on profiles for select using (auth.uid() = id);
-- Students policies
create policy "admins manage students" on students for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "teachers read students" on students for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);
-- Classes policies
create policy "admins manage classes" on classes for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "teachers read classes" on classes for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);
-- Invoices policies
create policy "admins manage invoices" on invoices for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "teachers read invoices" on invoices for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);
-- Expenses policies
create policy "admins manage expenses" on expenses for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "teachers read expenses" on expenses for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);
-- Sessions policies
create policy "admins manage sessions" on sessions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "teachers read sessions" on sessions for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);
