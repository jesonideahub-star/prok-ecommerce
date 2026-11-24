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

import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const uses = [
  { label: "Café", href: "/espresso-machines?use=cafe", slug: "cafe", icon: Coffee },
  {
    label: "Restaurant",
    href: "/espresso-machines?use=restaurant",
    slug: "restaurant",
    icon: UtensilsCrossed,
  },
  { label: "Hotel", href: "/espresso-machines?use=hotel", slug: "hotel", icon: BedDouble },
  { label: "Office", href: "/espresso-machines?use=office", slug: "office", icon: BriefcaseBusiness },
  { label: "Home", href: "/espresso-machines?use=home", slug: "home", icon: House },
] as const;

const machineTypes = [
  { label: "Single Group", href: "/espresso-machines?group=1" },
  { label: "Double Group", href: "/espresso-machines?group=2" },
  { label: "Traditional Machines", href: "/espresso-machines" },
  { label: "Automatic Machines", href: "/espresso-machines" },
  { label: "Semi-Automatic Machines", href: "/espresso-machines" },
] as const;

const featuredBrands = [
  {
    name: "La Nuova Era",
    image: "/images/product-la-nuova-era-anniversario.png",
    href: "/espresso-machines?brand=la-nuova-era",
    alt: "La Nuova Era espresso machine",
  },
  {
    name: "Slayer",
    image: "/images/product-slayer-ep.png",
    href: "/espresso-machines?brand=slayer",
    alt: "Slayer espresso machine",
  },
  {
    name: "Casadio",
    image: "/images/product-casadio-nettuno-a2.jpg",
    href: "/espresso-machines?brand=casadio",
    alt: "Casadio espresso machine",
  },
  {
    name: "didiesse",
    image: "/images/hero-espresso.png",
    href: "/espresso-machines?brand=didiesse",
    alt: "Didiesse espresso machine",
  },
] as const;

export function EspressoMachineMenu({
  use,
  group,
  onNavigate,
  className,
}: {
  use?: string;
  group?: number;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("bg-[#FCE4E7] px-3 pt-3 sm:px-5", className)}>
      <div className="mx-auto max-w-[1536px] overflow-hidden rounded-t-[30px] border border-white/80 bg-[#fffafa] shadow-[0_18px_40px_rgba(215,25,45,.16)]">
        <div className="grid min-h-[310px] grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-[250px_360px_minmax(0,1fr)] lg:gap-0 lg:px-9 lg:py-7">
          <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-8">
            <h2 className="border-b border-[#e44352] pb-2 text-[16px] font-bold text-[#D7192D]">
              CATEGORIES
            </h2>
            <ul className="mt-2">
              {uses.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-4 py-[9px] text-[16px] font-medium text-[#38363a] transition-colors hover:text-[#D7192D] sm:text-[18px]",
                        use === item.slug && "text-[#D7192D]"
                      )}
                    >
                      <Icon className="size-6 shrink-0 text-[#D7192D]" strokeWidth={1.8} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="size-5 shrink-0 text-[#38363a] transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="lg:border-r lg:border-[#f3b9c0] lg:px-8">
            <h2 className="border-b border-[#e44352] pb-2 text-[16px] font-bold text-[#D7192D]">
              EXPLORE ESPRESSO MACHINES
            </h2>
            <ul className="mt-2">
              {machineTypes.map((item, index) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center justify-between gap-3 py-[10px] text-[16px] font-medium text-[#38363a] transition-colors hover:text-[#D7192D] sm:text-[18px]",
                      group === (index === 0 ? 1 : index === 1 ? 2 : undefined) &&
                        index < 2 &&
                        "text-[#D7192D]"
                    )}
                  >
                    {item.label}
                    <ChevronRight className="size-5 shrink-0 text-[#38363a] transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative isolate flex min-h-[260px] items-center overflow-hidden rounded-2xl bg-[#FCE4E7] lg:ml-8 lg:min-h-0 lg:rounded-none">
            <Image
              src="/images/about-machines.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="absolute inset-0 -z-20 object-cover object-[62%_50%]"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#fff8f8_0%,rgba(255,248,248,.96)_28%,rgba(255,248,248,.68)_48%,rgba(255,248,248,.04)_80%)]" />
            <div className="relative max-w-[330px] px-6 py-7 lg:pl-5">
              <h2 className="font-serif text-[40px] leading-[.95] font-bold tracking-tight text-[#D7192D] sm:text-[48px]">
                Espresso
                <br />
                Machines
              </h2>
              <p className="mt-4 max-w-[250px] text-[16px] leading-snug text-[#4c4a4e] sm:text-[18px]">
                Precision. Performance.
                <br />
                Exceptional Coffee.
              </p>
              <Link
                href="/espresso-machines"
                onClick={onNavigate}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D7192D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b91427]"
              >
                View All Espresso Machines
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>

        <section className="rounded-t-[28px] bg-white/90 px-5 pb-5 pt-5 sm:px-8 sm:pb-7">
          <div className="flex items-center gap-5">
            <h2 className="shrink-0 text-[16px] font-bold text-[#D7192D] sm:text-[17px]">
              FEATURED BRANDS
            </h2>
            <span className="h-px flex-1 bg-[#e44352]" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                onClick={onNavigate}
                className="group relative flex min-h-[175px] flex-col items-center justify-between overflow-hidden rounded-[20px] border border-[#f9e1e4] bg-[linear-gradient(135deg,#fff6f7,#FCE4E7)] px-4 py-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(215,25,45,.12)]"
              >
                <div className="flex min-h-[100px] w-full items-center justify-between gap-2">
                  <BrandMark name={brand.name} size="lg" />
                  <span className="relative h-[102px] min-w-0 flex-1">
                    <Image
                      src={brand.image}
                      alt={brand.alt}
                      fill
                      sizes="(min-width: 1024px) 150px, 40vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#f15a65] px-4 py-2 text-xs font-semibold text-[#D7192D] transition-colors group-hover:bg-[#D7192D] group-hover:text-white sm:text-sm">
                  Explore Brand <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
