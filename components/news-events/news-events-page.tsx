"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { CalendarDays, ChevronDown } from "lucide-react";

import { isPublished } from "@/lib/cms/public";
import { createClient } from "@/lib/supabase/client";
import { withSupabaseFallback } from "@/lib/supabase/safe";
import {
  fallbackNewsEvents,
  fallbackNewsOnly,
  mapEventRows,
  mapNewsRows,
  uniqueNewsEvents,
  type NewsEventItem,
} from "@/components/news-events/news-events-data";

const categories = ["All", "Events", "Training", "News", "Press Releases"] as const;
type Category = (typeof categories)[number];
const PAGE_SIZE = 6;

function matchesCategory(item: NewsEventItem, category: Category) {
  if (category === "All") return true;
  if (category === "Events") return item.isEvent;
  return item.category.toLowerCase() === category.toLowerCase();
}

function displayDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function NewsEventsPage() {
  const [items, setItems] = useState<NewsEventItem[]>(fallbackNewsEvents);
  const [category, setCategory] = useState<Category>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const supabase = createClient();
    void withSupabaseFallback(async () => {
      const [newsQuery, eventQuery] = await Promise.all([
        supabase.from("news").select("*").order("sort_order"),
        supabase.from("events").select("*").order("sort_order"),
      ]);
      const newsRows = ((newsQuery.data ?? []) as Record<string, unknown>[]).filter(isPublished);
      const eventRows = ((eventQuery.data ?? []) as Record<string, unknown>[]).filter(isPublished);

      const newsItems = newsRows.length ? mapNewsRows(newsRows) : fallbackNewsOnly;
      const eventItems = mapEventRows(eventRows);
      const combined = uniqueNewsEvents([...eventItems, ...newsItems]);
      setItems(combined.length ? combined : fallbackNewsEvents);
    });
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => matchesCategory(item, category)),
    [items, category]
  );
  const visible = filtered.slice(0, visibleCount);

  return (
    <main className="flex-1 overflow-hidden bg-[#fff6f6]">
      <section className="relative isolate h-[150px] overflow-hidden border-y border-[#ed8c99] bg-[#ffe8eb] sm:h-[170px]">
        <Image
          src="/images/news-events-hero.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,247,247,.28),transparent_58%)]" />
        <h1 className="sr-only">News &amp; Events</h1>
      </section>

      <section className="relative isolate min-h-[300px] overflow-hidden px-4 pt-4 pb-6 sm:px-6 sm:pt-5 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,#fffdfd_0%,#fff6f6_70%,#ffe8ea_100%)]" />
        <div className="mx-auto max-w-[1280px]">
          <nav aria-label="Filter news and events" className="mb-4 flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-medium transition ${
                  category === item
                    ? "border-[#e50925] bg-[#e50925] text-white shadow-[0_3px_8px_rgba(229,9,37,.16)]"
                    : "border-[#eadada] bg-white/70 text-[#4c4141] hover:border-[#ed8792] hover:text-[#d0122d]"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {visible.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[16px] border border-white/80 bg-white/90 shadow-[0_5px_18px_rgba(108,43,48,.09)] transition-shadow hover:shadow-[0_9px_24px_rgba(108,43,48,.15)]"
                >
                  <Link href={item.href} className="block">
                    <div className="relative h-[150px] overflow-hidden bg-[#f2e7e4] sm:h-[165px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {item.date ? (
                        <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#e50925] px-2.5 py-1 text-[9px] font-semibold text-white shadow-sm">
                          <CalendarDays className="size-3" />
                          {displayDate(item.date)}
                        </span>
                      ) : null}
                    </div>
                    <div className="px-3 py-3">
                      <h2 className="line-clamp-1 font-serif text-[15px] leading-tight font-bold text-[#3d302d]">
                        {item.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-[#5b5352]">
                        {item.description}
                      </p>
                      {item.location ? (
                        <p className="mt-1.5 text-[9px] text-[#817776]">· {item.location}</p>
                      ) : null}
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#d0122d] underline underline-offset-2">
                        Read More
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#f1d9d9] bg-white/75 px-4 py-12 text-center text-sm text-[#706667]">
              No {category.toLowerCase()} items are available right now.
            </p>
          )}

          {visibleCount < filtered.length ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#e50925] px-5 py-2 text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(229,9,37,.18)] transition hover:bg-[#bd1024]"
              >
                Load More
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
