"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Grid2X2,
  List,
  RotateCcw,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  brandSlug,
  espressoMachines,
  espressoShopUses,
  espressoUseLabels,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type SortKey = "default" | "az" | "za";
type ViewMode = "grid" | "list";

type MachineProduct = {
  name: string;
  brand: string;
  src: string;
  path: string;
  contentTag?: string;
  groups?: number;
  uses?: readonly string[];
};

const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;
const espressoMachineBucket = "Espresso_Machines";
const cafeBucket = "Cafe";
const restaurantBucket = "Restaurant";
const hotelBucket = "Hotel";
const homeBucket = "Home";
const officeBucket = "Office";
const nonEspressoMachineKeywords =
  /\b(grinder|grinding|mill|tamper|accessor(?:y|ies)|clean(?:er|ing)?|brush|knockbox|on[\s_-]*demand|atom|mignon|firenze|helios?|libra|disko)\b/i;
const useEspressoMachineBrands = new Set([
  "Casadio",
  "Didiesse",
  "La Nuova Era",
  "Slayer",
]);

function isEspressoMachineProduct(name: string, brand: string) {
  return (
    brand !== "Eureka 1920" &&
    !nonEspressoMachineKeywords.test(name) &&
    !normalizeFilename(name).includes("ondemand")
  );
}

