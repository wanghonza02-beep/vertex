-- Vertex "Acquire or Commission" consultation system — schema.
-- Run in the Supabase SQL Editor (Project → SQL Editor → New Query → paste
-- this whole file → Run). Safe to re-run — every statement is idempotent,
-- so running it again after a previous run (e.g. to pick up the `location`
-- addition below) is fine and won't touch existing rows beyond backfilling
-- the new column.

-- ============================================================
-- Enum types for `location` columns — Supabase's Table Editor renders an
-- enum column as a dropdown (no free typing), which is the whole point:
-- atelier_city is exactly the 5 real cities (used by consultations, where
-- a booking always targets one specific city); blocked_location adds an
-- extra 'All' option on top of that (used only by blocked_dates, where
-- closing every city at once — e.g. a company holiday — needs to be a
-- selectable choice, not a blank/null field).
-- ============================================================
do $$ begin
  create type public.atelier_city as enum ('Prague', 'Miami', 'Shanghai', 'Tokyo', 'Los Angeles');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.blocked_location as enum ('All', 'Prague', 'Miami', 'Shanghai', 'Tokyo', 'Los Angeles');
exception when duplicate_object then null;
end $$;

-- ============================================================
-- TABLE 1: consultations — confirmed client bookings
-- ============================================================
create table if not exists public.consultations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  path_type text not null check (path_type in ('fleet', 'bespoke')),
  selected_car text null,
  booking_date date not null,
  time_slot text not null check (time_slot in ('09:00-12:00', '12:00-15:00', '15:00-18:00', 'FULL_DAY')),
  amount_paid integer not null check (amount_paid in (500, 2500)),
  stripe_payment_id text null,
  status text default 'confirmed' not null check (status in ('confirmed', 'completed', 'cancelled'))
);

-- Atelier location — each city has its own independent calendar, so a
-- booked slot in Miami has no effect on the same date/time in Tokyo (see
-- the unique index and trigger further down, both scoped by location).
-- Added via ALTER rather than only in the CREATE TABLE above, so this also
-- upgrades a database that already ran an earlier version of this file
-- (including the very first, plain-text-column version — the `using`
-- clause below casts whatever's already there, defaulting missing values
-- to Prague, then converts the column to the atelier_city enum type).
alter table public.consultations add column if not exists location text;
update public.consultations set location = 'Prague' where location is null;
alter table public.consultations drop constraint if exists consultations_location_check;
alter table public.consultations alter column location type public.atelier_city using location::public.atelier_city;
alter table public.consultations alter column location set not null;

-- ============================================================
-- TABLE 2: fleet_cars — catalog of the 12 showcase models
-- ============================================================
create table if not exists public.fleet_cars (
  id uuid default gen_random_uuid() primary key,
  brand text not null,
  project_name text not null unique,
  is_available boolean default true not null,
  created_at timestamptz default now() not null
);

-- ============================================================
-- TABLE 3: blocked_dates — manual Atelier calendar closures
-- Insert one row here to close a branch for a whole period at once (e.g. a
-- staff party) instead of needing one row per day: set start_date/end_date
-- to the first/last closed day (a single day is start_date = end_date).
-- ============================================================
create table if not exists public.blocked_dates (
  id uuid default gen_random_uuid() primary key,
  start_date date not null,
  end_date date not null,
  reason text null,
  -- 'All' closes that period for every location (e.g. a company-wide
  -- holiday); a specific city closes only that city's calendar. An enum,
  -- not plain text, so Table Editor → Insert row shows this as a dropdown
  -- (Prague / Miami / Shanghai / Tokyo / Los Angeles / All) instead of a
  -- free-text field you'd have to type into correctly.
  location public.blocked_location not null default 'All',
  created_at timestamptz default now() not null
);

-- Upgrades a database that already ran an earlier version of this table —
-- only runs the pieces that still apply, so this is a no-op on a database
-- already fully migrated.
do $$
begin
  -- Earlier version used one row per day (`blocked_date`) instead of a
  -- start_date/end_date range.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blocked_dates' and column_name = 'blocked_date'
  ) then
    alter table public.blocked_dates add column if not exists start_date date;
    alter table public.blocked_dates add column if not exists end_date date;
    update public.blocked_dates set start_date = blocked_date, end_date = blocked_date where start_date is null;
    alter table public.blocked_dates alter column start_date set not null;
    alter table public.blocked_dates alter column end_date set not null;
    drop index if exists blocked_dates_date_location_idx;
    alter table public.blocked_dates drop column blocked_date;
  end if;

  -- Earlier version had `location` as free text, with null meaning "all
  -- locations" — converts it to the blocked_location enum, mapping any
  -- null (or blank) value to the explicit 'All' choice.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blocked_dates'
      and column_name = 'location' and data_type <> 'USER-DEFINED'
  ) then
    update public.blocked_dates set location = 'All' where location is null or location = '';
    alter table public.blocked_dates alter column location type public.blocked_location using location::public.blocked_location;
    alter table public.blocked_dates alter column location set default 'All';
    alter table public.blocked_dates alter column location set not null;
  end if;
end $$;

do $$ begin
  alter table public.blocked_dates add constraint blocked_dates_range_check check (end_date >= start_date);
exception when duplicate_object then null;
end $$;

create index if not exists blocked_dates_range_idx on public.blocked_dates (start_date, end_date);

