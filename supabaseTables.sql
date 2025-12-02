-- Tables (run if not created yet)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  created_at timestamptz default now()
);

create table if not exists public.collector_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  owner_name text,
  registration_number text,
  phone text,
  email text,
  service_areas jsonb default '[]'::jsonb,
  bank_account_name text,
  bank_account_number text,
  bank_name text,
  verification_status text default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS
alter table if exists public.user_profiles disable row level security;
alter table if exists public.collector_profiles disable row level security;

-- user_profiles policies (use uuid cast)
drop policy if exists user_profiles_insert_owner on public.user_profiles;
create policy user_profiles_insert_owner on public.user_profiles
  for insert
  with check (auth.role() = 'authenticated' AND id = auth.uid()::uuid);

drop policy if exists user_profiles_select_owner on public.user_profiles;
create policy user_profiles_select_owner on public.user_profiles
  for select
  using (id = auth.uid()::uuid);

drop policy if exists user_profiles_update_owner on public.user_profiles;
create policy user_profiles_update_owner on public.user_profiles
  for update
  using (id = auth.uid()::uuid)
  with check (id = auth.uid()::uuid);

-- collector_profiles policies (use uuid cast)
drop policy if exists collector_profiles_insert_owner on public.collector_profiles;
create policy collector_profiles_insert_owner on public.collector_profiles
  for insert
  with check (auth.role() = 'authenticated' AND id = auth.uid()::uuid);

drop policy if exists collector_profiles_select_owner on public.collector_profiles;
create policy collector_profiles_select_owner on public.collector_profiles
  for select
  using (id = auth.uid()::uuid);

drop policy if exists collector_profiles_update_owner on public.collector_profiles;
create policy collector_profiles_update_owner on public.collector_profiles
  for update
  using (id = auth.uid()::uuid)
  with check (id = auth.uid()::uuid);