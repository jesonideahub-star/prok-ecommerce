"use client";

import { useEffect, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Diamond,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

import { newsItems } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type HomeSlide = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  href: string;
  cta: string;
};

const fallbackSlides: HomeSlide[] = [
  {
    src: "/images/hero-beans.png",
    alt: "Premium roasted coffee and professional coffee equipment",
    eyebrow: "Premium Quality",
    title: "Premium Coffee",
    accent: "Collection",
    body: "Elevate your coffee experience with the finest brands and professional equipment.",
    href: "/coffee",
    cta: "Shop The Collection",
  },
  {
    src: "/images/hero-espresso.png",
    alt: "Commercial espresso machine",
    eyebrow: "Professional Grade",
    title: "Espresso",
    accent: "Machines",
    body: "Cafe, restaurant, and hotel machines built for flavor, steam, and daily service.",
    href: "/espresso-machines",
    cta: "Shop Now",
  },
  {
    src: "/images/hero-training.png",
    alt: "Barista training at the espresso bar",
    eyebrow: "Learn From The Experts",
    title: "Barista",
    accent: "Training",
    body: "Hands-on courses from the first shot to service, for cafe teams and new baristas.",
    href: "/training",
    cta: "Explore",
  },
] as const;

const categories = [
  { title: "Café", body: "Premium coffee blends", href: "/coffee", src: "/images/cafe-interior.png", icon: Coffee },
  { title: "Restaurant", body: "Complete dining solutions", href: "/espresso-machines?use=restaurant", src: "/images/journeyman-cafe-supplied-3.jpg", icon: UtensilsCrossed },
  { title: "Espresso Machines", body: "Professional grade machines", href: "/espresso-machines", src: "/images/hero-espresso.png", icon: Wrench },
  { title: "Barista Training", body: "Learn from the experts", href: "/training", src: "/images/hero-slayer-barista.png", icon: GraduationCap },
] as const;

const trust = [
  { icon: Diamond, title: "Premium Brands", body: "Trusted worldwide" },
  { icon: Truck, title: "Fast Delivery", body: "Across the Philippines" },
  { icon: Headphones, title: "Expert Support", body: "Always here to help" },
  { icon: ShieldCheck, title: "Secure Shopping", body: "Shop with confidence" },
] as const;

const packageCards = [
  {
    name: "Coffee Starter Pack",
    detail: "2kg Coffee + 2 Syrups",
    price: "₱1,199",
    before: "",
    src: "/images/product-marcafe-classico.png",
  },
  {
    name: "Barista Essentials",
    detail: "1kg Coffee + Syrup",
    price: "₱1,499",
    before: "₱1,899",
    src: "/images/product-marcafe-diamante.png",
  },
  {
    name: "Premium Bundle",
    detail: "2kg Coffee + Machine",
    price: "₱9,999",
    before: "₱12,500",
    src: "/images/product-casadio-compact.png",
  },
  {
    name: "Cafe Business Starter",
    detail: "2kg Coffee + Grinder",
    price: "₱14,999",
    before: "₱18,500",
    src: "/images/product-eureka-bravo.png",
  },
] as const;

const topEquipment = [
  {
    name: "Altea Root",
    brand: "La Nuova Era",
    href: "/espresso-machines",
    src: "/images/product-la-nuova-era-altea-root.png",
    rating: "4.8",
    reviews: 120,
  },
  {
    name: "Lamille",
    brand: "La Nuova Era",
    href: "/espresso-machines",
    src: "/images/product-la-nuova-era-lamille.jpg",
    rating: "4.7",
    reviews: 98,
  },
  {
    name: "Eureka Mignon Bravo 50",
    brand: "Eureka Grinder",
    href: "/grinders",
    src: "/images/product-eureka-bravo.png",
    rating: "4.8",
    reviews: 75,
  },
  {
    name: "Eureka Helios 65 HSM",
    brand: "Eureka Grinder",
    href: "/grinders",
    src: "/images/product-helios-75.png",
    rating: "4.7",
    reviews: 64,
  },
  {
    name: "Eureka Specialita Smart 55",
    brand: "Eureka Grinder",
    href: "/grinders",
    src: "/images/product-mignon-specialita.png",
    rating: "4.7",
    reviews: 52,
  },
] as const;

