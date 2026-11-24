import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { brandSlug } from "@/lib/site";
import { cn } from "@/lib/utils";

const uses = [
  { label: "Cafe", href: "/espresso-machines?use=cafe", slug: "cafe" },
  { label: "Restaurant", href: "/espresso-machines?use=restaurant", slug: "restaurant" },
  { label: "Hotel", href: "/espresso-machines?use=hotel", slug: "hotel" },
  { label: "Office", href: "/espresso-machines?use=office", slug: "office" },
  { label: "Home", href: "/espresso-machines?use=home", slug: "home" },
] as const;

const groups = [
  { label: "Single Group", href: "/espresso-machines?group=1", value: 1 },
  { label: "Double Group", href: "/espresso-machines?group=2", value: 2 },
] as const;

const brands = ["La Nuova Era", "Slayer", "Casadio", "didiesse"] as const;

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
    <div className={cn("bg-[#FFF3F4]", className)}>
      <div className="mx-auto max-w-[1800px] px-6 py-9 md:px-10 md:py-12 2xl:px-0 2xl:py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-[260px_285px_1fr] lg:gap-4">
          <ul className="space-y-2">
            {uses.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-md py-1.5 text-lg transition-colors hover:text-[#D7192D] 2xl:text-[22px]",
                    use === item.slug
                      ? "font-medium text-[#D7192D]"
                      : "text-zinc-700"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {groups.map((item) => (
              <li key={item.value}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-md py-1.5 text-lg transition-colors hover:text-[#D7192D] 2xl:text-[22px]",
                    group === item.value
                      ? "font-medium text-[#D7192D]"
                      : "text-zinc-700"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            <li>
              <Link
                href="/#packages"
                onClick={onNavigate}
                className="block rounded-md py-1.5 text-lg font-medium text-[#D7192D] transition-colors hover:text-[#b91427] 2xl:text-[22px]"
              >
                Package Deals
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:items-stretch sm:gap-4 lg:mt-[72px]">
          {brands.map((name) => (
            <Link
              key={name}
              href={`/espresso-machines?brand=${brandSlug(name)}`}
              onClick={onNavigate}
              className="flex h-[120px] min-w-0 flex-1 items-center justify-center rounded-[20px] bg-white px-3 ring-1 ring-[#FCE4E7] transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_10px_20px_rgba(215,25,45,0.12)] sm:h-[140px]"
            >
              <BrandMark name={name} size="lg" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
