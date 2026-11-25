"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Coffee,
  Utensils,
  Wrench,
} from "lucide-react";

import { CatalogAd } from "@/components/ads/catalog-ad";
import { createClient } from "@/lib/supabase/client";
import {
  brandCatalog,
  brandLogos,
  brandSlug,
} from "@/lib/site";

type SortKey = "default" | "az" | "za";
type BrandProduct = { name: string; brand: string; src: string };
const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;
const didiesseViewSuffix = /\s+(FR|LAT\s+(?:DX|SX)|TREQUA)$/i;

function didiesseProductGroup(name: string) {
  return name.replace(didiesseViewSuffix, "").trim();
}

function didiesseImagePriority(name: string) {
  if (/\s+FR$/i.test(name)) return 0;
  if (didiesseProductGroup(name) === name) return 1;
  return 2;
}

function groupDidiesseProducts(products: BrandProduct[]) {
  const grouped = new Map<string, BrandProduct>();

  for (const product of products) {
    const name = didiesseProductGroup(product.name);
    const key = brandSlug(name);
    const existing = grouped.get(key);

    if (
      !existing ||
      didiesseImagePriority(product.name) < didiesseImagePriority(existing.name)
    ) {
      grouped.set(key, { ...product, name });
    }
  }

  return [...grouped.values()];
}

function brandLabelFromSlug(slug?: string) {
  if (!slug) return undefined;
  if (slug === "didiesse") return "Didiesse";
  return brandLogos.find((brand) => brandSlug(brand.name) === slug)?.name;
}

const brandBoardLogos = [
  { name: "Catcher Gourmet", src: "/images/brand-catcher-official.png", width: 1164, height: 437 },
  { name: "Casadio", src: "/images/brand-casadio-official.png", width: 1405, height: 688 },
  { name: "Eureka 1920", src: "/images/brand-eureka-official.png", width: 782, height: 768 },
  { name: "Slayer", src: "/images/brand-slayer-official.png", width: 2000, height: 450 },
  { name: "La Nuova Era", src: "/images/brand-lanuovaera-official.png", width: 2558, height: 768 },
  { name: "Marcafé", src: "/images/marcafe-logo.png", width: 1536, height: 1024 },
  { name: "puly CAFF", src: "/images/brand-pulycaff-official.png", width: 354, height: 236 },
  { name: "didiesse", src: "/images/brand-didiesse-official.png", width: 602, height: 212 },
  { name: "BEOBE", src: "/images/brand-beobe.png", width: 1191, height: 460 },
  { name: "WEGA", src: "/images/brand-wega.png", width: 2053, height: 768 },
  { name: "ORSA Drinks", src: "/images/brand-orsa-drinks.png", width: 1897, height: 768 },
  { name: "TORQ Blender", src: "/images/brand-torq.png", width: 1086, height: 768 },
] as const;

const productCategories = [
  {
    title: "Espresso Machines",
    description: "Performance in every cup.",
    label: "View Machines",
    href: "/espresso-machines",
    src: "/images/product-la-nuova-era-altea-root.png",
    alt: "La Nuova Era espresso machine",
    imageClass: "object-contain p-1",
    icon: Coffee,
  },
  {
    title: "Grinders",
    description: "Precision grinding for superior taste.",
    label: "View Grinders",
    href: "/grinders",
    src: "/images/product-eureka-bravo.png",
    alt: "Eureka coffee grinder",
    imageClass: "object-contain p-1",
    icon: Wrench,
  },
  {
    title: "Coffee",
    description: "Exceptional beans for extraordinary coffee.",
    label: "View Coffee",
    href: "/coffee",
    src: "/images/product-marcafe-classico.png",
    alt: "Marcafé coffee beans",
    imageClass: "object-contain p-1",
    icon: Coffee,
  },
  {
    title: "Flavours & Sauces",
    description: "Add flavour to your creations.",
    label: "View Flavours",
    href: "/flavours",
    src: "/images/syrup-irish-cream.png",
    alt: "Catcher Gourmet flavour syrup",
    imageClass: "object-contain p-1",
    icon: Utensils,
  },
  {
    title: "Pulycaff",
    description: "Professional coffee equipment cleaning solutions.",
    label: "View Pulycaff",
    href: "/cleaning-solution",
    src: "/images/puly-caff-plus-nsf.png",
    alt: "Puly Caff coffee equipment cleaner",
    imageClass: "object-contain p-1",
    icon: Wrench,
  },
] as const;

