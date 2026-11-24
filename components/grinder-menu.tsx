import {
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

const grinderSeries = [
  { label: "Mignon Series", href: "/grinders?series=mignon" },
  { label: "Commercial Series", href: "/grinders?series=commercial" },
  { label: "All Grinders", href: "/grinders" },
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
        <div className="grid min-h-[380px] grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:gap-0 lg:px-9 lg:py-7">
          <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-8">
            <h2 className="border-b border-[#e44352] pb-3 text-[18px] font-bold text-[#D7192D] sm:text-[20px]">
              CATEGORIES
            </h2>
            <ul className="mt-2">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-5 py-[10px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:py-[13px] sm:text-[20px]",
                        use === item.slug && "text-[#D7192D]"
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

          <section className="lg:pl-8">
            <h2 className="border-b border-[#e44352] pb-3 text-[18px] font-bold text-[#D7192D] sm:text-[20px]">
              EXPLORE GRINDERS
            </h2>
            <ul className="mt-2">
              {grinderSeries.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="group flex items-center justify-between gap-3 py-[10px] text-[18px] font-medium text-[#38363a] transition-colors hover:text-[#D7192D] sm:py-[13px] sm:text-[20px]"
                  >
                    {item.label}
                    <ChevronRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="border-t border-[#f3b9c0] bg-white/70 px-5 pb-5 pt-5 sm:px-8 sm:pb-7">
          <div className="flex items-center gap-5">
            <h2 className="shrink-0 text-[16px] font-bold text-[#D7192D] sm:text-[17px]">
              FEATURED BRANDS
            </h2>
            <span className="h-px flex-1 bg-[#e44352]" />
          </div>
          <div className="mt-3 flex justify-center">
            <Link
              href="/grinders?brand=eureka-1920"
              onClick={onNavigate}
              aria-label="Explore Eureka grinders"
              className="group flex min-h-[150px] w-full max-w-[620px] items-center justify-center rounded-[40px] border border-[#f9e1e4] bg-[linear-gradient(135deg,#fff6f7,#FCE4E7)] p-6 transition-all hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(215,25,45,.12)]"
            >
              <span className="relative aspect-square w-full max-w-[200px]">
                <Image
                  src="/images/brand-eureka-official.png"
                  alt="Eureka 1920"
                  fill
                  sizes="200px"
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