function normalizeFilename(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeContentTag(tag?: string) {
  return tag?.trim().replace(/^W\//i, "").replace(/^["']|["']$/g, "") || undefined;
}

const knownMachineDetails = new Map(
  espressoMachines.map((item) => [
    normalizeFilename(item.src.split("/").at(-1) ?? ""),
    item,
  ])
);

function brandDisplayName(folder: string) {
  if (folder.trim().toLowerCase() === "la nuova") return "La Nuova Era";
  return folder
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function groupCountFromPath(path: string) {
  const folder = path.match(
    /(?:^|\/)(single(?:\s+group)?|double(?:\s+group)?|[123]\s*(?:groups?|gr))(?=\/|$)/i
  )?.[1]?.toLowerCase();

  if (folder?.startsWith("single")) return 1;
  if (folder?.startsWith("double")) return 2;
  return folder ? Number(folder.match(/[123]/)?.[0]) : undefined;
}

function inferMachineBrand(path: string) {
  const normalizedPath = path.toLowerCase();
  if (/\bcasadio\b/.test(normalizedPath)) return "Casadio";
  if (/\bdidiesse\b/.test(normalizedPath)) return "Didiesse";
  if (/\bla\s+n(?:uo|ou)va(?:\s+era)?\b/.test(normalizedPath)) return "La Nuova Era";
  if (/\bslayer\b|\bsteam\s*(?:lp|ep|single)\b|\bespresso\s*v3\b/.test(normalizedPath)) {
    return "Slayer";
  }
  if (/\beureka\b/.test(normalizedPath)) return "Eureka 1920";
  return undefined;
}

function productDisplayName(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const machineViewTokens = new Set([
  "back",
  "backleft",
  "backright",
  "detail",
  "fr",
  "front",
  "frontleft",
  "frontright",
  "left",
  "rear",
  "right",
  "side",
]);

function machineProductName(name: string) {
  const withoutViewSuffix = name
    .replace(/\s+(?:LAT\s+(?:DX|SX)|TREQUA|FR)\s*$/i, "")
    .trim();

  return withoutViewSuffix
    .split(/\s+/)
    .filter((token) => !machineViewTokens.has(token.toLowerCase()))
    .join(" ");
}

function machineViewPriority(name: string) {
  const tokens = name.toLowerCase().split(/\s+/);
  if (tokens.includes("front") || tokens.includes("fr")) return 0;
  if (tokens.includes("frontleft") || tokens.includes("frontright")) return 1;
  if (/\s+(?:lat\s+(?:dx|sx)|trequa)$/i.test(name)) return 3;
  if (!tokens.some((token) => machineViewTokens.has(token))) return 2;
  return 3;
}

function groupMachineViews(products: MachineProduct[]) {
  const grouped = new Map<string, MachineProduct>();

  for (const product of products) {
    const name = machineProductName(product.name);
    const key = `${normalizeFilename(product.brand)}:${normalizeFilename(name)}`;
    const existing = grouped.get(key);

    if (
      !existing ||
      machineViewPriority(product.name) < machineViewPriority(existing.name)
    ) {
      grouped.set(key, { ...product, name });
    }
  }

  return [...grouped.values()];
}

async function loadMachineProducts(): Promise<MachineProduct[]> {
  const supabase = createClient();
  const bucket = supabase.storage.from(espressoMachineBucket);

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

  async function walk(
    path: string,
    parentBrand?: string,
    parentGroup?: number
  ): Promise<MachineProduct[]> {
    const entries = await listDirectory(path);
    const files: MachineProduct[] = [];

    for (const entry of entries) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.id === null) {
        const folderGroup = groupCountFromPath(entryPath);
        const isGroupFolder = groupCountFromPath(entry.name) !== undefined;
        const nestedBrand =
          parentBrand ?? (parentGroup || isGroupFolder ? undefined : brandDisplayName(entry.name));
        files.push(...(await walk(entryPath, nestedBrand, folderGroup ?? parentGroup)));
        continue;
      }

      if (!imageExtensions.test(entry.name)) continue;

      const knownDetails = knownMachineDetails.get(normalizeFilename(entry.name));
      const nameGroup = `${entryPath} ${entry.name}`.match(
        /(?:^|[\s/_-])([123])\s*(?:groups?|gr)\b/i
      )?.[1];
      const brand = parentBrand ?? inferMachineBrand(entryPath) ?? "Other";
      const name = productDisplayName(entry.name);
      if (!isEspressoMachineProduct(name, brand)) continue;

      files.push({
        name,
        brand,
        path: entryPath,
        src: bucket.getPublicUrl(entryPath).data.publicUrl,
        contentTag: normalizeContentTag(entry.metadata?.eTag),
        groups: groupCountFromPath(entryPath) ?? parentGroup ?? knownDetails?.groups ??
          (nameGroup ? Number(nameGroup) : undefined),
        uses: knownDetails?.uses,
      });
    }

    return files;
  }

  const products = await walk("");
  const uniqueProducts = new Map<string, MachineProduct>();
  const seenImageContent = new Map<string, (number | undefined)[]>();
  for (const product of products) {
    const brandKey = normalizeFilename(product.brand);
    const nameKey = normalizeFilename(product.name);
    const productKey = `${brandKey}:${nameKey}`;
    const existing = uniqueProducts.get(productKey);
    const hasDistinctGroupVariant =
      existing?.groups !== undefined &&
      product.groups !== undefined &&
      existing.groups !== product.groups;
    const key = hasDistinctGroupVariant
      ? `${productKey}:group-${product.groups}`
      : productKey;
    const contentKey = product.contentTag;
    const priorGroups = contentKey ? seenImageContent.get(contentKey) ?? [] : [];
    const duplicateContent =
      contentKey &&
      priorGroups.some(
        (priorGroup) =>
          priorGroup === undefined ||
          product.groups === undefined ||
          priorGroup === product.groups
      );

    // Keep distinct group-count variants even when Storage reports identical image content.
    if (duplicateContent && !uniqueProducts.has(key)) continue;

    const current = uniqueProducts.get(key);
    if (!current || (!current.groups && product.groups)) {
      uniqueProducts.set(key, product);
    }
    if (contentKey && !priorGroups.includes(product.groups)) {
      seenImageContent.set(contentKey, [...priorGroups, product.groups]);
    }
  }

  return groupMachineViews([...uniqueProducts.values()]).sort(
    (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );
}

async function loadUseProducts(bucketName: string): Promise<MachineProduct[]> {
  const bucket = createClient().storage.from(bucketName);

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

  async function walk(path: string): Promise<MachineProduct[]> {
    const entries = await listDirectory(path);
    const products: MachineProduct[] = [];

    for (const entry of entries) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.id === null) {
        products.push(...(await walk(entryPath)));
        continue;
      }

      if (!imageExtensions.test(entry.name)) continue;

      const nameGroup = `${entryPath} ${entry.name}`.match(
        /(?:^|[\s/_-])([123])\s*(?:groups?|gr)\b/i
      )?.[1];
      const parentDirectory = path.split("/").filter(Boolean).at(-1);
      const brand =
        inferMachineBrand(entryPath) ??
        (parentDirectory ? brandDisplayName(parentDirectory) : "Other");
      if (!useEspressoMachineBrands.has(brand)) continue;
      const name = productDisplayName(entry.name);
      if (!isEspressoMachineProduct(name, brand)) continue;

      products.push({
        name,
        brand,
        path: entryPath,
        src: bucket.getPublicUrl(entryPath).data.publicUrl,
        contentTag: normalizeContentTag(entry.metadata?.eTag),
        groups: groupCountFromPath(entryPath) ?? (nameGroup ? Number(nameGroup) : undefined),
      });
    }

    return products;
  }

  return groupMachineViews(await walk("")).sort(
    (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );
}

function catalogHref({
  use,
  group,
  brand,
}: {
  use?: string;
  group?: string;
  brand?: string;
}) {
  const params = new URLSearchParams();
  if (use) params.set("use", use);
  if (group) params.set("group", group);
  if (brand) params.set("brand", brand);
  const query = params.toString();
  return query ? `/espresso-machines?${query}` : "/espresso-machines";
}

export function EspressoMachinesPage({
  use,
  group,
  brand,
}: {
  use?: string;
  group?: string;
  brand?: string;
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [view, setView] = useState<ViewMode>("grid");
  const [machineProducts, setMachineProducts] = useState<MachineProduct[]>([]);
  const [useProducts, setUseProducts] = useState<MachineProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingUseProducts, setIsLoadingUseProducts] = useState(false);
  const [useProductsLoadError, setUseProductsLoadError] = useState<string | null>(null);
  const router = useRouter();
  const groupCount = group === "1" || group === "2" ? Number(group) : undefined;
  const useBucket =
    use === "cafe"
      ? cafeBucket
      : use === "restaurant"
        ? restaurantBucket
        : use === "hotel"
          ? hotelBucket
          : use === "home"
            ? homeBucket
            : use === "office"
              ? officeBucket
          : undefined;
  const productsForFilters = useBucket ? useProducts : machineProducts;
  const brandFilters = useMemo(
    () =>
      [...new Set(productsForFilters.map((item) => item.brand))]
        .sort((a, b) => a.localeCompare(b))
        .map((label) => ({ label, slug: brandSlug(label) })),
    [productsForFilters]
  );
  const activeBrand = brandFilters.find((item) => item.slug === brand)?.slug;
  const useLabel = use ? espressoUseLabels[use] : undefined;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const products = await loadMachineProducts();
        if (active) setMachineProducts(products);
      } catch (error) {
        console.error(`Unable to load espresso machines from the ${espressoMachineBucket} bucket.`, error);
        if (active) {
          setLoadError(
            "Espresso machines could not be loaded from the product library. Please try again later."
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const bucketName = useBucket ?? "";
    if (!bucketName) return;

    let active = true;
    const selectedUseLabel = useLabel ?? brandDisplayName(bucketName);

    async function loadForUse() {
      try {
        setIsLoadingUseProducts(true);
        setUseProductsLoadError(null);
        setUseProducts([]);
        const products = await loadUseProducts(bucketName);
        if (active) setUseProducts(products);
      } catch (error) {
        console.error(`Unable to load ${selectedUseLabel.toLowerCase()} machines from the ${bucketName} bucket.`, error);
        if (active) {
          setUseProductsLoadError(
            `${selectedUseLabel} machines could not be loaded from the ${bucketName} product library. Please try again later.`
          );
        }
      } finally {
        if (active) setIsLoadingUseProducts(false);
      }
    }

    void loadForUse();
    return () => {
      active = false;
    };
  }, [useBucket, useLabel]);

  const items = useMemo(() => {
    const products = useBucket ? useProducts : machineProducts;
    const next = products.filter((item) => {
      if (!useBucket && use && item.uses && !item.uses.includes(use)) return false;
      if (groupCount && item.groups !== groupCount) return false;
      if (activeBrand && brandSlug(item.brand) !== activeBrand) return false;
      return true;
    });

    if (sort === "az") next.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") next.sort((a, b) => b.name.localeCompare(a.name));
    return next;
  }, [activeBrand, groupCount, machineProducts, sort, use, useBucket, useProducts]);

  const currentIsLoading = useBucket ? isLoadingUseProducts : isLoading;
  const currentLoadError = useBucket ? useProductsLoadError : loadError;

  function updateFilters(next: { use?: string; group?: string; brand?: string }) {
    router.push(catalogHref(next));
  }

  function toggleGroup(value: string) {
    updateFilters({
      use,
      brand: activeBrand,
      group: group === value ? undefined : value,
    });
  }

  function toggleBrand(value: string) {
    updateFilters({
      use,
      group: groupCount ? String(groupCount) : undefined,
      brand: activeBrand === value ? undefined : value,
    });
  }

  return (
    <main className="flex-1 overflow-hidden bg-[#FFF3F4] text-[#30231e]">
      <section className="relative isolate h-[300px] overflow-hidden border-b border-[#f4b7c0] bg-[#FCE4E7] sm:h-[340px] lg:h-[380px]">
        <Image
          src="/images/espresso-machines-hero-modern.png"
          alt="Professional espresso machine"
          fill
          priority
          className="z-0 object-cover object-[70%_center] sm:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(255,235,239,.5)_0%,rgba(255,235,239,.32)_38%,transparent_68%)]" />
        <div className="relative z-20 mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
          <div className="max-w-[620px]">
            <h1 className="font-serif text-[32px] leading-[1.05] font-bold tracking-tight text-[#3b1c17] sm:text-[42px] lg:text-[54px]">
              Precision. Performance.
              <span className="block font-semibold italic text-[#d0122d]">
                Exceptional Coffee.
              </span>
            </h1>
            <p className="mt-4 max-w-[490px] text-sm leading-relaxed text-[#30231e] sm:text-base">
              Discover our premium range of espresso machines from world-renowned
              brands, designed for cafés, restaurants, and coffee businesses.
            </p>
            <Link
              href="#machine-products"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d0122d] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(208,18,45,.2)] transition hover:bg-[#a91020]"
            >
              Explore Our Machines <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="rounded-[26px] border border-[#f8d5d9] bg-[linear-gradient(115deg,#fff_0%,#FFF3F4_50%,#FCE4E7_100%)] px-4 py-4 shadow-[0_8px_24px_rgba(215,25,45,.06)] sm:px-7 sm:py-5">
          <h2 className="text-center font-serif text-[22px] leading-none font-bold text-[#D7192D] sm:text-[28px]">
            Shop Machine
          </h2>
          <p className="mt-1 text-center text-xs text-[#4c3938] sm:text-sm">
            Choose where the machine will live
          </p>
          <div className="mt-3 flex gap-4 overflow-x-auto px-1 pb-1 sm:justify-center sm:gap-7 sm:overflow-visible">
            {espressoShopUses.map((item) => {
              const active = use === item.slug;
              return (
                <Link
                  key={item.slug}
                  href={catalogHref({
                    use: active ? undefined : item.slug,
                    group: groupCount ? String(groupCount) : undefined,
                    brand: activeBrand,
                  })}
                  className="group flex w-[86px] shrink-0 flex-col items-center gap-1.5 sm:w-[112px] sm:gap-2"
                >
                  <span
                    className={cn(
                      "relative block size-[78px] overflow-hidden rounded-full border-[3px] border-white shadow-[0_4px_12px_rgba(80,40,30,.18)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(215,25,45,.2)] sm:size-[104px]",
                      active && "ring-2 ring-[#D7192D] ring-offset-2 ring-offset-[#FFF3F4]"
                    )}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="104px"
                    />
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold sm:text-sm",
                      active ? "text-[#D7192D]" : "text-[#D7192D]"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="machine-products"
        className="mx-auto max-w-[1440px] px-3 pb-5 sm:px-5 lg:px-8"
      >
        <div className="grid items-start gap-3 md:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-4">
          <aside className="rounded-xl border border-[#f8d5d9] bg-[linear-gradient(145deg,#FCE4E7,#FFF3F4)] p-3 shadow-[0_4px_14px_rgba(215,25,45,.06)] sm:p-4">
            <h2 className="border-b border-[#efc5cb] pb-2 font-serif text-sm font-bold text-[#3b1c17] sm:text-base">
              Filter Products
            </h2>
            <fieldset className="mt-3">
              <legend className="mb-1.5 text-[11px] font-bold text-[#3b1c17] sm:text-xs">
                Brand
              </legend>
              <div className="space-y-1.5">
                {brandFilters.map((item) => (
                  <label key={item.slug} className="flex cursor-pointer items-center gap-2 text-[10px] text-[#645b5b] sm:text-xs">
                    <input
                      type="checkbox"
                      checked={activeBrand === item.slug}
                      onChange={() => toggleBrand(item.slug)}
                      className="size-3 accent-[#D7192D]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="mb-1.5 text-[11px] font-bold text-[#3b1c17] sm:text-xs">
                Group
              </legend>
              <div className="space-y-1.5">
                {[
                  { value: "1", label: "1 Group" },
                  { value: "2", label: "2 Groups" },
                ].map((item) => (
                  <label key={item.value} className="flex cursor-pointer items-center gap-2 text-[10px] text-[#645b5b] sm:text-xs">
                    <input
                      type="checkbox"
                      checked={group === item.value}
                      onChange={() => toggleGroup(item.value)}
                      className="size-3 accent-[#D7192D]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={() => updateFilters({})}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#D7192D] px-2 py-2 text-[10px] font-semibold text-white transition hover:bg-[#b91427] sm:text-xs"
            >
              <RotateCcw className="size-3" />
              Reset Filters
            </button>
          </aside>

          <div className="min-w-0">
            <div className="flex min-h-[38px] flex-wrap items-center justify-between gap-2 px-1">
              <p className="text-[11px] text-[#4c3938] sm:text-xs">
                {currentIsLoading
                  ? "Loading machines…"
                  : `Showing ${items.length ? 1 : 0}–${items.length} of ${items.length} results${useLabel ? ` · ${useLabel}` : ""}`}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="espresso-sort" className="text-[10px] sm:text-xs">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="espresso-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-8 appearance-none rounded-md border border-[#f3d4d8] bg-white px-2 pr-7 text-[10px] outline-none focus:border-[#D7192D] sm:text-xs"
                  >
                    <option value="default">Default</option>
                    <option value="az">Name A–Z</option>
                    <option value="za">Name Z–A</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2" />
                </div>
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={cn("rounded-md p-1.5", view === "grid" ? "bg-[#D7192D] text-white" : "bg-white text-[#D7192D]")}
                >
                  <Grid2X2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setView("list")}
                  className={cn("rounded-md p-1.5", view === "list" ? "bg-[#D7192D] text-white" : "bg-white text-[#D7192D]")}
                >
                  <List className="size-3.5" />
                </button>
              </div>
            </div>

            {currentIsLoading ? (
              <p role="status" className="rounded-xl border border-[#FCE4E7] bg-white p-5 text-sm text-[#645b5b]">
                {useBucket ? `Loading ${useLabel?.toLowerCase()} machines…` : "Loading espresso machines…"}
              </p>
            ) : currentLoadError ? (
              <p role="alert" className="rounded-xl border border-[#f1b8c0] bg-white p-5 text-sm text-[#8f1927]">
                {currentLoadError}
              </p>
            ) : items.length ? (
              <div
                className={cn(
                  "grid gap-2",
                  view === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {items.map((item) => (
                  <article
                    key={item.path}
                    className={cn(
                      "group overflow-hidden rounded-xl border border-[#FCE4E7] bg-white shadow-[0_3px_12px_rgba(215,25,45,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(215,25,45,.12)]",
                      view === "list" && "flex items-center gap-3 p-2"
                    )}
                  >
                    <Link
                      href={catalogHref({ use, group, brand: brandSlug(item.brand) })}
                      aria-label={`View ${item.brand} ${item.name}`}
                      className={cn(
                        "relative block overflow-hidden bg-[#FFF3F4]",
                        view === "grid" ? "h-[110px] sm:h-[145px] lg:h-[170px]" : "h-[84px] w-[100px] shrink-0 rounded-lg"
                      )}
                    >
                      <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 28vw, 45vw"
                      />
                    </Link>
                    <div className={cn("p-2 text-center", view === "list" && "flex min-w-0 flex-1 items-center justify-between gap-2 text-left")}>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold tracking-wide text-[#D7192D] uppercase sm:text-[10px]">
                          {item.brand}
                        </p>
                        <h3 className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[#30231e] sm:text-xs">
                          {item.name}
                        </h3>
                        {item.groups ? (
                          <p className="mt-0.5 text-[9px] text-[#746b6b] sm:text-[10px]">
                            {item.groups === 1 ? "Single group" : "Double group"}
                          </p>
                        ) : null}
                      </div>
                      <Link
                        href={catalogHref({ use, group, brand: brandSlug(item.brand) })}
                        className="mt-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#D7192D] px-3 py-1 text-[9px] font-semibold text-white transition hover:bg-[#b91427] sm:text-[10px]"
                      >
                        View Details <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[#FCE4E7] bg-white p-5 text-sm text-[#645b5b]">
                {(useBucket ? useProducts : machineProducts).length
                  ? "No espresso machines match these filters."
                  : useBucket
                    ? `No espresso machine images were found in the ${useBucket} product library.`
                    : "No espresso machines were found in the product library."}
              </p>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
