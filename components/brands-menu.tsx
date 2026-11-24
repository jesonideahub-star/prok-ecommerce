import {
  ArrowRight,
  Bean,
  ChevronRight,
  Coffee,
  CupSoda,
  Package,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { brandPageHref } from "@/lib/site";

const categories = [
  { label: "Espresso Machines", href: "/espresso-machines", icon: Coffee },
  { label: "Grinders", href: "/grinders", icon: Settings2 },
  { label: "Coffee", href: "/coffee", icon: Bean },
  { label: "Flavours", href: "/flavours", icon: CupSoda },
  { label: "Accessories", href: "/brands#our-brands", icon: Package },
] as const;

const brandLogos = [
  {
    name: "Catcher Gourmet",
    src: "/images/brand-catcher-official.png",
    width: 1164,
    height: 437,
  },
  {
    name: "Casadio",
    src: "/images/brand-casadio-official.png",
    width: 1405,
    height: 688,
  },
  {
    name: "Eureka 1920",
    src: "/images/brand-eureka-official.png",
    width: 782,
    height: 768,
  },
  {
    name: "Slayer",
    src: "/images/brand-slayer-official.png",
    width: 2000,
    height: 450,
  },
  {
    name: "La Nuova Era",
    src: "/images/brand-lanuovaera-official.png",
    width: 2558,
    height: 768,
  },
  {
    name: "Marcafé",
    src: "/images/brand-marcafe.png",
    width: 105,
    height: 129,
  },
  {
    name: "puly CAFF",
    src: "/images/brand-pulycaff-official.png",
    width: 354,
    height: 236,
  },
  {
    name: "didiesse",
    src: "/images/brand-didiesse-official.png",
    width: 602,
    height: 212,
  },
] as const;

export function BrandsMenu({
  brands,
  onNavigate,
}: {
  brands: readonly string[];
  onNavigate?: () => void;
}) {
  const featuredBrands = brandLogos.filter((brand) => brands.includes(brand.name));

  return (
    <div className="bg-[#FCE4E7] px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-[2000px] overflow-hidden rounded-[30px] border border-[#f5b5c0] bg-[linear-gradient(115deg,#fffafa_0%,#fff5f6_46%,#FCE4E7_100%)] shadow-[0_18px_40px_rgba(215,25,45,.16)]">
        <div className="grid min-h-[330px] grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(270px,23%)_minmax(0,1fr)] lg:gap-0 lg:px-9 lg:py-7">
          <section className="relative z-10 rounded-[24px] border border-[#f9dadd] bg-white/70 p-5 sm:p-6 lg:mr-8">
            <h2 className="border-b border-[#e44352] pb-3 text-[18px] font-bold text-[#D7192D] sm:text-[20px]">
              OUR BRANDS
            </h2>
            <ul className="mt-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.label}>
                    <Link
                      href={category.href}
                      onClick={onNavigate}
                      className="group flex items-center gap-4 py-[9px] text-[16px] font-medium text-[#38363a] transition-colors hover:text-[#D7192D] sm:py-[10px] sm:text-[17px]"
                    >
                      <Icon className="size-7 shrink-0 text-[#ed1836]" strokeWidth={1.8} />
                      <span className="flex-1">{category.label}</span>
                      <ChevronRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="relative isolate flex min-h-[310px] items-center overflow-hidden rounded-[24px] bg-[linear-gradient(130deg,#fff9f5_0%,#ffe8e9_55%,#f8bfc7_100%)] lg:min-h-0">
            <Image
              src="/images/about-machines.png"
              alt="Espresso machine and grinder for coffee professionals"
              fill
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="absolute inset-0 -z-20 object-cover object-[57%_55%]"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,248,246,.99)_0%,rgba(255,248,246,.96)_32%,rgba(255,238,238,.72)_52%,rgba(255,238,238,.06)_82%)]" />
            <div className="relative z-10 max-w-[460px] px-6 py-8 sm:px-8 lg:px-9">
              <h2 className="font-serif text-[52px] leading-[.9] font-bold tracking-tight text-[#3b1c17] sm:text-[68px]">
                Premium
                <br />
                Brands.
              </h2>
              <p className="mt-4 text-[19px] leading-snug text-[#4c4a4e] sm:text-[22px]">
                Exceptional Quality.
                <br />
                Trusted by Coffee Professionals.
              </p>
              <Link
                href="/brands"
                onClick={onNavigate}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#c8102e] px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-[#a70d26] sm:text-[18px]"
              >
                View All Brands
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>
        </div>

        <section className="border-t border-[#f3b9c0] bg-white/70 px-5 pb-5 pt-4 sm:px-8 sm:pb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="h-px flex-1 bg-[#e6a14e]" />
            <h2 className="shrink-0 font-serif text-[18px] font-bold tracking-[0.04em] text-[#c8102e] sm:text-[22px]">
              FEATURED BRANDS
            </h2>
            <span className="h-px flex-1 bg-[#e6a14e]" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.name}
                href={brandPageHref(brand.name)}
                onClick={onNavigate}
                aria-label={`View ${brand.name} products`}
                className="flex min-h-[86px] items-center justify-center rounded-[18px] border border-[#f9e1e4] bg-white/90 px-3 py-3 transition-all hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(215,25,45,.12)] sm:min-h-[96px]"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  sizes="(min-width: 1024px) 150px, (min-width: 640px) 22vw, 45vw"
                  className="max-h-[58px] w-full object-contain"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}