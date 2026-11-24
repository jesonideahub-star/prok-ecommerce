"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LoaderCircle, RotateCcw } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const cleaningBucket = "Puly_Caff";
const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;

type CleaningCategory = "machine" | "grinder" | "milk" | "accessories";

type CleaningProduct = {
  name: string;
  brand: string;
  category: CleaningCategory;
  detail: string;
  src: string;
};

const productDetails: {
  match: string;
  name: string;
  category: CleaningCategory;
  detail: string;
}[] = [
  {
    match: "grindcryst",
    name: "pulyGRIND Crystals 405g",
    category: "grinder",
    detail: "Coffee grinder cleaner",
  },
  {
    match: "igienic",
    name: "Verde Bar Igienic 1000mL",
    category: "machine",
    detail: "Cleans and hygienizes",
  },
  {
    match: "milkcapucino",
    name: "pulyMILK Capucino Liquid",
    category: "milk",
    detail: "Milk frother cleaner",
  },
  {
    match: "calcinet",
    name: "Calcinet Scale Remover",
    category: "machine",
    detail: "Boilers and heat exchangers",
  },
  {
    match: "kitbox",
    name: "Puly Caff Cleaning Kit Box",
    category: "accessories",
    detail: "Coffee cleaning essentials kit",
  },
  {
    match: "powdernsf",
    name: "pulyCAFF Plus NSF 900g",
    category: "machine",
    detail: "Coffee machine cleaner",
  },
  {
    match: "powder370",
    name: "pulyCAFF Plus Powder 370g",
    category: "machine",
    detail: "Coffee machine cleaner",
  },
  {
    match: "brush",
    name: "Puly Caff Spazzolino Brush",
    category: "accessories",
    detail: "Coffee machine cleaning brush",
  },
];

const heroProductClasses = [
  "bottom-0 left-[2%] h-[68%] w-[22%]",
  "bottom-0 left-[25%] h-[83%] w-[23%]",
  "bottom-0 left-[49%] h-[78%] w-[24%]",
  "bottom-0 right-[1%] h-[86%] w-[24%]",
] as const;

