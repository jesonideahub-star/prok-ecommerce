import { mapEventRow, mapNewsRow, type EventCard, type NewsCard } from "@/lib/cms/public";
import { newsItems } from "@/lib/site";

export type NewsEventItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  location: string;
  href: string;
  isEvent: boolean;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function newsEventHref(title: string) {
  return `/news-events/${slugify(title)}`;
}

export const fallbackNewsEvents: NewsEventItem[] = [
  {
    id: "fallback-wofex",
    title: "Prokrate at WOFEX Mindanao 2025",
    description:
      "Prokrate Trading Corporation continues to bring premium coffee solutions at WOFEX Mindanao 2025, showcasing our espresso machines, grinders, and coffee beans.",
    image: "/images/news-wofex-mindanao.png",
    category: "Trade Show",
    date: "2025-04-25",
    location: "Mindanao",
    href: newsEventHref("WOFEX Mindanao 2025"),
    isEvent: true,
  },
  {
    id: "fallback-barista-training",
    title: "Hands-on Barista Training",
    description:
      "Our latest barista training session empowered coffee professionals with advanced brewing techniques and creative latte art skills.",
    image: "/images/training-hero.png",
    category: "Training",
    date: "2025-03-15",
    location: "Davao City",
    href: newsEventHref("Hands-on Barista Training"),
    isEvent: true,
  },
  {
    id: "fallback-coffee-partnerships",
    title: "Prokrate Partners with Top Coffee Brands",
    description:
      "Strengthening our commitment to quality, Prokrate welcomes new partnerships with world-renowned coffee brands.",
    image: "/images/news-wofex-mindanao.png",
    category: "News",
    date: "2025-02-20",
    location: "Philippines",
    href: newsEventHref("Prokrate Partners with Top Coffee Brands"),
    isEvent: false,
  },
];

function formattedDate(value: string) {
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

export function mapNewsItem(item: NewsCard): NewsEventItem {
  const titleSlug = slugify(item.title);
  const screenshotMatch = titleSlug === "wofex-mindanao-2025"
    ? fallbackNewsEvents[0]
    : titleSlug.includes("hands-on-barista-courses")
      ? fallbackNewsEvents[1]
      : titleSlug.includes("specialists-trained-by-the-people")
        ? fallbackNewsEvents[2]
        : null;
  if (screenshotMatch) return { ...screenshotMatch, id: item.id };

  const label = `${item.tag} ${item.title}`;
  const isTraining = /training|academy/i.test(label);
  const isPressRelease = /press release/i.test(label);
  const category = isTraining ? "Training" : isPressRelease ? "Press Releases" : "News";
  return {
    id: item.id,
    title: item.title,
    description: item.excerpt,
    image: item.src,
    category,
    date: formattedDate(item.date),
    location: "",
    href: newsEventHref(item.title),
    isEvent: false,
    ...(titleSlug === "wofex-mindanao-2025" ? { category: "Trade Show", isEvent: true } : {}),
  };
}

export function mapEventItem(item: EventCard): NewsEventItem {
  const isWofex = slugify(item.title) === "wofex-mindanao-2025";
  return {
    id: item.id,
    title: isWofex ? fallbackNewsEvents[0].title : item.title,
    description: item.description,
    image: item.src,
    category: item.category || "Event",
    date: formattedDate(item.date),
    location: item.location,
    href: newsEventHref(item.title),
    isEvent: true,
  };
}

export function mapNewsRows(rows: Record<string, unknown>[]) {
  return rows.map((row) => mapNewsItem(mapNewsRow(row)));
}

export function mapEventRows(rows: Record<string, unknown>[]) {
  return rows.map((row) => mapEventItem(mapEventRow(row)));
}

export function uniqueNewsEvents(items: NewsEventItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = slugify(item.title.replace(/^prokrate at /i, ""));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const fallbackNewsOnly: NewsEventItem[] = newsItems.map((item, index) =>
  mapNewsItem({
    id: `fallback-news-${index}`,
    featured: item.featured,
    tag: item.tag,
    date: item.date,
    title: item.title,
    excerpt: item.excerpt,
    href: item.href,
    src: item.src,
    alt: item.alt,
  })
);
