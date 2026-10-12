-- Jalankan di Supabase SQL Editor setelah supabase-aresternews.sql.
create table if not exists public.aresternews_article_views (
  article_id uuid primary key references public.aresternews_articles(id) on delete cascade,
  view_count bigint not null default 0 check (view_count >= 0),
  updated_at timestamptz not null default now()
);
alter table public.aresternews_article_views enable row level security;
drop policy if exists "Public can read published article views" on public.aresternews_article_views;
create policy "Public can read published article views"
on public.aresternews_article_views for select to anon, authenticated
using (exists (select 1 from public.aresternews_articles a where a.id = article_id and a.status = 'published'));
grant select on public.aresternews_article_views to anon, authenticated;
revoke insert, update, delete on public.aresternews_article_views from anon, authenticated;
create or replace function public.record_aresternews_article_view(p_article_id uuid)
returns bigint language plpgsql security definer set search_path = public as $$
declare new_count bigint;
begin
  if not exists (select 1 from public.aresternews_articles where id = p_article_id and status = 'published') then return null; end if;
  insert into public.aresternews_article_views (article_id, view_count, updated_at) values (p_article_id, 1, now())
  on conflict (article_id) do update set view_count = public.aresternews_article_views.view_count + 1, updated_at = now()
  returning view_count into new_count;
  return new_count;
end; $$;
revoke all on function public.record_aresternews_article_view(uuid) from public;
grant execute on function public.record_aresternews_article_view(uuid) to anon, authenticated;
