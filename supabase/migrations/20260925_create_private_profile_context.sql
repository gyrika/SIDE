create table public.private_profile_context (
  id uuid primary key references auth.users (id) on delete cascade,
  study_or_work text not null default '' check (char_length(study_or_work) <= 500),
  strengths_or_learning text not null default '' check (char_length(strengths_or_learning) <= 500),
  interests text not null default '' check (char_length(interests) <= 500),
  connection_goals text not null default '' check (char_length(connection_goals) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.private_profile_context enable row level security;

revoke all on table public.private_profile_context from anon, authenticated;
grant select, insert on table public.private_profile_context to authenticated;
grant update (study_or_work, strengths_or_learning, interests, connection_goals)
on table public.private_profile_context to authenticated;

create policy "Users can read their own private profile context"
on public.private_profile_context
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert their own private profile context"
on public.private_profile_context
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own private profile context"
on public.private_profile_context
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create function public.set_private_profile_context_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_private_profile_context_updated_at
before update on public.private_profile_context
for each row
execute function public.set_private_profile_context_updated_at();
