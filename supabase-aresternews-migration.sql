-- Jalankan sekali di Supabase Dashboard > SQL Editor.
-- Menambahkan metadata berita tanpa menghapus berita lama.
alter table public.aresternews_articles
  add column if not exists category text not null default 'Lainnya',
  add column if not exists author_name text not null default '',
  add column if not exists location text not null default '',
  add column if not exists tags text not null default '',
  add column if not exists source_name text not null default '',
  add column if not exists source_url text not null default '';