-- Example — closes Miami from Sep 12 to Sep 14 for a staff party (use
-- location = 'All' instead of 'Miami' to close every city for that
-- period). Easiest done via Table Editor → blocked_dates → Insert row,
-- where `location` shows up as a dropdown — this query is just the SQL
-- Editor equivalent. This table is never written to by the app itself,
-- only by you.
-- insert into public.blocked_dates (start_date, end_date, location, reason)
--   values ('2026-09-12', '2026-09-14', 'Miami', 'Staff party');

-- ============================================================
-- Indexes — fast calendar lookups against consultations
-- ============================================================
create index if not exists consultations_booking_date_idx on public.consultations (booking_date);
create index if not exists consultations_time_slot_idx on public.consultations (time_slot);

-- ============================================================
-- Row Level Security
-- The browser (anon key) only ever needs to READ from all three tables —
-- to gray out taken slots, list the fleet catalog, and skip closed dates.
-- No insert policy for anon/authenticated on consultations: the ONLY
-- writer is api/webhooks/stripe.js, using the service_role key (bypasses
-- RLS) — a booking can only ever be created after a real Stripe payment.
-- fleet_cars/blocked_dates are maintained by you directly in the Supabase
-- dashboard, which also bypasses RLS.
-- ============================================================
alter table public.consultations enable row level security;
alter table public.fleet_cars enable row level security;
alter table public.blocked_dates enable row level security;

drop policy if exists "Public can read confirmed consultations" on public.consultations;
create policy "Public can read confirmed consultations"
  on public.consultations for select
  using (status = 'confirmed');

drop policy if exists "Public can read fleet catalog" on public.fleet_cars;
create policy "Public can read fleet catalog"
  on public.fleet_cars for select
  using (true);

drop policy if exists "Public can read blocked dates" on public.blocked_dates;
create policy "Public can read blocked dates"
  on public.blocked_dates for select
  using (true);

-- Ran an even earlier version of this file that let the browser insert
-- directly? This removes that policy — booking creation is Stripe-only now.
drop policy if exists "Public can create a booking" on public.consultations;

-- ============================================================
-- Booking integrity — prevents double-booking when two visitors submit the
-- same slot (in the same city) at nearly the same instant. A read-then-
-- write check in application code can't be atomic across two separate
-- requests; both of these are, because Postgres enforces them at insert
-- time. Scoped by `location` throughout — this is the piece that actually
-- makes each city's calendar independent.
-- ============================================================

-- Exact duplicate (same date + same slot + same city) — the second insert
-- fails with a unique_violation (23505) instead of silently duplicating.
drop index if exists consultations_no_duplicate_slot;
create unique index if not exists consultations_no_duplicate_slot
  on public.consultations (booking_date, time_slot, location)
  where status = 'confirmed';

-- Cross-slot mutual exclusion (a Fleet slot blocks Bespoke for that date
-- AND CITY, and vice versa) spans different time_slot values, so a plain
-- unique index can't express it — a trigger makes this atomic too. Reuses
-- the 23505 error code so the API layer (api/webhooks/stripe.js) and the
-- frontend both handle it the same way as the plain duplicate case above.
create or replace function public.check_booking_conflict()
returns trigger as $$
begin
  if new.status <> 'confirmed' then
    return new;
  end if;

  if new.time_slot = 'FULL_DAY' then
    if exists (
      select 1 from public.consultations
      where booking_date = new.booking_date and location = new.location and status = 'confirmed'
    ) then
      raise exception 'This date is no longer available for a Bespoke Commission in %.', new.location using errcode = '23505';
    end if;
  else
    if exists (
      select 1 from public.consultations
      where booking_date = new.booking_date and location = new.location and status = 'confirmed' and time_slot = 'FULL_DAY'
    ) then
      raise exception 'This date is fully allocated to a Bespoke Commission in %.', new.location using errcode = '23505';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists consultations_check_conflict on public.consultations;
create trigger consultations_check_conflict
  before insert on public.consultations
  for each row execute function public.check_booking_conflict();

-- ============================================================
-- TABLE 4: newsletter_subscribers — footer "Stay Connected" signups
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  email text not null unique
);

alter table public.newsletter_subscribers enable row level security;

-- The browser (anon key) is allowed to INSERT (anyone can subscribe) but
-- never SELECT — subscriber emails are only ever visible to you, in the
-- Supabase dashboard's Table Editor (which bypasses RLS as the project
-- owner), never readable from the public site.
drop policy if exists "Public can subscribe" on public.newsletter_subscribers;
create policy "Public can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- ============================================================
-- Optional seed data — populates fleet_cars from the 12 cars already in
-- src/fleetData.js so Step 2's dropdown has real rows to show on
-- localhost. Safe to re-run (project_name is unique, so a second run is a
-- no-op) and safe to skip if you'd rather enter your own catalog by hand.
-- ============================================================
insert into public.fleet_cars (brand, project_name) values
  ('PORSCHE', 'PROJECT NIGHTHAWK'),
  ('LAMBORGHINI', 'PROJECT CHERRY BLOSSOM'),
  ('FERRARI', 'PROJECT PEACH'),
  ('LOTUS', 'PROJECT SHADOW'),
  ('ASTON MARTIN', 'PROJECT VANGUARD'),
  ('MCLAREN', 'PROJECT APEX'),
  ('MERCEDES-AMG', 'PROJECT STEALTH'),
  ('AUDI', 'PROJECT CYBERLINE'),
  ('NISSAN', 'PROJECT DRIFT KING'),
  ('FORD', 'PROJECT MACH 1'),
  ('BUGATTI', 'PROJECT PHANTOM'),
  ('KOENIGSEGG', 'PROJECT GHOST')
on conflict (project_name) do nothing;
