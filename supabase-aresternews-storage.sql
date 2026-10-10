-- ARESTERnews cover image storage setup
-- Run once in Supabase Dashboard > SQL Editor.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('aresternews-covers', 'aresternews-covers', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "ARESTERnews public read covers" on storage.objects;
create policy "ARESTERnews public read covers"
on storage.objects for select
to public
using (bucket_id = 'aresternews-covers');

drop policy if exists "ARESTERnews admin upload covers" on storage.objects;
create policy "ARESTERnews admin upload covers"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'aresternews-covers'
  and lower(coalesce(auth.jwt() ->> 'email','')) = 'styxxaether@gmail.com'
);

drop policy if exists "ARESTERnews admin update covers" on storage.objects;
create policy "ARESTERnews admin update covers"
on storage.objects for update
to authenticated
using (
  bucket_id = 'aresternews-covers'
  and lower(coalesce(auth.jwt() ->> 'email','')) = 'styxxaether@gmail.com'
)
with check (
  bucket_id = 'aresternews-covers'
  and lower(coalesce(auth.jwt() ->> 'email','')) = 'styxxaether@gmail.com'
);

drop policy if exists "ARESTERnews admin delete covers" on storage.objects;
create policy "ARESTERnews admin delete covers"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'aresternews-covers'
  and lower(coalesce(auth.jwt() ->> 'email','')) = 'styxxaether@gmail.com'
);
