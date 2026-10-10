-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor.
create table if not exists public.aresternews_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_url text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text not null default ''
);

alter table public.aresternews_articles enable row level security;

drop policy if exists "Published articles are public"
  on public.aresternews_articles;
create policy "Published articles are public"
on public.aresternews_articles for select
to anon, authenticated
using (
  status = 'published'
  or lower(coalesce(auth.jwt() ->> 'email', '')) = 'styxxaether@gmail.com'
);

drop policy if exists "Admin can insert articles"
  on public.aresternews_articles;
create policy "Admin can insert articles"
on public.aresternews_articles for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'styxxaether@gmail.com'
);

drop policy if exists "Admin can update articles"
  on public.aresternews_articles;
create policy "Admin can update articles"
on public.aresternews_articles for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'styxxaether@gmail.com'
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'styxxaether@gmail.com'
);

drop policy if exists "Admin can delete articles"
  on public.aresternews_articles;
create policy "Admin can delete articles"
on public.aresternews_articles for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'styxxaether@gmail.com'
);

create index if not exists aresternews_status_published_idx
on public.aresternews_articles (status, published_at desc);
