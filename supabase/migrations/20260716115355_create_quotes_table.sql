create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  client_name text not null,
  company_name text,
  currency text not null default 'EUR',
  total numeric(12, 2) not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quotes_slug_idx on public.quotes (slug);
create index if not exists quotes_created_at_idx on public.quotes (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_quotes_updated_at on public.quotes;
create trigger set_quotes_updated_at
before update on public.quotes
for each row
execute function public.set_updated_at();

alter table public.quotes enable row level security;

comment on table public.quotes is 'Growfase proposal generator saved quote definitions, loaded by clean public slug through the application server.';
comment on column public.quotes.data is 'Full generator state used to render the public proposal.';
