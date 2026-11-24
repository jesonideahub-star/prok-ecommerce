"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { ChevronDown, LoaderCircle, RotateCcw } from "lucide-react";

import { CatalogAd } from "@/components/ads/catalog-ad";
import { CatalogProductCard } from "@/components/catalog-product-card";
import {
  catalogHeroFloatLeft,
  catalogHeroFloatRight,
  CollectionBanner,
} from "@/components/collection-banner";
import {
  coffeeCatalogCopy,
  coffeeCategories,
  coffeeProducts,
  coffeeTabCopy,
} from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type SortKey = "default" | "az" | "za";
type CoffeeProduct = {
  name: string;
  brand: string;
  category: "beans" | "pods";
  detail?: string;
  brews: readonly string[];
  src: string;
};

const coffeeBucket = "Marcafe";
const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;

function normalizeCoffeeFilename(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/^product-/i, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function coffeeDisplayName(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^marcafe\s+/i, "")
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

async function loadCoffeeProducts(): Promise<CoffeeProduct[]> {
  const bucket = createClient().storage.from(coffeeBucket);

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

  async function walk(path: string): Promise<CoffeeProduct[]> {
    const entries = await listDirectory(path);
    const products: CoffeeProduct[] = [];

    for (const entry of entries) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.id === null) {
        products.push(...(await walk(entryPath)));
        continue;
      }

      if (!imageExtensions.test(entry.name)) continue;

      const normalizedName = normalizeCoffeeFilename(entry.name);
      const knownProduct = coffeeProducts.find((item) => {
        const productName = normalizeCoffeeFilename(item.name);
        const productFilename = normalizeCoffeeFilename(
          item.src.split("/").at(-1) ?? ""
        );
        return (
          normalizedName === productName ||
          normalizedName.endsWith(productName) ||
          normalizedName === productFilename ||
          normalizedName.endsWith(productFilename) ||
          (productName === "caffedecaffeinato" &&
            normalizedName.includes("decaf"))
        );
      });
      const isPods =
        knownProduct?.category === "pods" ||
        /pod|capsule|cialde|decaf/i.test(`${entryPath} ${entry.name}`);

      products.push({
        name: knownProduct?.name ?? coffeeDisplayName(entry.name),
        brand: knownProduct?.brand ?? "Marcafé",
        category: isPods ? "pods" : "beans",
        detail: knownProduct?.detail,
        brews: knownProduct?.brews ?? [],
        src: bucket.getPublicUrl(entryPath).data.publicUrl,
      });
    }

    return products;
  }

  return (await walk("")).sort((a, b) => a.name.localeCompare(b.name));
}

const heroCoffees = [
  {
    src: "/images/hero-coffee-classico.png",
    alt: "Caffè Bellini Espresso Grande",
    className: catalogHeroFloatRight,
    delay: "0ms",
    local: true,
  },
  {
    src: "/images/hero-coffee-idillio.png",
    alt: "Marcafé Idillio roasted coffee beans",
    className: catalogHeroFloatLeft,
    delay: "180ms",
    local: true,
  },
] as const;

export function CoffeePage({
  category,
  brew,
}: {
  category?: string;
  brew?: string;
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const activeCategory = category === "beans" || category === "pods" ? category : undefined;
  const activeShop = coffeeCategories.find((item) => item.slug === activeCategory);
  const tabCopy = activeCategory ? coffeeTabCopy[activeCategory] : undefined;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setLoadError(false);
        const loadedProducts = await loadCoffeeProducts();
        if (active) setProducts(loadedProducts);
      } catch (error) {
        console.error(`Unable to load coffee products from the ${coffeeBucket} bucket.`, error);
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

  const items = useMemo(() => {
    const next = products.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (brew && !item.brews.some((value) => value === brew)) return false;
      return true;
    });

    if (sort === "az") {
      next.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "za") {
      next.sort((a, b) => b.name.localeCompare(a.name));
    }
    return next;
  }, [activeCategory, brew, products, sort]);

  const title = tabCopy?.title ?? coffeeCatalogCopy.title;

  return (
    <main className="flex-1 overflow-hidden bg-[#fff6ee]">
      <CollectionBanner
        title={title}
        description={tabCopy?.description ?? coffeeCatalogCopy.description}
        floats={heroCoffees}
        overlaySrc={activeShop?.src}
      />

      <section className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="animate-scale-in rounded-[28px] bg-[#fff9f2] px-4 py-8 shadow-[0_18px_40px_rgba(80,50,20,0.08)] ring-1 ring-[#eadfce] md:px-10 md:py-10 [animation-delay:140ms]">
          <h2 className="animate-fade-up text-center font-serif text-2xl font-bold text-[#d0122d] md:text-[1.85rem] [animation-delay:200ms]">
            {coffeeCatalogCopy.shopHeading}
          </h2>
          <p className="mt-2 animate-fade-up text-center text-sm text-zinc-500 [animation-delay:260ms]">
            {coffeeCatalogCopy.shopCaption}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {coffeeCategories.map((item, index) => (
              <Link
                key={item.slug}
                href={activeCategory === item.slug ? "/coffee" : `/coffee?category=${item.slug}`}
                className="group relative min-h-[220px] animate-fade-up overflow-hidden rounded-2xl shadow-[0_12px_28px_rgba(80,50,20,0.12)] transition-transform duration-500 hover:-translate-y-1 md:min-h-[300px]"
                style={{ animationDelay: `${320 + index * 80}ms` }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-6 md:p-8",
                    item.overlay === "orange" ? "text-[#d0122d]" : "text-white"
                  )}
                >
                  <h3 className="text-3xl font-bold tracking-tight md:text-4xl">{item.title}</h3>
                  <p className="mt-2 text-sm opacity-90">{item.caption}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
        <div className="flex animate-fade-up flex-col gap-4 border-b border-[#eadfce] pb-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between [animation-delay:320ms]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2b2118] md:text-3xl">
              {tabCopy?.selection ?? "The collection"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {isLoading
                ? "Loading Marcafé products…"
                : `${items.length} ${items.length === 1 ? "coffee" : "coffees"}`}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <label htmlFor="coffee-sort" className="sr-only">
              Sort by
            </label>
            <div className="relative w-full sm:w-auto">
              <select
                id="coffee-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-9 w-full min-w-0 appearance-none rounded-full border border-[#eadfce] bg-white px-4 pr-9 text-sm text-zinc-600 outline-none focus:border-[#c4a882] sm:w-[170px]"
              >
                <option value="default">Featured</option>
                <option value="az">Name A–Z</option>
                <option value="za">Name Z–A</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 flex min-h-[220px] items-center justify-center gap-2 rounded-2xl border border-[#eadfce] bg-white/70 text-sm text-zinc-500">
            <LoaderCircle className="size-4 animate-spin" />
            Loading products from the Marcafe bucket…
          </div>
        ) : loadError ? (
          <div className="mt-8 flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#eadfce] bg-white/70 text-center">
            <p className="text-sm text-zinc-500">
              Marcafé products could not be loaded from the product library.
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-full bg-[#d0122d] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#ad1025]"
            >
              <RotateCcw className="size-3.5" />
              Try again
            </button>
          </div>
        ) : items.length ? (
          <>
            <CatalogAd />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {items.map((item, index) => (
                <CatalogProductCard
                  key={`${item.category}-${item.name}`}
                  name={item.name}
                  src={item.src}
                  brand={item.brand}
                  detail={item.detail}
                  preload={index < 4}
                  index={index}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-12 text-sm text-zinc-400">
            No Marcafé products listed for this selection yet.
          </p>
        )}
      </section>
    </main>
  );
}
