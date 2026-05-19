create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default timezone('utc', now()),
  user_id uuid references auth.users (id) on delete cascade
);

create index if not exists notes_created_at_idx on public.notes (created_at desc);

alter table public.notes enable row level security;

create policy "Authenticated users can read notes"
  on public.notes
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert notes"
  on public.notes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notes'
  ) then
    alter publication supabase_realtime add table public.notes;
  end if;
end
$$;
