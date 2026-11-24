"use client";

import { useEffect, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

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

function formatDetailDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(date);
}

export function EventDetailPage({ slug }: { slug: string }) {
  const fallback = uniqueNewsEvents([...fallbackNewsEvents, ...fallbackNewsOnly]).find(
    (item) => item.href.split("/").pop() === slug
  );
  const [item, setItem] = useState<NewsEventItem | null>(fallback ?? null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void withSupabaseFallback(async () => {
      const [newsQuery, eventQuery] = await Promise.all([
        supabase.from("news").select("*").order("sort_order"),
        supabase.from("events").select("*").order("sort_order"),
      ]);
      const newsRows = ((newsQuery.data ?? []) as Record<string, unknown>[]).filter(isPublished);
      const eventRows = ((eventQuery.data ?? []) as Record<string, unknown>[]).filter(isPublished);
      const items = uniqueNewsEvents([
        ...mapEventRows(eventRows),
        ...(newsRows.length ? mapNewsRows(newsRows) : fallbackNewsOnly),
        ...fallbackNewsEvents,
      ]);
      setItem(items.find((entry) => entry.href.split("/").pop() === slug) ?? null);
      setLoaded(true);
    });
  }, [slug]);

  if (!item && !loaded) {
    return <main className="min-h-[40vh] flex-1 bg-[#fff7f2]" aria-busy="true" />;
  }

  if (!item) {
    return (
      <main className="flex min-h-[45vh] flex-1 items-center justify-center bg-[#fff7f2] px-5">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#392a23]">Event not found</h1>
          <Link
            href="/news-events"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#c51d2d] hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to News &amp; Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#fff7f2] px-5 py-7 sm:px-8 sm:py-10">
      <section className="mx-auto max-w-[980px]">
        <h1 className="mb-5 font-serif text-[32px] leading-tight text-[#3b2b25] sm:text-[40px]">
          {item.isEvent ? "Events" : "News"}
        </h1>
        <article className="overflow-hidden rounded-[26px] bg-white shadow-[0_14px_38px_rgba(83,52,32,.08)]">
          <div className="relative aspect-[2.4] min-h-[210px] bg-[#eee6df] sm:min-h-[320px]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              preload
              sizes="(min-width: 1024px) 980px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="px-6 py-6 sm:px-9 sm:py-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#c4a484] px-4 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
                {item.category}
              </span>
              {item.date ? (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#94919c]">
                  <CalendarDays className="size-4" />
                  {formatDetailDate(item.date)}
                </span>
              ) : null}
            </div>
            <h2 className="mt-5 font-serif text-[30px] leading-tight text-[#312e31] sm:text-[38px]">
              {item.title.replace(/^Prokrate at /i, "")}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-[#777783] sm:text-[19px]">
              {item.description}
            </p>
            {item.location ? (
              <p className="mt-5 inline-flex items-center gap-2 text-[15px] text-[#777783]">
                <MapPin className="size-4" />
                {item.location}
              </p>
            ) : null}
          </div>
        </article>
        <Link
          href="/news-events"
          className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#bd1c2c] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to News &amp; Events
        </Link>
      </section>
    </main>
  );
}