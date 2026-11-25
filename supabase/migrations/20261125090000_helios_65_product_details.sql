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
  'Helios 65',
  'helios-65',
  brands.id,
  'grinder',
  null,
  'https://xmehubjlmawiuaaaqqcm.supabase.co/storage/v1/object/public/Grinders/Eureka%20Grinder/Helios-65.jpg',
  false,
  false,
  false,
  'commercial',
  array['cafe', 'restaurant', 'hotel', 'office'],
  $description$Commercial grinder with an electronic display, high-speed grind dispersion, and precision adjustment.

Features
High Speed Grind Dispersion: Reduced dispensing time.
Stepless Micrometric Regulation System: Precise grind setting.
High Speed Maintenance: Handy and easy maintenance operations.
ACE System: Anti-clumps and electrostaticity control.
All-Purpose Adjustable Hands-Free Fork: Robust and easy to regulate.
Touch screen with 3 doses and continuous mode.
Maintenance alert customised for burr type.
Dose pre-selection can be activated or deactivated.
Three grinding activation modes: microswitch, touch screen, or both.
Total Control System with password-protected advanced settings.
Adjustable and removable outlet chute.
Bean hopper security system.

Technical Specifications
Burrs: flat; 65 mm diameter; hardened steel.
Dispensing system: dose counter; spotlight on filter holder.
Engine: 1370 rpm; 280 W absorbed power.
Display: electronic program.
Performance: productivity 3.5–5.
Dimensions: height 600 mm; width 220 mm; depth 250 mm; weight 12 kg.
Bean hopper capacity: 1.2 kg.$description$,
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
  'Eureka Helios 65 commercial coffee grinder',
  true,
  0
from public.products as products
where products.slug = 'helios-65'
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
  variants.color,
  variants.option_label,
  null,
  0,
  variants.sort_order
from public.products as products
cross join (
  values
    ('Matt black', 'Matt black', 'Standard Colour', 0),
    ('Grey', 'Grey', 'Standard Colour', 1),
    ('White', 'White', 'Standard Colour', 2),
    ('Ferrari red', 'Ferrari red', 'Standard Colour', 3),
    ('Yellow', 'Yellow', 'Special Colour', 4),
    ('Chrome', 'Chrome', 'Special Colour', 5)
) as variants(name, color, option_label, sort_order)
where products.slug = 'helios-65'
  and not exists (
    select 1
    from public.product_variants as existing
    where existing.product_id = products.id
      and existing.name = variants.name
      and existing.option_label = variants.option_label
  );

commit;
