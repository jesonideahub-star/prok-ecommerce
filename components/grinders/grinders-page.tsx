"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import { CatalogAd } from "@/components/ads/catalog-ad";
import {
  brandSlug,
  grinderShopUses,
  grinderUseLabels,
  grinders,
} from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type SortKey = "default" | "az" | "za";
type SeriesKey = "default" | "mignon" | "commercial";
type GrinderType = "on-demand" | "traditional" | "automatic";

type GrinderProduct = {
  name: string;
  brand: string;
  series: Exclude<SeriesKey, "default">;
  type: GrinderType;
  uses: readonly string[];
  src: string;
  detail?: string;
};

const grinderBucket = "Grinders";
const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;

function normalizeFilename(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/^product-/i, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function grinderDisplayName(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

const knownGrinders = new Map(
  grinders.map((item) => [normalizeFilename(item.src.split("/").at(-1) ?? ""), item])
);

function grinderBrand(folder?: string) {
  if (!folder) return "Other";
  if (/^eureka grinder$/i.test(folder.trim())) return "Eureka 1920";
  if (/^casadio grinder$/i.test(folder.trim())) return "Casadio";
  return folder
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function grinderSeries(filename: string): Exclude<SeriesKey, "default"> {
  return /mignon|libra|silenzio/i.test(filename) ? "mignon" : "commercial";
}

function grinderType(filename: string): GrinderType {
  if (/automatic|auto/i.test(filename)) return "automatic";
  if (/traditional|manual/i.test(filename)) return "traditional";
  return "on-demand";
}

async function loadGrinders(): Promise<GrinderProduct[]> {
  const supabase = createClient();
  const bucket = supabase.storage.from(grinderBucket);

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

  async function walk(path: string, parentBrand?: string): Promise<GrinderProduct[]> {
    const entries = await listDirectory(path);
    const products: GrinderProduct[] = [];

    for (const entry of entries) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.id === null) {
        products.push(...(await walk(entryPath, parentBrand ?? entry.name)));
        continue;
      }

      if (!imageExtensions.test(entry.name)) continue;

      const normalizedName = normalizeFilename(entry.name);
      const knownProduct =
        knownGrinders.get(normalizedName) ??
        [...knownGrinders.entries()].find(([filename]) =>
          normalizedName.endsWith(filename)
        )?.[1];
      const series = knownProduct?.series ?? grinderSeries(entry.name);
      products.push({
        name: knownProduct?.name ?? grinderDisplayName(entry.name),
        brand: knownProduct?.brand ?? grinderBrand(parentBrand),
        series,
        type: grinderType(entry.name),
        uses:
          knownProduct?.uses ??
          (series === "mignon"
            ? ["home", "office", "cafe"]
            : ["cafe", "restaurant", "hotel", "office"]),
        src: bucket.getPublicUrl(entryPath).data.publicUrl,
        detail: knownProduct && "detail" in knownProduct ? knownProduct.detail : undefined,
      });
    }

    return products;
  }

  return (await walk("")).sort(
    (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );
}

const grinderTypes: { label: string; value: GrinderType }[] = [
  { label: "On-Demand", value: "on-demand" },
  { label: "Traditional", value: "traditional" },
  { label: "Automatic", value: "automatic" },
];

function hrefForUse(slug: string) {
  return `/grinders?use=${slug}`;
}

function grinderDetail(item: GrinderProduct) {
  if ("detail" in item && item.detail) {
    return item.detail;
  }
  return item.series === "mignon" ? "Mignon Series" : "Commercial Series";
}

export function GrindersPage({
  use,
  series,
  brand,
}: {
  use?: string;
  series?: string;
  brand?: string;
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [selectedBrands, setSelectedBrands] = useState<string[] | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<GrinderType[]>([]);
  const [listView, setListView] = useState(false);
  const seriesSort: SeriesKey =
    series === "mignon" || series === "commercial" ? series : "default";
  const [grinderProducts, setGrinderProducts] = useState<GrinderProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setLoadError(false);
        const products = await loadGrinders();
        if (active) setGrinderProducts(products);
      } catch (error) {
        console.error(`Unable to load grinders from the ${grinderBucket} bucket.`, error);
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

  const useLabel = use ? grinderUseLabels[use] : undefined;
  const brandFilters = useMemo(
    () =>
      [...new Set(grinderProducts.map((item) => item.brand))]
        .sort((a, b) => a.localeCompare(b))
        .map((label) => ({ label, slug: brandSlug(label) })),
    [grinderProducts]
  );
  const activeBrands = useMemo(
    () => selectedBrands ?? (brand ? [brand] : []),
    [brand, selectedBrands]
  );

  const items = useMemo(() => {
    const next = grinderProducts.filter((item) => {
      if (use && !item.uses.some((value) => value === use)) {
        return false;
      }
      if (seriesSort !== "default" && item.series !== seriesSort) {
        return false;
      }
      if (activeBrands.length && !activeBrands.includes(brandSlug(item.brand))) {
        return false;
      }
      if (selectedTypes.length && !selectedTypes.includes(item.type)) {
        return false;
      }
      return true;
    });

    if (sort === "az") {
      next.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "za") {
      next.sort((a, b) => b.name.localeCompare(a.name));
    }
    return next;
  }, [activeBrands, grinderProducts, selectedTypes, seriesSort, sort, use]);
  function toggleValue<T extends string>(
    values: T[],
    value: T,
    setValues: (next: T[]) => void
  ) {
    setValues(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value]
    );
  }

  return (
    <main className="flex-1 bg-[#fff6f7] text-[#292226]">
      <section className="relative isolate min-h-[250px] overflow-hidden bg-[linear-gradient(112deg,#fff1f3_0%,#ffe8ec_50%,#f8c5ce_100%)] md:min-h-[212px]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[8%] top-[-290px] size-[650px] rounded-full border-[34px] border-white/45" />
          <div className="absolute left-[22%] top-[-330px] size-[700px] rounded-full border-[22px] border-[#f4a8b5]/25" />
          <div className="absolute right-[-8%] bottom-[-260px] size-[560px] rounded-full border-[30px] border-white/45" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(175deg,transparent_0_30%,rgba(226,24,54,.12)_31%_43%,transparent_44%)]" />
        </div>
        <div className="absolute right-[4%] bottom-6 hidden -rotate-6 text-right font-serif text-[32px] leading-[.94] text-[#641b24] italic lg:block">
          Perfect Coffee.
          <br />
          Everywhere.
          <span className="ml-auto mt-2 block h-[3px] w-32 rotate-[-12deg] rounded-full bg-[#ed1836]" />
        </div>
        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-4 pb-4 pt-3 text-center sm:px-6 md:pb-3">
          <h1 className="font-serif text-[30px] leading-tight font-bold text-[#d7192d] sm:text-[34px]">
            Shop Grinders
          </h1>
          <p className="mt-0.5 text-[14px] text-[#5d5154] sm:text-[15px]">
            Choose where the grinder will live
          </p>
          <div className="mt-3 grid w-full max-w-[660px] grid-cols-5 gap-1 sm:gap-5">
            {grinderShopUses.map((item) => {
              const active = use === item.slug;
              return (
                <Link
                  key={item.slug}
                  href={active ? "/grinders" : hrefForUse(item.slug)}
                  className="group flex min-w-0 flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "relative size-[62px] overflow-hidden rounded-full border-[3px] border-white shadow-[0_4px_10px_rgba(81,31,37,.2)] transition-transform group-hover:scale-105 sm:size-[82px] md:size-[88px]",
                      active && "ring-2 ring-[#df1832] ring-offset-2"
                    )}
                  >
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-[11px] leading-tight font-semibold text-[#d7192d] sm:text-[13px]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#f2d5da] bg-[linear-gradient(115deg,#fff7f8,#fff0f2)]">
        <div className="mx-auto grid max-w-[1440px] gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:gap-3">
          <aside className="h-fit rounded-[14px] border border-[#f1cbd2] bg-[linear-gradient(145deg,#fff1f3,#ffe6eb)] p-3 shadow-[0_4px_12px_rgba(112,29,42,.06)]">
            <h2 className="font-serif text-[16px] font-bold text-[#641b24]">
              Filter Products
            </h2>
            <div className="my-2 h-px bg-[#e7a9b4]" />
            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold text-[#4c3035]">
                Brand
              </legend>
              <div className="space-y-1">
                {brandFilters.map((item) => (
                  <label
                    key={item.slug}
                    className="flex cursor-pointer items-center gap-2 text-[11px] text-[#645b60]"
                  >
                    <input
                      type="checkbox"
                      checked={activeBrands.includes(item.slug)}
                      onChange={() =>
                        toggleValue(
                          activeBrands,
                          item.slug,
                          (next) => {
                            setSelectedBrands(next);
                          }
                        )
                      }
                      className="size-3.5 accent-[#e50925]"
                    />
                    {item.label.replace(" 1920", "")}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="my-2 h-px bg-[#e7a9b4]" />
            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold text-[#4c3035]">
                Type
              </legend>
              <div className="space-y-1">
                {grinderTypes.map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer items-center gap-2 text-[11px] text-[#645b60]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(item.value)}
                      onChange={() =>
                        toggleValue(selectedTypes, item.value, (next) => {
                          setSelectedTypes(next);
                        })
                      }
                      className="size-3.5 accent-[#e50925]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                setSelectedTypes([]);
                setSort("default");
                router.push("/grinders");
              }}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#e50925] px-2 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
            >
              <RotateCcw className="size-3" />
              Reset Filters
            </button>
          </aside>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="text-[12px] text-[#51484b]">
                {isLoading
                  ? "Loading grinders…"
                  : items.length
                    ? `Showing all ${items.length} results`
                    : "Showing 0 results"}
                {useLabel ? ` · ${useLabel}` : ""}
              </p>
              <div className="flex items-center gap-1.5">
                <label htmlFor="grinder-sort" className="text-[11px] text-[#51484b]">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="grinder-sort"
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value as SortKey);
                    }}
                    className="h-7 w-[92px] appearance-none rounded-full border border-[#e6d3d6] bg-white px-3 pr-7 text-[11px] text-[#383135] outline-none focus:border-[#dc263e] sm:w-[110px]"
                  >
                    <option value="default">Default</option>
                    <option value="az">Name A–Z</option>
                    <option value="za">Name Z–A</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-[#645b60]" />
                </div>
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={!listView}
                  onClick={() => setListView(false)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md border",
                    !listView
                      ? "border-[#e50925] bg-[#e50925] text-white"
                      : "border-[#f0cbd2] bg-white text-[#d7192d]"
                  )}
                >
                  <LayoutGrid className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={listView}
                  onClick={() => setListView(true)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md border",
                    listView
                      ? "border-[#e50925] bg-[#e50925] text-white"
                      : "border-[#f0cbd2] bg-white text-[#d7192d]"
                  )}
                >
                  <List className="size-3.5" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-[240px] items-center justify-center gap-2 rounded-[14px] border border-[#f1cbd2] bg-white/70 text-sm text-zinc-500">
                <LoaderCircle className="size-4 animate-spin" />
                Loading grinders from the product library…
              </div>
            ) : loadError ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[14px] border border-[#f1cbd2] bg-white/70 text-center">
                <p className="text-sm text-zinc-500">
                  Grinders could not be loaded from the product library.
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
                <div
                  className={cn(
                    "mt-2 grid gap-2 sm:gap-3",
                    listView
                      ? "grid-cols-1"
                      : "grid-cols-2 xl:grid-cols-4"
                  )}
                >
                  {items.map((item, index) => (
                    <article
                      key={item.src}
                      className={cn(
                        "group overflow-hidden rounded-[14px] border border-[#f1d5da] bg-white/80 shadow-[0_3px_10px_rgba(94,35,43,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(94,35,43,.12)]",
                        listView ? "flex h-[145px] flex-row" : "flex h-[256px] flex-col"
                      )}
                    >
                      <div
                        className={cn(
                          "relative min-h-0 bg-[linear-gradient(145deg,#fffafa,#fff2f4)]",
                          listView ? "h-full w-[36%] shrink-0" : "h-[164px] shrink-0"
                        )}
                      >
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          preload={index < 2}
                          sizes={listView ? "150px" : "(min-width: 1280px) 20vw, 45vw"}
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="relative flex min-w-0 flex-1 flex-col items-center px-2 pb-2 pt-1.5 text-center">
                        <p className="text-[10px] font-bold uppercase text-[#e50925]">
                          {item.brand.replace(" 1920", "")}
                        </p>
                        <h3 className="mt-0.5 line-clamp-1 text-[12px] leading-tight font-semibold text-[#242024] sm:text-[13px]">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-1 text-[10px] text-[#70676b]">
                          {grinderDetail(item)}
                        </p>
                        <Link
                          href={`/grinders?brand=${brandSlug(item.brand)}`}
                          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#e50925] px-3 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024] sm:text-[11px]"
                        >
                          View Details
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <p className="flex min-h-[240px] items-center justify-center rounded-[14px] border border-[#f1cbd2] bg-white/70 text-sm text-zinc-500">
                No grinders listed for this selection yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#f2c5cd] bg-[linear-gradient(108deg,#ffedf0_0%,#fff7f8_43%,#ffdfe5_100%)]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 bottom-[-190px] size-[400px] rounded-full border-[30px] border-[#ec4660]/20" />
          <div className="absolute right-[-60px] top-[-230px] size-[430px] rounded-full border-[26px] border-white/75" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(170deg,transparent_0_35%,rgba(230,23,56,.14)_36%_55%,transparent_56%)]" />
        </div>
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-4 px-5 py-5 text-center sm:flex-row sm:justify-center sm:gap-8 sm:py-4">
          <div className="flex h-[90px] w-[130px] shrink-0 items-center justify-center sm:h-[110px] sm:w-[170px]">
            <Image
              src="/images/brand-eureka-official.png"
              alt="Eureka 1920"
              width={782}
              height={768}
              sizes="170px"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="hidden h-[88px] w-px bg-[#e44352] sm:block" />
          <div className="min-w-0">
            <h2 className="font-serif text-[20px] leading-tight font-bold text-[#501b21] sm:text-[22px]">
              Choose the Best. Grind with Eureka.
            </h2>
            <p className="mt-1 text-[12px] text-[#453c3f] sm:text-[13px]">
              Italian excellence in every cup.
            </p>
            <Link
              href="/grinders?brand=eureka-1920"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e50925] px-5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
            >
              Discover More
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
