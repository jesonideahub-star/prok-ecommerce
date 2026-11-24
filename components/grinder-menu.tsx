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
    src: "/images/product-mignon-specialita.png",
    alt: "Eureka Mignon Specialita grinder",
    className: "bottom-0 left-[4%] h-[82%] w-[48%]",
  },
  {
    src: "/images/product-helios-75.png",
    alt: "Eureka Helios 75 grinder",
    className: "bottom-0 right-[1%] h-[92%] w-[49%]",
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
    <div className="bg-[#FCE4E7] px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-[2000px] overflow-hidden rounded-[30px] border border-[#f5b5c0] bg-[linear-gradient(110deg,#fffafa_0%,#fff5f6_45%,#FCE4E7_100%)] shadow-[0_18px_40px_rgba(215,25,45,.16)]">
        <div className="grid min-h-[390px] grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(280px,22%)_minmax(0,1fr)] lg:gap-0 lg:px-9 lg:py-7">
          <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-8">
            <h2 className="border-b border-[#e44352] pb-2 text-[18px] font-bold text-[#D7192D] sm:text-[20px]">
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
                        "group flex items-center gap-4 py-[8px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:py-[9px] sm:text-[20px]",
                        active && "text-[#D7192D]"
                      )}
                    >
                      <Icon className="size-7 shrink-0 text-[#ed1836]" strokeWidth={1.8} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="relative isolate flex min-h-[330px] items-center overflow-hidden rounded-2xl bg-[linear-gradient(130deg,#fff7f8_0%,#fde7eb_58%,#f8c5ce_100%)] lg:ml-8 lg:min-h-0 lg:rounded-none">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_56%,rgba(255,255,255,.92),rgba(252,228,231,.12)_68%),linear-gradient(150deg,transparent_63%,rgba(240,110,136,.2)_63.5%,transparent_80%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 -z-0 flex w-[55%] items-end">
              {heroGrinders.map((grinder) => (
                <span key={grinder.src} className={`absolute ${grinder.className}`}>
                  <Image
                    src={grinder.src}
                    alt={grinder.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 42vw"
                    className="object-contain object-bottom mix-blend-multiply"
                  />
                </span>
              ))}
            </div>
            <div className="relative z-10 max-w-[560px] px-6 py-8 lg:pl-8">
              <h2 className="font-serif text-[48px] leading-[.96] font-bold tracking-tight text-[#3b1c17] sm:text-[62px]">
                Coffee
                <br />
                Grinders
              </h2>
              <p className="mt-4 max-w-[390px] text-[18px] leading-snug text-[#4c4a4e] sm:text-[21px]">
                Precision. Consistency. Exceptional Coffee.
              </p>
              <Link
                href="/grinders"
                onClick={onNavigate}
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#ed1027] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#c70f22] sm:text-[18px]"
              >
                View All Grinders
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>
        </div>

        <section className="border-t border-[#f3b9c0] bg-white/80 px-5 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-5">
          <div className="flex items-center gap-5">
            <h2 className="shrink-0 text-[16px] font-bold text-[#D7192D] sm:text-[17px]">
              FEATURED BRANDS
            </h2>
            <span className="h-px flex-1 bg-[#e44352]" />
          </div>
          <div className="mt-2 flex justify-center">
            <Link
              href="/grinders?brand=eureka-1920"
              onClick={onNavigate}
              aria-label="Explore Eureka grinders"
              className="group flex h-[120px] w-full max-w-[550px] items-center justify-center rounded-[36px] border border-[#f9e1e4] bg-[linear-gradient(110deg,#fff7f8,#fce7ea)] px-8 py-2 transition-all hover:shadow-[0_12px_28px_rgba(215,25,45,.12)]"
            >
              <span className="relative h-full w-full max-w-[130px]">
                <Image
                  src="/images/brand-eureka-official.png"
                  alt="Eureka 1920"
                  fill
                  priority
                  sizes="130px"
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
