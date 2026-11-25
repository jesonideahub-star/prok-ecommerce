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
  'Baby Grinder',
  'baby-grinder',
  brands.id,
  'grinder',
  null,
  'https://xmehubjlmawiuaaaqqcm.supabase.co/storage/v1/object/public/Grinders/Eureka%20Grinder/Baby%20Grinder.jpg',
  false,
  false,
  false,
  'manual',
  array['home', 'office'],
  $description$Compact manual coffee grinder with 48 mm conical burrs and a stepped adjustment system for espresso and brew.

Features
Gold Energy Burrs.
Stepped adjustment system for quick and easy grind setting.

Technical Specifications
Burrs: conical; 48 mm diameter.
Dimensions: height 80 mm; width 200 mm; depth 56 mm; weight 760 g.
Bean hopper capacity: 40 g.$description$,
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
  'Eureka Baby Grinder manual coffee grinder',
  true,
  0
from public.products as products
where products.slug = 'baby-grinder'
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
  'Standard Colours',
  null,
  0,
  variants.sort_order
from public.products as products
cross join (
  values
    ('Olive', 0),
    ('Walnut', 1),
    ('Anodized aluminium', 2)
) as variants(name, sort_order)
where products.slug = 'baby-grinder'
  and not exists (
    select 1
    from public.product_variants as existing
    where existing.product_id = products.id
      and existing.name = variants.name
      and existing.option_label = 'Standard Colours'
  );

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
  'Drogheria MCD4',
  'drogheria-mcd4',
  brands.id,
  'grinder',
  null,
  'https://xmehubjlmawiuaaaqqcm.supabase.co/storage/v1/object/public/Grinders/Eureka%20Grinder/Drogheria%20MCD4.jpg',
  false,
  false,
  false,
  'commercial',
  array['cafe', 'restaurant', 'hotel', 'office'],
  $description$Retail coffee grinder with a king-size dial, a blow-up system, and an aluminium body and base.

Features
Stepless Micrometric Regulation System: Precise grind setting.
King-size Dial: Easier adjustment of the grinding degree.
High Speed Maintenance: Handy maintenance operations.
Blow Up System: Helps eliminate coffee retention.
All-purpose grinder with a coffee bag holder.

Technical Specifications
Burrs: flat; 65, 75, or 85 mm diameter; hardened steel.
Display: manual.
Engine: 1290 rpm and 450 W (65 mm burrs); 1430 rpm and 750 W (75 or 85 mm burrs).
Performance: 3–4 espresso / 4–5 brew (65 mm); 5.5–6.5 espresso / 7.5–8.5 brew (75 mm); 9.5–10.5 espresso / 12.5–13.5 brew (85 mm).
Dimensions: height 645 mm; width 184 mm; depth 267 mm; weight 11.5 kg (65 mm), 14 kg (75 mm), or 14.2 kg (85 mm).
Bean hopper capacity: 1.4 kg.$description$,
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
  images.image_src,
  images.alt,
  images.is_primary,
  images.sort_order
from public.products as products
cross join (
  values
    (
      'https://xmehubjlmawiuaaaqqcm.supabase.co/storage/v1/object/public/Grinders/Eureka%20Grinder/Drogheria%20MCD4.jpg',
      'Eureka Drogheria MCD4 grinder in matt black',
      true,
      0
    ),
    (
      'https://www.eureka.co.it/public/catalogo/17-0.jpg',
      'Eureka Drogheria MCD4 grinder in grey',
      false,
      1
    )
) as images(image_src, alt, is_primary, sort_order)
where products.slug = 'drogheria-mcd4'
  and not exists (
    select 1
    from public.product_images as existing
    where existing.product_id = products.id
      and existing.image_src = images.image_src
  );

insert into public.product_variants (
  product_id,
  name,
  color,
  option_label,
  price,
  stock,
  image_src,
  sort_order
)
select
  products.id,
  variants.name,
  variants.name,
  'Standard Colours',
  null,
  0,
  variants.image_src,
  variants.sort_order
from public.products as products
cross join (
  values
    (
      'Matt black',
      'https://xmehubjlmawiuaaaqqcm.supabase.co/storage/v1/object/public/Grinders/Eureka%20Grinder/Drogheria%20MCD4.jpg',
      0
    ),
    (
      'Grey',
      'https://www.eureka.co.it/public/catalogo/17-0.jpg',
      1
    )
) as variants(name, image_src, sort_order)
where products.slug = 'drogheria-mcd4'
  and not exists (
    select 1
    from public.product_variants as existing
    where existing.product_id = products.id
      and existing.name = variants.name
      and existing.option_label = 'Standard Colours'
  );

commit;
