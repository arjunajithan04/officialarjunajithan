-- =========================================================
-- PROJECT IMAGES / SUPABASE STORAGE
-- Run this in Supabase SQL Editor before using the new picker.
-- Replace ADMIN_USER_UUID with the UUID of your admin Auth user.
-- =========================================================

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- Public visitors can read project images.
drop policy if exists "Project images are publicly readable" on storage.objects;
create policy "Project images are publicly readable"
on storage.objects
for select
to public
using (bucket_id = 'project-images');

-- Only the portfolio admin can upload project images.
drop policy if exists "Admin can upload project images" on storage.objects;
create policy "Admin can upload project images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and auth.uid() = 'ADMIN_USER_UUID'
);

-- Only the portfolio admin can replace/update project images.
drop policy if exists "Admin can update project images" on storage.objects;
create policy "Admin can update project images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-images'
  and auth.uid() = 'ADMIN_USER_UUID'
)
with check (
  bucket_id = 'project-images'
  and auth.uid() = 'ADMIN_USER_UUID'
);

-- Only the portfolio admin can delete project images.
drop policy if exists "Admin can delete project images" on storage.objects;
create policy "Admin can delete project images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-images'
  and auth.uid() = 'ADMIN_USER_UUID'
);
