begin;

insert into public.products (
  name,
  slug,
  brand_id,
  category,
  price,
  image_src,
  is_new,
  is_featured,
  is_top_seller,
  series,
  uses,
  description,
  sku,
  stock,
  status
)
select
  'Atom Touch 65',
  'atom-touch-65',
  brands.id,
  'grinder',
  null,
  'https://xmehubjlmawiuaaaqqcm.supabase.co/storage/v1/object/public/Grinders/Eureka%20Grinder/atom%20w%2065.jpg',
  false,
  false,
  false,
  'commercial',
  array['cafe', 'restaurant', 'hotel'],
  $description$Commercial on-demand grinder with a touchscreen display, precision grinding, and a compact design.

Features
Silent Technology: Quiet grinding for noise-sensitive environments.
High Speed Grind Dispersion: Reduced dispensing time.
Stepless Micrometric Regulation System: Precise grind setting.
High Speed Maintenance: Handy and easy maintenance operations.
ACE System: Anti-clumps and electrostaticity control.
All-Purpose Adjustable Hands-Free Fork: Useful, robust, and easy to regulate.
IPS touch display.

Technical Specifications
Burrs: flat; 65 mm diameter; hardened steel.
Dispensing system: dose counter; spotlight on filter holder.
Engine: 1370 rpm; 280 W absorbed power.
Display: IPS touch display.
Performance: productivity 2–3.5.
Dimensions: height 425 mm; width 180 mm; depth 240 mm; weight 9.5 kg.
Bean hopper capacity: 300 g.$description$,
  null,
  0,
  'published'
from public.brands as brands
where brands.slug = 'eureka-1920'
on conflict (slug) do update set
  name = excluded.name,
  brand_id = excluded.brand_id,
  category = excluded.category,
  image_src = excluded.image_src,
  series = excluded.series,
  uses = excluded.uses,
  description = excluded.description,
  status = excluded.status;

insert into public.product_images (
  product_id,
  image_src,
  alt,
  is_primary,
  sort_order
)
select
  products.id,
  products.image_src,
  'Eureka Atom Touch 65 commercial coffee grinder',
  true,
  0
from public.products as products
where products.slug = 'atom-touch-65'
  and not exists (
    select 1
    from public.product_images as images
    where images.product_id = products.id
      and images.image_src = products.image_src
  );

insert into public.product_variants (
  product_id,
  name,
  color,
  option_label,
  price,
  stock,
  sort_order
)
select
  products.id,
  variants.name,
  variants.name,
  variants.option_label,
  null,
  0,
  variants.sort_order
from public.products as products
cross join (
  values
    ('Matt black', 'Standard Colours', 0),
    ('Grey', 'Standard Colours', 1),
    ('White', 'Standard Colours', 2),
    ('Ferrari red', 'Standard Colours', 3),
    ('Chrome', 'Special Colours', 4)
) as variants(name, option_label, sort_order)
where products.slug = 'atom-touch-65'
  and not exists (
    select 1
    from public.product_variants as existing
    where existing.product_id = products.id
      and existing.name = variants.name
      and existing.option_label = variants.option_label
  );

commit;