function normalizeFilename(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function fallbackProductName(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadCleaningProducts(): Promise<CleaningProduct[]> {
  const supabase = createClient();
  const bucket = supabase.storage.from(cleaningBucket);
  const entries = [];
  const limit = 1000;

  for (let offset = 0; ; offset += limit) {
    const { data, error } = await bucket.list("", {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) throw error;
    entries.push(...(data ?? []));
    if (!data || data.length < limit) break;
  }

  return entries
    .filter((entry) => entry.id !== null && imageExtensions.test(entry.name))
    .map((entry) => {
      const normalizedName = normalizeFilename(entry.name);
      const details = productDetails.find((product) =>
        normalizedName.includes(product.match)
      );

      return {
        name: details?.name ?? fallbackProductName(entry.name),
        brand: "Puly Caff Product",
        category: details?.category ?? "machine",
        detail: details?.detail ?? "Professional cleaning solution",
        src: bucket.getPublicUrl(entry.name).data.publicUrl,
      };
    });
}

const productCategories = [
  { label: "All Products", value: "all" },
  { label: "Machine Care", value: "machine" },
  { label: "Grinder Care", value: "grinder" },
  { label: "Milk System", value: "milk" },
  { label: "Accessories", value: "accessories" },
] as const;

export function CleaningSolutionPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cleaningProducts, setCleaningProducts] = useState<CleaningProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setLoadError(false);
        const products = await loadCleaningProducts();
        if (active) setCleaningProducts(products);
      } catch (error) {
        console.error(`Unable to load cleaning products from the ${cleaningBucket} bucket.`, error);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const visibleProducts = cleaningProducts.filter((product) => {
    if (activeCategory === "all") return true;
    return product.category === activeCategory;
  });
  const heroProducts = [
    cleaningProducts.find((product) => product.category === "grinder"),
    cleaningProducts.find((product) => product.name.toLowerCase().includes("igienic")),
    cleaningProducts.find((product) => product.category === "milk"),
    cleaningProducts.find((product) => product.name.toLowerCase().includes("nsf")),
  ]
    .filter((product): product is CleaningProduct => Boolean(product))
    .map((product, index) => ({
      ...product,
      className: heroProductClasses[index],
    }));

  return (
    <main className="flex-1 overflow-hidden bg-[#fff5f6] text-[#292226]">
      <section className="relative isolate min-h-[420px] overflow-hidden bg-[linear-gradient(112deg,#fff1f3_0%,#ffe8ec_52%,#f8c5ce_100%)] md:min-h-[286px]">
        <div className="absolute inset-y-0 right-0 -z-20 hidden w-[57%] overflow-hidden md:block">
          <Image
            src="/images/cafe-interior.png"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 57vw, 100vw"
            className="object-cover object-center opacity-35"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,#fff1f3_0%,rgba(255,239,242,.98)_38%,rgba(255,224,230,.68)_67%,rgba(248,197,206,.45)_100%)]" />
        <div className="absolute -left-20 top-[-200px] -z-10 size-[520px] rounded-full border-[34px] border-white/30" />
        <div className="absolute bottom-[-190px] left-[28%] -z-10 size-[440px] rounded-full border-[24px] border-[#f5b0bc]/25" />

        <div className="relative mx-auto flex min-h-[420px] max-w-[1440px] items-start px-5 pb-[185px] pt-9 sm:px-8 md:min-h-[286px] md:items-center md:pb-8 md:pt-8">
          <div className="relative z-20 max-w-[600px]">
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-bold tracking-[0.24em] text-[#d7192d] uppercase sm:text-xs">
                Care &amp; Maintenance
              </p>
              <span className="h-px w-20 bg-[#e44352]" />
            </div>
            <h1 className="mt-2 font-serif text-[42px] leading-[1.05] font-bold tracking-tight text-[#24191a] sm:text-[52px] md:text-[54px]">
              Puly Caff <em className="text-[#d7192d]">Product</em>
            </h1>
            <p className="mt-3 max-w-[490px] text-[14px] leading-5 text-[#4c4345] sm:text-[15px]">
              Professional espresso and grinder cleaning products to keep every
              machine tasting clean, running smooth, and looking ready for
              service.
            </p>
            <Link
              href="#cleaning-products"
              className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#e50925] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(215,25,45,.18)] transition-colors hover:bg-[#bd1024]"
            >
              Explore Our Cleaning Solutions
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[175px] overflow-hidden md:inset-y-0 md:left-[51%] md:right-0 md:h-auto">
            {heroProducts.map((product) => (
              <span
                key={product.name}
                className={`absolute ${product.className}`}
              >
                <Image
                  src={product.src}
                  alt={product.name}
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 14vw, 22vw"
                  className="object-contain object-bottom drop-shadow-[0_10px_12px_rgba(75,28,34,.13)]"
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cleaning-products"
        className="mx-auto max-w-[1440px] px-4 pb-5 pt-4 sm:px-6 md:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="shrink-0 font-serif text-[27px] leading-tight font-bold tracking-tight text-[#7d1822] sm:text-[29px]">
            Our Cleaning Products
          </h2>
          <div
            aria-label="Filter cleaning products"
            className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {productCategories.map((category) => {
              const isActive = activeCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.value)}
                  className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-medium transition-colors sm:px-3.5 sm:text-xs ${
                    isActive
                      ? "bg-[#e50925] text-white shadow-[0_4px_12px_rgba(215,25,45,.18)]"
                      : "text-[#342b2d] hover:bg-[#f9e1e5]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading ? (
            <div className="col-span-full flex min-h-[220px] items-center justify-center gap-2 rounded-[17px] border border-[#f4dce0] bg-white/70 text-sm text-[#797176]">
              <LoaderCircle className="size-4 animate-spin" />
              Loading cleaning products…
            </div>
          ) : loadError ? (
            <div className="col-span-full flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[17px] border border-[#f4dce0] bg-white/70 text-center">
              <p className="text-sm text-[#797176]">
                Cleaning products could not be loaded from the product library.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-[#e50925] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#bd1024]"
              >
                <RotateCcw className="size-3.5" />
                Try again
              </button>
            </div>
          ) : visibleProducts.length ? (
            visibleProducts.map((product) => (
              <article
                key={product.src}
                className="group flex h-[254px] min-w-0 flex-col overflow-hidden rounded-[17px] border border-[#f4dce0] bg-white/80 shadow-[0_4px_12px_rgba(90,28,38,.06)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(90,28,38,.12)]"
              >
                <div className="relative h-[166px] shrink-0 bg-[linear-gradient(145deg,#fffafa,#fff1f3)]">
                  <Image
                    src={product.src}
                    alt={product.name}
                    fill
                    loading="eager"
                    sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 46vw"
                    className="object-contain px-7 py-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="relative flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2.5">
                  <p className="text-[9px] font-bold tracking-[0.11em] text-[#d7192d] uppercase">
                    {product.brand}
                  </p>
                  <h3 className="mt-1 pr-7 text-[12px] leading-[1.3] font-semibold text-[#242024] sm:text-[13px]">
                    {product.name}
                  </h3>
                  <p className="mt-1 pr-7 text-[10px] leading-4 text-[#797176] sm:text-[11px]">
                    {product.detail}
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute right-3 bottom-3 flex size-5 items-center justify-center rounded-full border border-[#e50925] text-[#e50925] transition-all group-hover:bg-[#e50925] group-hover:text-white"
                  >
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full flex min-h-[220px] items-center justify-center rounded-xl border border-[#f4dce0] bg-white/80 px-5 py-8 text-sm text-[#797176]">
              {cleaningProducts.length
                ? "No products are available in this category yet."
                : "No product images were found in the Puly Caff bucket."}
            </p>
          )}
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-[#f4c8ce] bg-[linear-gradient(110deg,#ffe9ed_0%,#fff5f6_46%,#f9d1d7_100%)]">
        <div className="absolute -left-14 bottom-[-140px] -z-10 size-[300px] rounded-full border-[24px] border-white/45" />
        <div className="absolute right-[-80px] top-[-165px] -z-10 size-[340px] rounded-full border-[26px] border-[#f2a5b1]/25" />
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-4 px-5 py-5 text-center sm:flex-row sm:justify-between sm:gap-6 sm:py-4 sm:text-left">
          <div className="flex shrink-0 items-center justify-center rounded-xl bg-white/80 px-4 py-2 sm:w-[220px]">
            <Image
              src="/images/brand-pulycaff-official.png"
              alt="Puly Caff"
              width={306}
              height={203}
              sizes="175px"
              className="h-[78px] w-[190px] object-contain"
            />
          </div>
          <span className="hidden h-12 w-px bg-[#e44352] sm:block" />
          <div className="min-w-0">
            <h2 className="font-serif text-[21px] leading-tight font-semibold text-[#351d20] sm:text-[23px]">
              Trusted Cleaning Solutions
            </h2>
            <p className="mt-0.5 font-serif text-[17px] leading-tight text-[#7d1822] italic">
              for Your Coffee Business
            </p>
          </div>
          <Link
            href="#cleaning-products"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#e50925] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
          >
            Discover More
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
