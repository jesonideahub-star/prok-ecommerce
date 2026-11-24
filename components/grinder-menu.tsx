import {
  ArrowRight,
  ChevronRight,
  Coffee,
  House,
  Scale,
  Settings2,
  Timer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const categories = [
  { label: "Single Group", href: "/grinders?series=mignon", icon: Coffee },
  { label: "Double Group", href: "/grinders?series=commercial", icon: Coffee },
  { label: "Commercial", href: "/grinders?series=commercial", icon: Settings2 },
  { label: "On-Demand", href: "/grinders?brand=casadio", icon: Timer },
  { label: "Doser", href: "/grinders?series=commercial", icon: Scale },
  { label: "Home", href: "/grinders?use=home", icon: House },
] as const;

const grinderBrands = [
  { label: "Eureka", href: "/grinders?brand=eureka-1920" },
  { label: "Mazzer", href: "/grinders?brand=mazzer" },
  { label: "Compak", href: "/grinders?brand=compak" },
  { label: "Anfim", href: "/grinders?brand=anfim" },
  { label: "Fiorenzato", href: "/grinders?brand=fiorenzato" },
  { label: "Conti", href: "/grinders?brand=conti" },
] as const;

export function GrinderMenu({
  series,
  use,
  onNavigate,
}: {
  series?: string;
  use?: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="bg-[#FCE4E7] px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-[2000px] overflow-hidden rounded-[30px] border border-[#f5b5c0] bg-[linear-gradient(110deg,#fffafa_0%,#fff5f6_45%,#FCE4E7_100%)] shadow-[0_18px_40px_rgba(215,25,45,.16)]">
        <div className="grid min-h-[500px] grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(300px,21%)_minmax(310px,20%)_minmax(0,1fr)] lg:gap-0 lg:px-9 lg:py-7">
          <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-8">
            <h2 className="border-b border-[#e44352] pb-2 text-[18px] font-bold text-[#D7192D]">
              CATEGORIES
            </h2>
            <ul className="mt-2">
              {categories.map((item) => {
                const Icon = item.icon;
                const active =
                  (item.label === "Home" && use === "home") ||
                  (item.label === "Single Group" && series === "mignon") ||
                  (item.label !== "Single Group" &&
                    item.label !== "Home" &&
                    series === "commercial");
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-5 py-[10px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:text-[20px]",
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

          <section className="lg:border-r lg:border-[#f3b9c0] lg:px-9">
            <h2 className="border-b border-[#e44352] pb-2 text-[18px] font-bold text-[#D7192D]">
              EXPLORE GRINDERS
            </h2>
            <ul className="mt-2">
              {grinderBrands.map((brand) => (
                <li key={brand.label}>
                  <Link
                    href={brand.href}
                    onClick={onNavigate}
                    className="group flex items-center justify-between gap-3 py-[11px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:text-[20px]"
                  >
                    {brand.label}
                    <ChevronRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative isolate flex min-h-[330px] items-center overflow-hidden rounded-2xl bg-[linear-gradient(130deg,#fff7f8,#fce4e7)] lg:ml-8 lg:min-h-0 lg:rounded-none">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_68%_55%,rgba(255,255,255,.92),rgba(252,228,231,.12)_68%)]" />
            <div className="relative z-10 max-w-[390px] px-6 py-8 lg:pl-5">
              <h2 className="font-serif text-[48px] leading-[.96] font-bold tracking-tight text-[#3b1c17] sm:text-[62px]">
                Coffee
                <br />
                Grinders
              </h2>
              <p className="mt-4 max-w-[360px] text-[18px] leading-snug text-[#4c4a4e] sm:text-[21px]">
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
            <div className="pointer-events-none absolute inset-y-0 right-0 -z-0 flex w-[55%] items-end justify-end gap-0 pr-2 sm:pr-5">
              <span className="relative h-[86%] w-[48%]">
                <Image
                  src="/images/product-mignon-specialita.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-contain mix-blend-multiply"
                />
              </span>
              <span className="relative h-[94%] w-[49%]">
                <Image
                  src="/images/product-helios-75.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-contain mix-blend-multiply"
                />
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