export function RoseHome() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [index, setIndex] = useState(0);
  const [topSellerOffset, setTopSellerOffset] = useState(0);
  const [packageImages, setPackageImages] = useState<string[]>([]);
  const [packageImageError, setPackageImageError] = useState(false);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    let active = true;

    async function loadHomeScreenImages() {
      try {
        const supabase = createClient();
        const bucket = supabase.storage.from("Home_Screen");

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

        async function walk(path: string): Promise<string[]> {
          const entries = await listDirectory(path);
          const imagePaths: string[] = [];

          for (const entry of entries) {
            const entryPath = path ? `${path}/${entry.name}` : entry.name;

            if (entry.id === null) {
              imagePaths.push(...(await walk(entryPath)));
            } else if (/\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name)) {
              imagePaths.push(entryPath);
            }
          }

          return imagePaths;
        }

        const imagePaths = await walk("");
        if (!active || imagePaths.length === 0) return;

        const homeSlides = imagePaths.map((path, slideIndex) => {
          const fallback = fallbackSlides[slideIndex % fallbackSlides.length];
          return {
            ...fallback,
            src: bucket.getPublicUrl(path).data.publicUrl,
            alt: path.split("/").at(-1)?.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") ?? fallback.alt,
          };
        });

        setSlides(homeSlides);
        setIndex(0);
      } catch (error) {
        console.error("Unable to load homepage slides from the Home_Screen bucket.", error);
      }
    }

    void loadHomeScreenImages();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let active = true;

    async function loadPackageImages() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from("package-available")
          .list("", {
            limit: 100,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) {
          throw error;
        }

        if (!active) return;

        const images = (data ?? [])
          .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file.name))
          .map(
            (file) =>
              supabase.storage
                .from("package-available")
                .getPublicUrl(file.name).data.publicUrl
          );

        setPackageImages(images);
      } catch (error) {
        console.error("Unable to load homepage package images from Supabase.", error);
        if (active) setPackageImageError(true);
      }
    }

    void loadPackageImages();
    return () => {
      active = false;
    };
  }, []);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function moveTopSellers(direction: -1 | 1) {
    setTopSellerOffset((current) => (
      current + direction + topEquipment.length
    ) % topEquipment.length);
  }

  const displayedTopEquipment = [
    ...topEquipment.slice(topSellerOffset),
    ...topEquipment.slice(0, topSellerOffset),
  ];

  return (
    <div className="overflow-hidden bg-[#FFF3F4] text-[#2b2118]">
      <section className="mx-auto max-w-[1920px] px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative h-[250px] overflow-hidden rounded-[10px] bg-[#D7192D] text-white sm:h-[340px] lg:h-[520px]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="relative flex h-full items-center px-6 py-8 sm:px-12 lg:px-16">
            <div className="max-w-[520px] [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
              <p className="flex items-center text-xs font-semibold tracking-[0.18em] text-white uppercase">
                <span className="mr-3 h-px w-7 bg-white" />
                {slide.eyebrow}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-[0.9] font-semibold sm:text-5xl lg:text-[58px]">
                {slide.title}
                <span className="block italic text-[#ffd166]">{slide.accent}</span>
              </h1>
              <p className="mt-4 max-w-[430px] text-sm leading-5 text-white sm:text-base sm:leading-6">
                {slide.body}
              </p>
              <Link
                href={slide.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D7192D] px-5 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,0,0,0.3)] transition hover:bg-[#b91427]"
              >
                {slide.cta}
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
          <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/15 text-white backdrop-blur-sm">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/15 text-white backdrop-blur-sm">
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((item, dot) => (
              <button key={`${item.src}-${dot}`} type="button" aria-label={`Show ${item.title}`} onClick={() => setIndex(dot)} className={cn("h-2 rounded-full transition-all", dot === index ? "w-6 bg-white" : "w-2 bg-white/60")} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href} className="group relative h-[118px] overflow-hidden rounded-[10px] bg-[#D7192D] text-white">
              <Image src={item.src} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="25vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/38 to-black/10" />
              <div className="relative flex h-full items-start gap-3 p-4">
                <span className="mt-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D7192D]">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-serif text-xl leading-tight">{item.title}</span>
                  <span className="mt-1 block text-xs text-white/90">{item.body}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium">Explore <ChevronRight className="size-3" /></span>
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[10px] bg-white px-4 py-5 ring-1 ring-[#FCE4E7] sm:grid-cols-2 lg:grid-cols-4 lg:px-2">
          {trust.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 border-[#FCE4E7] px-4 lg:not-last:border-r">
                <Icon className="size-8 shrink-0 text-[#D7192D]" strokeWidth={1.7} />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[#6f6259]">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="relative h-[150px] overflow-hidden rounded-[10px] bg-gradient-to-r from-[#D7192D] to-[#b91427] text-white">
          <div className="relative z-10 px-7 py-5 sm:px-10">
            <p className="font-serif text-xl text-[#FCE4E7] italic">Limited Time Offer</p>
            <p className="mt-1 font-serif text-4xl leading-none font-semibold">Get <span className="text-[#FCE4E7]">20% OFF</span></p>
            <p className="mt-2 text-sm">on selected coffee products</p>
            <Link href="/coffee" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#D7192D]">
              Shop the Deal <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="absolute right-[18%] bottom-0 hidden h-full w-[260px] sm:block">
            <Image src="/images/marcafe-roasted-beans.png" alt="" fill className="object-contain" sizes="260px" />
          </div>
          <div className="absolute right-0 bottom-0 h-full w-[36%] bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.08))]">
            <div className="absolute right-5 bottom-3 hidden font-serif text-2xl leading-tight italic text-white/90 sm:block">
              Better Coffee,<br />Greater Moments
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <div className="pt-2">
            <p className="text-xs font-semibold text-[#D7192D] uppercase">Package Deals</p>
            <h2 className="mt-1 font-serif text-3xl leading-[1.05] font-semibold text-[#2b2118]">More Value,<br />More Savings</h2>
            <p className="mt-3 text-sm leading-5">Get the best deals on our premium coffee bundles.</p>
            <Link href="/espresso-machines" className="mt-4 inline-flex rounded-full bg-[#D7192D] px-5 py-2.5 text-xs font-semibold text-white">Shop Bundles <ChevronRight className="ml-1 inline size-3.5" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {packageCards.map((item, imageIndex) => (
              <article key={item.name} className="relative overflow-hidden rounded-lg bg-white px-3 pb-3 pt-2 text-center ring-1 ring-[#FCE4E7]">
                <span className="absolute right-2 top-2 z-10 rounded-full bg-[#D7192D] px-2 py-1 text-[9px] font-semibold text-white">Save 21%</span>
                <div className="relative h-[108px]">
                  <Image src={packageImages[imageIndex] ?? item.src} alt={item.name} fill className="object-contain p-2" sizes="180px" />
                </div>
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="mt-1 text-[11px] text-[#6f6259]">{item.detail}</p>
                <p className="mt-1 text-xs"><span className="text-[#f4b400]" aria-label="5 out of 5 stars">★★★★★</span> <span className="text-[10px]">(4.8)</span></p>
              </article>
            ))}
          </div>
        </div>
        {packageImageError ? (
          <p role="status" className="mt-2 text-center text-xs text-[#8a7568]">
            Package images couldn’t be loaded from Supabase; showing the default images.
          </p>
        ) : null}
      </section>

      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_25%,#FFFFFF_0%,#FFF3F4_72%)] px-4 pb-36 pt-8 sm:px-6 lg:px-8">
          <div className="relative z-10 mx-auto max-w-[1280px]">
            <div className="relative mb-5 text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="hidden h-px w-24 bg-[#FCE4E7] sm:block" />
                <h2 className="font-serif text-3xl font-bold tracking-wide text-[#2b2118] sm:text-4xl">
                  TOP <span className="text-[#D7192D]">SELLERS</span>
                </h2>
                <span className="hidden h-px w-24 bg-[#FCE4E7] sm:block" />
              </div>
              <p className="mt-1 text-sm text-[#6f6259] sm:text-base">
                Our most loved espresso machines and grinders, trusted by coffee professionals worldwide.
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Previous top sellers"
                onClick={() => moveTopSellers(-1)}
                className="absolute top-1/2 -left-3 z-20 hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D7192D] text-white shadow-md transition hover:bg-[#b91427] sm:flex"
              >
                <ChevronLeft className="size-6" />
              </button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {displayedTopEquipment.map((item) => (
                  <article key={item.name} className="rounded-2xl border border-[#FCE4E7] bg-white p-3 shadow-[0_5px_18px_rgba(215,25,45,0.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(215,25,45,0.14)]">
                    <Link href={item.href} className="group block">
                      <div className="relative h-[210px] overflow-hidden rounded-xl bg-white sm:h-[225px]">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(min-width: 1280px) 18vw, (min-width: 640px) 40vw, 90vw"
                        />
                      </div>
                      <h3 className="mt-3 line-clamp-1 text-center font-serif text-lg font-semibold text-[#2b2118]">{item.name}</h3>
                      <p className="mt-1 text-center text-sm text-[#77716d]">{item.brand}</p>
                      <div className="mt-3 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs">
                        <span className="text-lg leading-none tracking-[-0.12em] text-[#D7192D]" aria-label="Rated five stars">★★★★★</span>
                        <span className="font-medium text-[#2b2118]">{item.rating}</span>
                        <span className="text-[#665b53]">({item.reviews} reviews)</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
              <button
                type="button"
                aria-label="Next top sellers"
                onClick={() => moveTopSellers(1)}
                className="absolute top-1/2 -right-3 z-20 hidden size-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D7192D] text-white shadow-md transition hover:bg-[#b91427] sm:flex"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/espresso-machines" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D7192D] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b91427]">
                View All Top Sellers
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[145px] w-full"
            viewBox="0 0 1440 145"
            preserveAspectRatio="none"
          >
            <path d="M0 42 C130 65 235 135 410 129 C660 120 850 82 1050 34 C1210 -4 1330 0 1440 7 L1440 145 L0 145 Z" fill="#D7192D" />
            <path d="M0 40 C130 63 235 133 410 127 C660 118 850 80 1050 32 C1210 -6 1330 -2 1440 5" fill="none" stroke="#FCE4E7" strokeWidth="3" />
            <g fill="#b91427" stroke="#FCE4E7" strokeWidth="2">
              <ellipse cx="46" cy="82" rx="22" ry="12" transform="rotate(22 46 82)" />
              <ellipse cx="93" cy="102" rx="24" ry="13" transform="rotate(-16 93 102)" />
              <ellipse cx="145" cy="119" rx="21" ry="12" transform="rotate(28 145 119)" />
              <ellipse cx="191" cy="103" rx="19" ry="11" transform="rotate(-28 191 103)" />
              <ellipse cx="238" cy="127" rx="23" ry="12" transform="rotate(12 238 127)" />
              <ellipse cx="286" cy="115" rx="20" ry="11" transform="rotate(-18 286 115)" />
            </g>
            <g fill="none" stroke="#FCE4E7" strokeWidth="2">
              <path d="M32 77 Q48 80 58 89 M78 96 Q96 101 108 108 M133 113 Q146 119 156 125 M178 98 Q192 101 204 108 M220 122 Q238 127 252 132 M270 111 Q286 115 299 121" />
            </g>
            <g fill="#FCE4E7">
              <path d="M0 110 C28 75 58 70 88 82 C66 108 36 123 0 123Z" />
              <path d="M26 143 C48 106 79 96 111 103 C91 132 62 146 26 151Z" />
              <path d="M203 145 C224 113 254 106 283 114 C267 139 241 151 211 153Z" />
            </g>
          </svg>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-4 px-4 pb-5 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <Link href="/training" className="relative min-h-[190px] overflow-hidden rounded-[10px] bg-[#D7192D] text-white">
          <div className="relative z-10 p-5">
            <GraduationCap className="mb-2 size-7" />
            <h2 className="font-serif text-2xl">Barista Training</h2>
            <p className="text-xs">Learn. Practice. Master.</p>
            <span className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-[#D7192D]">Enroll Now</span>
          </div>
          <div className="absolute right-0 top-0 h-full w-[48%]">
            <Image src="/images/training-hero.png" alt="" fill className="object-cover" sizes="340px" />
          </div>
        </Link>
        <Link href="/coffee" className="relative min-h-[190px] overflow-hidden rounded-[10px] bg-white ring-1 ring-[#FCE4E7]">
          <div className="relative z-10 p-5">
            <Coffee className="mb-2 size-7 text-[#D7192D]" />
            <h2 className="font-serif text-2xl">Marcafé</h2>
            <p className="text-xs">Premium Italian roasted<br />coffee for every cup.</p>
            <span className="mt-3 inline-block rounded-full bg-[#FCE4E7] px-4 py-2 text-[11px] font-semibold text-[#D7192D]">Explore Coffee</span>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-[48%]">
            <Image src="/images/marcafe-roasted-beans.png" alt="" fill className="object-contain" sizes="320px" />
          </div>
        </Link>
      </section>

      <section id="news" className="mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-[#D7192D]">Latest News</h2>
          <p className="text-xs text-[#6f6259]">Coffee tips, industry insights, and company updates.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {newsItems.slice(0, 3).map((item) => (
            <Link key={item.title} href={item.href} className="flex gap-3 rounded-lg bg-white p-3 ring-1 ring-[#FCE4E7]">
              <div className="relative h-[92px] w-[130px] shrink-0 overflow-hidden rounded-md">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="130px" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#6f6259]">{item.date}</p>
                <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-4">{item.title}</h3>
                <span className="mt-2 block text-[10px] font-semibold text-[#D7192D]">Read More <ChevronRight className="inline size-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
