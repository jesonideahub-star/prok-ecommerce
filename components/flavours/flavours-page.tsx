"use client";

import { useMemo, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  RotateCcw,
} from "lucide-react";

import {
  flavourCategories,
  flavourProducts,
  flavourTabCopy,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type SortKey = "default" | "az" | "za";
type FlavourTab = (typeof flavourCategories)[number]["slug"];

const featuredFlavours = [
  { label: "Vanilla", match: "vanilla", src: "/images/sauce-vanilla-cutout.png" },
  { label: "Caramel", match: "caramel", src: "/images/syrup-caramel-2l-cutout.png" },
  { label: "Hazelnut", match: "hazelnut", src: "/images/syrup-hazelnut-cutout.png" },
  { label: "Chocolate", match: "chocolate", src: "/images/syrup-chocolate-cutout.png" },
  {
    label: "Strawberry",
    match: "strawberry",
    src: "/images/sauce-fruity-strawberry-cutout.png",
  },
] as const;

const heroBottles = [
  { src: "/images/sauce-vanilla-cutout.png", alt: "Catcher Gourmet vanilla sauce" },
  { src: "/images/syrup-caramel-2l-cutout.png", alt: "Catcher Gourmet caramel syrup" },
  { src: "/images/syrup-hazelnut-cutout.png", alt: "Catcher Gourmet hazelnut syrup" },
  { src: "/images/syrup-chocolate-cutout.png", alt: "Catcher Gourmet chocolate syrup" },
  { src: "/images/sauce-fruity-strawberry-cutout.png", alt: "Catcher Gourmet strawberry sauce" },
] as const;

function matchesFlavour(productName: string, flavour: string) {
  return productName.toLowerCase().includes(flavour);
}

export function FlavoursPage({ tab }: { tab?: string }) {
  const [sort, setSort] = useState<SortKey>("default");
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [listView, setListView] = useState(false);
  const router = useRouter();
  const activeTab =
    tab === "syrups" || tab === "sauce" || tab === "powder"
      ? (tab as FlavourTab)
      : undefined;
  const activeCategory = flavourCategories.find((item) => item.slug === activeTab);
  const tabCopy = activeTab ? flavourTabCopy[activeTab] : undefined;

  const items = useMemo(() => {
    const next = flavourProducts.filter((item) => {
      if (activeTab && item.tab !== activeTab) return false;
      if (
        selectedFlavours.length &&
        !selectedFlavours.some((flavour) => matchesFlavour(item.name, flavour))
      ) {
        return false;
      }
      return true;
    });

    if (sort === "az") next.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") next.sort((a, b) => b.name.localeCompare(a.name));
    return next;
  }, [activeTab, selectedFlavours, sort]);

  function toggleFlavour(flavour: string) {
    setSelectedFlavours((current) =>
      current.includes(flavour)
        ? current.filter((value) => value !== flavour)
        : [...current, flavour]
    );
  }

  return (
    <main className="flex-1 overflow-hidden bg-[#fff5f6] text-[#292226]">
      <section className="relative isolate min-h-[205px] overflow-hidden border-y border-[#f5b5c0] bg-[linear-gradient(108deg,#fff7f8_0%,#ffe4e9_53%,#f8bcc8_100%)] sm:min-h-[220px]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[10%] top-[-310px] size-[610px] rounded-full border-[26px] border-white/60" />
          <div className="absolute left-[27%] top-[-340px] size-[670px] rounded-full border-[22px] border-[#f5a1b0]/30" />
          <div className="absolute right-[-8%] bottom-[-290px] size-[580px] rounded-full border-[30px] border-white/60" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(174deg,transparent_0_30%,rgba(228,24,52,.16)_31%_43%,transparent_44%)]" />
        </div>
        <div className="relative mx-auto flex min-h-[205px] max-w-[1440px] items-center px-5 py-5 sm:min-h-[220px] sm:px-8">
          <div className="relative z-10 max-w-[54%] sm:max-w-[48%]">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#dc182e] uppercase sm:text-[12px]">
              Catcher Gourmet Flavours
            </p>
            <h1 className="mt-1 font-serif text-[32px] leading-[.98] font-bold text-[#4c2228] sm:text-[48px]">
              {tabCopy?.title ?? "Flavours."}
            </h1>
            <p className="mt-1 font-serif text-[18px] leading-tight font-bold text-[#df1832] italic sm:text-[27px]">
              Add a Touch of Delight.
            </p>
            <p className="mt-2 max-w-[370px] text-[10px] leading-snug text-[#4d4144] sm:text-[12px]">
              Enhance your coffee creations with our premium Catcher Gourmet flavours range.
            </p>
            <a
              href="#our-flavours"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e50925] px-4 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024] sm:text-[11px]"
            >
              Explore Our Flavours
              <ArrowRight className="size-3" />
            </a>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[55%] items-end justify-center gap-[1%] overflow-hidden sm:w-[53%]">
            {heroBottles.map((bottle, index) => (
              <span
                key={bottle.src}
                className="relative h-[70%] min-w-0 flex-1 sm:h-[82%]"
                style={{ transform: `translateY(${index % 2 ? 3 : 0}px)` }}
              >
                <Image
                  src={bottle.src}
                  alt={bottle.alt}
                  fill
                  sizes="(min-width: 768px) 10vw, 14vw"
                  className="object-contain object-bottom drop-shadow-[0_8px_8px_rgba(74,27,30,.14)]"
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="our-flavours" className="mx-auto max-w-[1440px] px-4 pt-2 sm:px-6">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-[#f3a5b0]" />
          <h2 className="font-serif text-[20px] font-bold text-[#4c2228] sm:text-[24px]">
            Our Flavours
          </h2>
          <span className="h-px flex-1 bg-[#f3a5b0]" />
        </div>
        <div className="mx-auto mt-2 grid max-w-[1120px] grid-cols-3 gap-3 sm:gap-8">
          {flavourCategories.map((item) => {
            const active = activeCategory?.slug === item.slug;
            return (
              <Link
                key={item.slug}
                href={active ? "/flavours" : `/flavours?tab=${item.slug}`}
                aria-current={active ? "page" : undefined}
                className="group flex min-w-0 flex-col items-center gap-2 py-2 sm:gap-3"
              >
                <span
                  className={cn(
                    "relative size-[92px] overflow-hidden rounded-full border border-[#dedede] bg-white shadow-[0_3px_10px_rgba(81,31,37,.12)] transition-transform group-hover:scale-105 sm:size-[132px] lg:size-[160px]",
                    active && "ring-2 ring-[#b34d20] ring-offset-2"
                  )}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 132px, 92px"
                    className={cn(
                      item.padded ? "object-contain p-3 sm:p-4" : "object-cover"
                    )}
                  />
                </span>
                <span className="text-[16px] font-semibold text-[#ad4c20] sm:text-[20px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-3 pb-3 pt-1 sm:px-5">
        <div className="grid gap-2 lg:grid-cols-[152px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[12px] border border-[#f3cbd1] bg-[linear-gradient(145deg,#fff0f2,#ffe6ea)] p-3 shadow-[0_4px_12px_rgba(112,29,42,.05)]">
            <h2 className="text-[12px] font-bold text-[#4c3035]">Filter Products</h2>
            <div className="my-2 h-px bg-[#e7a9b4]" />
            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold text-[#4c3035]">
                Flavour
              </legend>
              <div className="space-y-1">
                {featuredFlavours.map((flavour) => (
                  <label
                    key={flavour.match}
                    className="flex cursor-pointer items-center gap-2 text-[11px] text-[#554b4e]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFlavours.includes(flavour.match)}
                      onChange={() => toggleFlavour(flavour.match)}
                      className="size-3.5 accent-[#e50925]"
                    />
                    {flavour.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={() => {
                setSelectedFlavours([]);
                setSort("default");
                router.push("/flavours");
              }}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#e50925] px-2 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
            >
              <RotateCcw className="size-3" />
              Reset Filters
            </button>
          </aside>

          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="text-[10px] text-[#51484b] sm:text-[11px]">
                {items.length
                  ? `Showing 1–${items.length} of ${items.length} results`
                  : "Showing 0 results"}
              </p>
              <div className="flex items-center gap-1.5">
                <label htmlFor="flavour-sort" className="text-[10px] text-[#51484b]">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="flavour-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-7 w-[90px] appearance-none rounded-full border border-[#ead4d8] bg-white px-2.5 pr-6 text-[10px] text-[#383135] outline-none focus:border-[#dc263e] sm:w-[108px]"
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

            {items.length ? (
              <div
                className={cn(
                  "grid gap-1.5 sm:gap-2",
                  listView ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
                )}
              >
                {items.map((item, index) => {
                  const hasProductType = /\b(syrup|sauce|mix|powder)\b/i.test(item.name);
                  const productType =
                    item.tab === "syrups"
                      ? "Syrup"
                      : item.tab === "sauce"
                        ? "Flavoured Sauce"
                        : "Mix";

                  return (
                    <article
                      key={`${item.tab}-${item.name}`}
                      className={cn(
                        "group overflow-hidden rounded-[11px] border border-[#f5d9de] bg-white/90 shadow-[0_2px_8px_rgba(94,35,43,.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_16px_rgba(94,35,43,.1)]",
                        listView ? "flex min-h-[105px] flex-row" : "flex min-h-[150px] flex-col"
                      )}
                    >
                      <div
                        className={cn(
                          "relative bg-white",
                          listView ? "h-[105px] w-[100px] shrink-0" : "h-[82px] shrink-0 sm:h-[94px]"
                        )}
                      >
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          preload={index < 2}
                          sizes={listView ? "100px" : "(min-width: 1280px) 17vw, 45vw"}
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-center px-2 pb-1.5 text-center">
                        <p className="line-clamp-1 text-[9px] leading-tight font-semibold text-[#242024] sm:text-[10px]">
                          Catcher Gourmet {item.name}
                          {hasProductType ? "" : ` ${productType}`}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[8px] text-[#70676b]">
                          {flavourCategories.find((category) => category.slug === item.tab)?.label}
                        </p>
                        <Link
                          href="/brands?brand=catcher-gourmet"
                          className="mt-auto inline-flex items-center gap-1 rounded-full bg-[#e50925] px-2.5 py-1 text-[9px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
                        >
                          View Details
                          <ArrowRight className="size-2.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="flex min-h-[170px] items-center justify-center rounded-xl border border-[#f3cbd1] bg-white/70 text-sm text-zinc-500">
                No flavours listed for this selection yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-[#f2c5cd] bg-[linear-gradient(108deg,#ffedf0_0%,#fff7f8_43%,#ffdfe5_100%)]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 bottom-[-180px] size-[350px] rounded-full border-[26px] border-[#ec4660]/20" />
          <div className="absolute right-[-40px] top-[-220px] size-[400px] rounded-full border-[26px] border-white/75" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(170deg,transparent_0_35%,rgba(230,23,56,.14)_36%_55%,transparent_56%)]" />
        </div>
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-3 px-5 py-4 text-center sm:flex-row sm:justify-center sm:gap-7">
          <Image
            src="/images/brand-catcher-official.png"
            alt="Catcher Gourmet"
            width={1164}
            height={437}
            sizes="180px"
            className="h-[58px] w-[150px] object-contain sm:h-[72px] sm:w-[180px]"
          />
          <span className="hidden h-[72px] w-px bg-[#e44352] sm:block" />
          <div>
            <h2 className="font-serif text-[17px] leading-tight font-bold text-[#501b21] sm:text-[20px] italic">
              Premium Flavours for a Perfect Coffee Experience.
            </h2>
            <p className="mt-0.5 text-[10px] text-[#453c3f] sm:text-[11px]">
              Create. Enjoy. Repeat.
            </p>
            <Link
              href="/brands?brand=catcher-gourmet"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e50925] px-5 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
            >
              Discover More
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
