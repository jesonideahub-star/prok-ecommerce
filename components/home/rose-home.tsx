"use client";

import { useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Diamond,
  Headphones,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

import { cn } from "@/lib/utils";

const slides = [
  {
    src: "/images/hero-beans.png",
    alt: "Roasted coffee beans beside a cup of coffee",
    eyebrow: "Premium Quality",
    title: "Premium Coffee",
    accent: "Collection",
    body: "Elevate your coffee experience with the finest brands and professional equipment.",
    href: "/coffee",
    cta: "Shop Now",
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
  {
    title: "Café",
    body: "Premium coffee blends",
    href: "/coffee",
    src: "/images/cafe-interior.png",
    icon: Coffee,
  },
  {
    title: "Restaurant",
    body: "Complete dining solutions",
    href: "/espresso-machines?use=restaurant",
    src: "/images/journeyman-cafe-supplied-3.jpg",
    icon: UtensilsCrossed,
  },
  {
    title: "Espresso Machines",
    body: "Professional grade machines",
    href: "/espresso-machines",
    src: "/images/hero-espresso.png",
    icon: Coffee,
  },
  {
    title: "Barista Training",
    body: "Learn from the experts",
    href: "/training",
    src: "/images/hero-slayer-barista.png",
    icon: Coffee,
  },
] as const;

const trust = [
  { icon: Diamond, title: "Premium Brands", body: "Trusted worldwide" },
  { icon: Truck, title: "Fast Delivery", body: "Across the Philippines" },
  { icon: Headphones, title: "Expert Support", body: "Always here to help" },
  { icon: ShieldCheck, title: "Secure Shopping", body: "Shop with confidence" },
] as const;

export function RoseHome() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <div className="bg-[#fff6ee] text-[#2b2118]">
      <section className="mx-auto max-w-[1280px] px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#9b1020] text-white shadow-[0_16px_40px_rgba(155,16,32,0.18)]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            className="object-cover object-right"
            sizes="(min-width: 1280px) 1248px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#8d0e1c] via-[#b11226]/88 to-[#b11226]/15" />
          <div className="relative grid min-h-[340px] items-center px-6 py-10 sm:px-12 md:min-h-[420px] md:py-14 lg:px-16">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.28em] text-[#f5c400] uppercase">
                <span className="mr-3 inline-block h-px w-8 bg-[#f5c400] align-middle" />
                {slide.eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[0.95] font-semibold sm:text-5xl lg:text-6xl">
                {slide.title}
                <span className="mt-1 block font-serif text-[#f5c400] italic">{slide.accent}</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/90 sm:text-base">{slide.body}</p>
              <Link
                href={slide.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f5c400] px-5 py-2.5 text-sm font-semibold text-[#2b2118] shadow-sm transition hover:bg-[#ffd24a]"
              >
                {slide.cta}
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-sm hover:bg-white/25"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-sm hover:bg-white/25"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((item, dot) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show ${item.title}`}
                onClick={() => setIndex(dot)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  dot === index ? "w-6 bg-white" : "w-2 bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative min-h-[148px] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.src}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
              <div className="relative flex h-full items-start gap-3 p-4 text-white">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#d0122d]">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-lg font-semibold">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-white/85">{item.body}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium">
                    Explore <ChevronRight className="size-3.5" />
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl bg-[#fffaf5] px-4 py-5 shadow-[0_8px_24px_rgba(155,16,32,0.05)] ring-1 ring-[#f3e0d2] sm:grid-cols-2 lg:grid-cols-4 lg:px-2">
          {trust.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 px-4">
                <Icon className="size-7 shrink-0 text-[#d0122d]" strokeWidth={1.6} />
                <div>
                  <p className="text-sm font-semibold text-[#2b2118]">{item.title}</p>
                  <p className="text-xs text-[#8a7568]">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#9b1020] to-[#d0122d] text-white">
          <div className="relative z-10 max-w-sm p-6 sm:p-8">
            <p className="font-serif text-2xl text-[#f5c400] italic">Special Offer</p>
            <p className="mt-1 font-serif text-4xl leading-none font-semibold sm:text-5xl">
              Up to <span className="text-[#f5c400]">20% OFF</span>
            </p>
            <p className="mt-3 text-sm text-white/90">on selected coffee products</p>
            <Link
              href="/coffee"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5c400] px-4 py-2 text-sm font-semibold text-[#2b2118] hover:bg-[#ffd24a]"
            >
              Shop the Deal <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 h-full w-[46%]">
            <Image
              src="/images/marcafe-roasted-beans.png"
              alt=""
              fill
              className="object-contain object-right-bottom p-4"
              sizes="320px"
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#fff3e4] ring-1 ring-[#f3e0d2]">
          <div className="relative z-10 max-w-xs p-6 sm:p-8">
            <h2 className="font-serif text-3xl leading-tight font-semibold text-[#2b2118]">
              Discover the Best Coffee Experience
            </h2>
            <p className="mt-2 text-sm text-[#8a7568]">Quality. Passion. Excellence.</p>
            <Link
              href="/about-us"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5c400] px-4 py-2 text-sm font-semibold text-[#2b2118] hover:bg-[#ffd24a]"
            >
              Explore More <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-1/2 sm:block">
            <Image
              src="/images/hero-beans.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="360px"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
