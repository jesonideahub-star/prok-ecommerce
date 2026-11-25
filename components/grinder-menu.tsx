import {
  ArrowRight,
  BedDouble,
  BriefcaseBusiness,
  ChevronRight,
  Coffee,
  House,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const categories = [
  { label: "Café", href: "/grinders?use=cafe", slug: "cafe", icon: Coffee },
  {
    label: "Restaurant",
    href: "/grinders?use=restaurant",
    slug: "restaurant",
    icon: UtensilsCrossed,
  },
  { label: "Hotel", href: "/grinders?use=hotel", slug: "hotel", icon: BedDouble },
  { label: "Office", href: "/grinders?use=office", slug: "office", icon: BriefcaseBusiness },
  { label: "Home", href: "/grinders?use=home", slug: "home", icon: House },
] as const;

const heroGrinders = [
  {
    src: "/images/hero-grinder-silenzio.png",
    alt: "Eureka Mignon Silenzio grinder",
    className: "bottom-0 left-[8%] h-[90%] w-[42%]",
  },
  {
    src: "/images/hero-grinder-firenze.png",
    alt: "Eureka Firenze 75 grinder",
    className: "bottom-0 right-[2%] h-full w-[42%]",
  },
] as const;

export function GrinderMenu({
  use,
  onNavigate,
}: {
  use?: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="bg-[#FCE4E7] px-3 py-2 sm:px-4">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[24px] border border-[#f5b5c0] bg-[linear-gradient(110deg,#fffafa_0%,#fff5f6_45%,#FCE4E7_100%)] shadow-[0_14px_32px_rgba(215,25,45,.16)]">
        <div className="grid min-h-[320px] grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-0 lg:px-7 lg:py-5">
          <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-6">
            <h2 className="border-b border-[#e44352] pb-2 text-[16px] font-bold text-[#D7192D] sm:text-[18px]">
              CATEGORIES
            </h2>
            <ul className="mt-2">
              {categories.map((item) => {
                const Icon = item.icon;
                const active = item.slug === use;
                return (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 py-[6px] text-[16px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:py-[7px] sm:text-[18px]",
                        active && "text-[#D7192D]"
                      )}
                    >
                      <Icon className="size-6 shrink-0 text-[#ed1836]" strokeWidth={1.8} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="relative isolate flex min-h-[270px] items-center overflow-hidden rounded-xl bg-[linear-gradient(130deg,#fff7f8_0%,#fde7eb_58%,#f8c5ce_100%)] lg:ml-6 lg:min-h-0 lg:rounded-none">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_76%_56%,rgba(255,255,255,.92),rgba(252,228,231,.12)_68%),linear-gradient(150deg,transparent_63%,rgba(240,110,136,.2)_63.5%,transparent_80%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[55%] items-end">
              {heroGrinders.map((grinder) => (
                <span
                  key={grinder.src}
                  className={`absolute mix-blend-multiply ${grinder.className}`}
                >
                  <Image
                    src={grinder.src}
                    alt={grinder.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 42vw"
                    className="object-contain object-bottom drop-shadow-[0_8px_10px_rgba(47,24,24,.12)]"
                  />
                </span>
              ))}
            </div>
            <div className="relative z-20 max-w-[480px] px-5 py-6 lg:pl-6">
              <h2 className="font-serif text-[40px] leading-[.96] font-bold tracking-tight text-[#3b1c17] sm:text-[52px]">
                Coffee
                <br />
                Grinders
              </h2>
              <p className="mt-3 max-w-[340px] text-[16px] leading-snug text-[#4c4a4e] sm:text-[18px]">
                Precision. Consistency. Exceptional Coffee.
              </p>
              <Link
                href="/grinders"
                onClick={onNavigate}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ed1027] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#c70f22] sm:text-[16px]"
              >
                View All Grinders
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>

        <section className="border-t border-[#f3b9c0] bg-white/80 px-5 pb-4 pt-3 sm:px-7 sm:pb-5 sm:pt-4">
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 text-[14px] font-bold text-[#D7192D] sm:text-[15px]">
              FEATURED BRANDS
            </h2>
            <span className="h-px flex-1 bg-[#e44352]" />
          </div>
          <div className="mt-2 flex justify-center">
            <Link
              href="/grinders?brand=eureka-1920"
              onClick={onNavigate}
              aria-label="Explore Eureka grinders"
              className="group flex h-[92px] w-full max-w-[440px] items-center justify-center rounded-[26px] border border-[#f9e1e4] bg-[linear-gradient(110deg,#fff7f8,#fce7ea)] px-6 py-2 transition-all hover:shadow-[0_10px_24px_rgba(215,25,45,.12)]"
            >
              <span className="relative h-full w-full max-w-[110px]">
                <Image
                  src="/images/brand-eureka-official.png"
                  alt="Eureka 1920"
                  fill
                  priority
                  sizes="110px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
