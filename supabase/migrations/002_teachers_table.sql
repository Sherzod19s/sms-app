-- Migration 002 — Teachers as a regular table, decoupled from auth.
--
-- Rationale: in the original schema, "teachers" were profiles with role='teacher'.
-- That meant the admin couldn't onboard a teacher directly from the UI (creating
-- a profile requires an auth.users row, which requires the service role key).
-- This migration introduces a plain `teachers` table that is purely data —
-- admins can CRUD teachers from the app like any other record.
--
-- Classes and sessions are repointed to reference this new table.

create table teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  subject text,
  contact text,
  join_date date not null default current_date,
  created_at timestamptz default now()
);

-- Repoint foreign keys: classes.teacher_id and sessions.teacher_id used to
-- reference profiles(id). Switch them to teachers(id).
alter table classes drop constraint if exists classes_teacher_id_fkey;
alter table classes
  add constraint classes_teacher_id_fkey
  foreign key (teacher_id) references teachers(id) on delete set null;

alter table sessions drop constraint if exists sessions_teacher_id_fkey;
alter table sessions
  add constraint sessions_teacher_id_fkey
  foreign key (teacher_id) references teachers(id) on delete set null;

-- Any existing classes/sessions that pointed at a profile UUID now point at
-- something that doesn't exist in teachers. Null them out so the FK is valid.
update classes  set teacher_id = null where teacher_id is not null;
update sessions set teacher_id = null where teacher_id is not null;

-- RLS — same model as the other tables: admins write, teachers read.
alter table teachers enable row level security;

create policy "admins manage teachers" on teachers
  for all
  using (public.is_admin());

create policy "teachers read teachers" on teachers
  for select
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
  );
