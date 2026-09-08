-- Product imagery created in Photoroom is stored separately from commerce metadata.
-- The bucket is public because approved product assets are customer-facing CDN media;
-- publication remains governed by commerce_product_media permissions and catalog gates.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'commerce-product-media',
  'commerce-product-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/avif']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
