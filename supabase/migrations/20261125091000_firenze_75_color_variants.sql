begin;

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
  'Standard Colours',
  null,
  0,
  variants.sort_order
from public.products as products
cross join (
  values
    ('Matt black', 0),
    ('White', 1)
) as variants(name, sort_order)
where products.slug = 'firenze-75'
  and not exists (
    select 1
    from public.product_variants as existing
    where existing.product_id = products.id
      and existing.name = variants.name
      and existing.option_label = 'Standard Colours'
  );

commit;