export function BrandsPage({ brand }: { brand?: string }) {
  const [sort, setSort] = useState<SortKey>("default");
  const [didiesseProducts, setDidiesseProducts] = useState<BrandProduct[]>([]);
  const [isLoadingDidiesse, setIsLoadingDidiesse] = useState(false);
  const [didiesseLoadError, setDidiesseLoadError] = useState<string | null>(null);
  const selectedBrand = brandLabelFromSlug(brand);
  const isDidiesse = brand === brandSlug("didiesse");

  useEffect(() => {
    if (!isDidiesse) return;

    let active = true;
    async function loadDidiesseProducts() {
      setIsLoadingDidiesse(true);
      setDidiesseLoadError(null);
      try {
        const bucket = createClient().storage.from("Espresso_Machines");

        async function listDirectory(path: string) {
          const entries = [];
          const limit = 1000;

          for (let offset = 0; ; offset += limit) {
            const { data, error } = await bucket.list(path, {
              limit,
              offset,
              sortBy: { column: "name", order: "asc" },
            });
            if (error) throw error;
            entries.push(...(data ?? []));
            if (!data || data.length < limit) break;
          }

          return entries;
        }

        async function walk(path: string): Promise<BrandProduct[]> {
          const entries = await listDirectory(path);
          const products: BrandProduct[] = [];

          for (const entry of entries) {
            const objectPath = `${path}/${entry.name}`;
            if (entry.id === null) {
              products.push(...(await walk(objectPath)));
              continue;
            }
            if (!imageExtensions.test(entry.name)) continue;

            products.push({
              name: entry.name.replace(imageExtensions, "").replace(/[_-]+/g, " ").trim(),
              brand: "Didiesse",
              src: bucket.getPublicUrl(objectPath).data.publicUrl,
            });
          }

          return products;
        }

        const products = await walk("Didiesse");
        if (active) setDidiesseProducts(products);
      } catch (error) {
        console.error("Unable to load Didiesse products from the Espresso_Machines bucket.", error);
        if (active) {
          setDidiesseLoadError(
            "Didiesse products could not be loaded from the Espresso_Machines bucket. Please try again later."
          );
        }
      } finally {
        if (active) setIsLoadingDidiesse(false);
      }
    }

    void loadDidiesseProducts();
    return () => {
      active = false;
    };
  }, [isDidiesse]);

  const items = useMemo(() => {
    const next: BrandProduct[] = isDidiesse
      ? groupDidiesseProducts(didiesseProducts)
      : brand
      ? brandCatalog.filter((item) => brandSlug(item.brand) === brand)
      : [...brandCatalog];

    if (sort === "az") {
      next.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "za") {
      next.sort((a, b) => b.name.localeCompare(a.name));
    }
    return next;
  }, [brand, didiesseProducts, isDidiesse, sort]);

  return (
    <main className="flex-1 overflow-hidden bg-[#fff7f5] text-[#30231e]">
      <section className="relative isolate min-h-[245px] overflow-hidden border-b border-[#f2b9bc] sm:min-h-[270px]">
        <Image
          src="/images/hero-slayer-steam.png"
          alt="A Slayer espresso machine showcased for café professionals"
          fill
          priority
          className="object-cover object-[75%_52%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,244,245,.99)_0%,rgba(255,244,245,.98)_42%,rgba(255,244,245,.9)_56%,rgba(255,244,245,.38)_75%,rgba(255,244,245,.04)_92%)]" />
        <div className="absolute -left-16 top-1/2 size-[340px] -translate-y-1/2 rounded-full border-[34px] border-[#ed1740]/10" />
        <div className="relative mx-auto flex min-h-[245px] max-w-[1280px] items-center px-5 py-7 sm:min-h-[270px] sm:px-8 lg:px-10">
          <div className="max-w-[570px]">
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-[#b20f26] uppercase">
              Our Brands <span className="h-px w-32 bg-[#d68b82]" />
            </p>
            <h1 className="mt-1 font-serif text-[40px] leading-[0.92] font-bold tracking-tight sm:text-[46px]">
              Trusted Brands.
              <span className="block text-[40px] font-semibold italic text-[#d0122d] sm:text-[46px]">
                Exceptional Quality.
              </span>
            </h1>
            <p className="mt-3 max-w-[390px] text-[13px] leading-[1.35] text-[#392d28]">
              At Prokrate Trading Corporation, we partner with the world’s most
              respected brands to bring you premium coffee solutions for homes,
              businesses, and coffee professionals.
            </p>
            <Link
              href="#our-brands"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#d0122d] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#a91020]"
            >
              Explore Our Brands <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="our-brands" className="px-4 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 overflow-hidden rounded-[20px] border border-[#f2ded7] bg-white/90 shadow-[0_8px_24px_rgba(114,39,35,.06)] sm:grid-cols-4 lg:grid-cols-6">
          {brandBoardLogos.map((logo, index) => {
            const brandLink = brandLogos.find((item) => item.name === logo.name);

            return (
              <Link
                key={logo.name}
                href={brandLink?.href ?? "/brands#our-brands"}
                aria-label={`Explore ${logo.name}`}
                className={`flex h-[88px] items-center justify-center px-3 py-2 transition hover:bg-[#fff1f1] sm:h-[98px] lg:h-[104px] ${
                  index % 2 === 1 ? "border-l border-[#d5c7bf]" : ""
                } ${
                  index % 4 === 0
                    ? "sm:border-l-0"
                    : "sm:border-l sm:border-[#d5c7bf]"
                } ${
                  index % 6 === 0
                    ? "lg:border-l-0"
                    : "lg:border-l lg:border-[#d5c7bf]"
                }`}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-full max-h-[72px] w-full object-contain"
                  sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section
        id="brand-products"
        className="mx-auto max-w-[1280px] px-4 pt-7 pb-10 sm:px-6 md:pb-12 lg:px-8"
      >
          <div className="flex flex-col justify-between gap-4 border-t border-[#e6a1a0] pt-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#b20f26] uppercase">
                {selectedBrand ? `${selectedBrand} Collection` : "Full Collection"}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#30231e] sm:text-3xl">
                {selectedBrand ? `${selectedBrand} Products` : "All Products"}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="brand-sort" className="text-sm text-[#463b35]">
                Sort by:
              </label>
              <div className="relative">
                <select
                  id="brand-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="h-10 w-full min-w-0 appearance-none rounded-md border border-[#ead8cc] bg-white px-3 pr-9 text-sm text-[#5d514b] outline-none focus:border-[#d0122d] sm:w-[220px]"
                >
                  <option value="default">Choose an option...</option>
                  <option value="az">Name A–Z</option>
                  <option value="za">Name Z–A</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-[#8b7b72]" />
              </div>
            </div>
          </div>

          {isLoadingDidiesse ? (
            <p role="status" className="mt-8 rounded-[20px] border border-[#f2ded7] bg-white/80 p-6 text-sm text-[#5d514b]">
              Loading all Didiesse products…
            </p>
          ) : didiesseLoadError ? (
            <p role="alert" className="mt-8 rounded-[20px] border border-[#f2ded7] bg-white/80 p-6 text-sm text-[#5d514b]">
              {didiesseLoadError}
            </p>
          ) : items.length ? (
            <>
              <div className="mt-6">
                <CatalogAd />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {items.map((item, index) => (
                  <article
                    key={`${item.brand}-${item.name}`}
                    className="flex aspect-[3/4] flex-col overflow-hidden rounded-[18px] border border-[#f0dfd7] bg-white shadow-[0_8px_24px_rgba(114,39,35,.05)]"
                  >
                    <div className="relative min-h-0 flex-1">
                      <Image
                        src={item.src}
                        alt={`${item.name} from ${item.brand}`}
                        fill
                        preload={index < 5}
                        className="object-contain p-3 pt-6"
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                      />
                    </div>
                    <p className="px-4 pb-2 text-[10px] font-semibold tracking-[0.12em] text-[#b20f26] uppercase">
                      {item.brand}
                    </p>
                    <p className="px-4 pb-5 text-[15px] text-[#463b35]">{item.name}</p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-8 rounded-[20px] border border-[#f2ded7] bg-white/80 p-6 text-sm text-[#5d514b]">
              No products listed for {selectedBrand ?? "this collection"} yet.
            </p>
          )}
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pt-5 pb-8 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center justify-center gap-3 sm:gap-4">
          <span className="h-px flex-1 bg-[#e55563]" />
          <h2 className="text-center text-base font-bold tracking-[0.08em] text-[#d0122d] uppercase sm:text-lg">
            Our Products
          </h2>
          <span className="h-px flex-1 bg-[#e55563]" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {productCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                href={category.href}
                className="group relative flex h-[142px] overflow-hidden rounded-[16px] border border-[#f2d8d6] bg-[#ffe8e8] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(114,39,35,.12)]"
              >
                <div className="relative h-full w-[48%] shrink-0">
                  <Image
                    src={category.src}
                    alt={category.alt}
                    fill
                    className={`${category.imageClass} transition-transform duration-300 group-hover:scale-105`}
                    sizes="(min-width: 1280px) 115px, 45vw"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center p-2.5">
                  <Icon className="mb-1 size-4 text-[#d0122d]" />
                  <h3 className="font-serif text-[15px] leading-tight font-bold text-[#30231e]">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-[10px] leading-tight text-[#463b35]">
                    {category.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#d0122d] px-2.5 py-1 text-[9px] font-semibold text-white">
                    {category.label} <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
