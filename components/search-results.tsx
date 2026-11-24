"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Image from "@/components/media-image";
import {
  coffeeProducts,
  espressoMachines,
  flavourProducts,
  grinders,
} from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

type SearchProduct = {
  name: string;
  brand: string;
  src: string;
  href: string;
  detail?: string;
};

const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;
const liveBuckets = [
  { name: "Espresso_Machines", label: "Espresso Machines", href: "/espresso-machines" },
  { name: "Grinders", label: "Grinders", href: "/grinders" },
  { name: "Marcafe", label: "Coffee", href: "/coffee" },
] as const;

const staticProducts: SearchProduct[] = [
  ...espressoMachines.map((product) => ({
    ...product,
    href: "/espresso-machines",
  })),
  ...grinders.map((product) => ({
    ...product,
    href: "/grinders",
  })),
  ...coffeeProducts.map((product) => ({
    ...product,
    href: "/coffee",
  })),
  ...flavourProducts.map((product) => ({
    ...product,
    brand: "Catcher Gourmet",
    href: "/flavours",
  })),
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesQuery(product: SearchProduct, query: string) {
  const searchable = normalize(`${product.name} ${product.brand}`);
  return normalize(query)
    .split(" ")
    .filter(Boolean)
    .every((term) => searchable.includes(term));
}

function productName(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+(?:front|back|left|right|side|detail|fr)$/i, "")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

async function loadLiveProducts(query: string): Promise<SearchProduct[]> {
  const supabase = createClient();
  const matchingProducts: SearchProduct[] = [];

  for (const bucketInfo of liveBuckets) {
    const bucket = supabase.storage.from(bucketInfo.name);

    async function walk(path: string, brand?: string): Promise<void> {
      const entries = [];
      const limit = 1000;

      for (let offset = 0; ; offset += limit) {
        const { data, error } = await bucket.list(path, {
          limit,
          offset,
          sortBy: { column: "name", order: "asc" },
        });

        if (error) {
          throw new Error(`Unable to search the ${bucketInfo.name} catalog: ${error.message}`);
        }

        entries.push(...(data ?? []));
        if (!data || data.length < limit) break;
      }

      for (const entry of entries) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;

        if (entry.id === null) {
          await walk(entryPath, brand ?? entry.name);
          continue;
        }

        if (!imageExtensions.test(entry.name)) continue;

        const name = productName(entry.name);
        const product = {
          name,
          brand: brand ?? bucketInfo.label,
          src: bucket.getPublicUrl(entryPath).data.publicUrl,
          href: bucketInfo.href,
        };
        if (matchesQuery(product, query)) matchingProducts.push(product);
      }
    }

    await walk("");
  }

  return matchingProducts;
}

export function SearchResults({ query }: { query: string }) {
  const [liveProducts, setLiveProducts] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(query.trim()));
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!query.trim()) return;

    loadLiveProducts(query)
      .then((products) => {
        if (active) setLiveProducts(products);
      })
      .catch((error: unknown) => {
        console.error("Unable to search live product catalogs.", error);
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Live product search is temporarily unavailable."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  const products = useMemo(() => {
    const uniqueProducts = new Map<string, SearchProduct>();

    for (const product of [
      ...staticProducts.filter((item) => matchesQuery(item, query)),
      ...liveProducts,
    ]) {
      const key = `${normalize(product.href)}:${normalize(product.brand)}:${normalize(product.name)}`;
      if (!uniqueProducts.has(key)) uniqueProducts.set(key, product);
    }

    return [...uniqueProducts.values()].sort(
      (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
    );
  }, [liveProducts, query]);

  return (
    <main className="min-h-[55vh] flex-1 bg-[#fff3f4] px-4 py-8 sm:px-8 sm:py-12">
      <section className="mx-auto max-w-[1200px]">
        <p className="text-sm font-semibold tracking-wide text-[#D7192D] uppercase">
          Product search
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#3b1c17] sm:text-4xl">
          {query ? `Results for “${query}”` : "Search our products"}
        </h1>

        {!query.trim() ? (
          <p className="mt-4 text-sm text-[#645b5b]">
            Enter a product, brand, or category in the search box above.
          </p>
        ) : null}
        {isLoading ? (
          <p role="status" className="mt-6 text-sm text-[#645b5b]">
            Searching product catalogs…
          </p>
        ) : null}
        {loadError ? (
          <p role="alert" className="mt-4 rounded-lg border border-[#f1b8c0] bg-white p-3 text-sm text-[#8f1927]">
            {loadError} Showing matching products from the local catalog.
          </p>
        ) : null}
        {!isLoading && query.trim() && products.length === 0 ? (
          <p className="mt-6 text-sm text-[#645b5b]">
            No products matched your search. Try another product name or brand.
          </p>
        ) : null}

        {products.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={`${product.href}:${product.brand}:${product.name}`}
                href={product.href}
                className="group overflow-hidden rounded-xl border border-[#f4d5d9] bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="relative block aspect-square bg-[#faf6ef]">
                  <Image
                    src={product.src}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain p-3"
                  />
                </span>
                <span className="block p-3">
                  <span className="block text-[10px] font-semibold tracking-wide text-[#D7192D] uppercase">
                    {product.brand}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#2b2118] group-hover:text-[#D7192D]">
                    {product.name}
                  </span>
                  {product.detail ? (
                    <span className="mt-1 block text-xs text-[#645b5b]">
                      {product.detail}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
