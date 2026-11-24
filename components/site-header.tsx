"use client";

import { useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Headphones,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { CoffeeMenu } from "@/components/coffee-menu";
import { EspressoMachineMenu } from "@/components/espresso-machine-menu";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  brandPageHref,
  headerNavLayout,
  headerNavOrder,
  navDisplayLabel,
  navItems,
  navItemsByLabels,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type NavItem = (typeof navItems)[number];
type CatalogMega = Extract<NavItem, { mega: "catalog" }>;
type BrandsMega = Extract<NavItem, { mega: "brands" }>;

const row1Left = navItemsByLabels(headerNavLayout.row1Left);
const row1Right = navItemsByLabels(headerNavLayout.row1Right);
const row2Left = navItemsByLabels(headerNavLayout.row2Left);
const row2Right = navItemsByLabels(headerNavLayout.row2Right);
const mobileNav = navItemsByLabels(headerNavOrder);

function hasChildren(
  item: NavItem
): item is NavItem & { children: readonly { label: string; href: string }[] } {
  return "children" in item;
}

function isCatalogMega(item: NavItem): item is CatalogMega {
  return "mega" in item && item.mega === "catalog";
}

function isBrandsMega(item: NavItem): item is BrandsMega {
  return "mega" in item && item.mega === "brands";
}

function hasDropdown(item: NavItem) {
  return hasChildren(item) || isCatalogMega(item) || isBrandsMega(item);
}

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const path = href.split("?")[0].split("#")[0];
  // Homepage anchors like /#news are not dedicated pages
  if (!path || path === "/") return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function NavLink({
  item,
  isOpen,
  isActive,
  onOpen,
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  onOpen: () => void;
}) {
  const dropdown = hasDropdown(item);
  const highlighted = isOpen || isActive;

  return (
    <div onMouseEnter={onOpen} className="shrink-0">
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-medium transition-colors xl:px-4 xl:text-[15px] 2xl:px-5 2xl:text-[18px]",
          isActive &&
            item.label !== "Contact Us" &&
            "bg-[#D7192D] text-white hover:bg-[#b91427]",
          item.label === "Contact Us" &&
            "rounded-full bg-[#FFBF55] px-4 py-2.5 font-semibold text-[#2b2118] hover:bg-[#F7B744] 2xl:px-6 2xl:py-3",
          !isActive &&
            item.label !== "Contact Us" &&
            (highlighted ? "text-[#D7192D]" : "text-[#3a2a22] hover:text-[#D7192D]"),
          !isActive && item.label === "Contact Us" && "text-[#2b2118]"
        )}
      >
        {item.label === "Contact Us" ? <Mail className="size-4" /> : null}
        {navDisplayLabel(item.label)}
        {dropdown ? (
          <ChevronDown
            className={cn(
              "size-3.5 text-current transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        ) : null}
      </Link>
    </div>
  );
}

function NavCluster({
  items,
  mega,
  pathname,
  onOpen,
}: {
  items: NavItem[];
  mega: string | null;
  pathname: string;
  onOpen: (item: NavItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-nowrap items-center gap-x-2 2xl:gap-x-8">
      {items.map((item) => (
        <NavLink
          key={item.label}
          item={item}
          isOpen={mega === item.label}
          isActive={pathMatches(pathname, item.href)}
          onOpen={() => onOpen(item)}
        />
      ))}
    </div>
  );
}

function SearchForm({
  className,
  large = false,
}: {
  className?: string;
  large?: boolean;
}) {
  const [query, setQuery] = useState("");

  return (
    <form
      className={cn("flex min-w-0 items-center overflow-hidden rounded-full border border-[#ead8cc] bg-white pr-1", className)}
      onSubmit={(event) => {
        event.preventDefault();
        document.getElementById("espresso-machines")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
    >
      <label className="flex min-w-0 flex-1">
        <span className="sr-only">Search</span>
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What are you looking for?"
          className={cn(
            "min-w-0 flex-1 rounded-none border-0 bg-white px-4 text-[15px] shadow-none placeholder:text-neutral-400 focus-visible:border-transparent focus-visible:ring-0",
            large ? "h-[58px]" : "h-11"
          )}
        />
      </label>
      <Button
        type="submit"
        aria-label="Search"
        className={cn(
          "shrink-0 rounded-full border-0 bg-[#D7192D] text-white hover:bg-[#b91427]",
          large ? "size-[58px]" : "size-11"
        )}
      >
        <Search className="size-5" />
      </Button>
    </form>
  );
}

function catalogUseFromHref(href: string) {
  const query = href.split("?")[1];
  if (!query) return null;
  return new URLSearchParams(query).get("use");
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [catalogUse, setCatalogUse] = useState("cafe");
  const pathname = usePathname();

  const openItem = navItems.find((item) => item.label === mega);

  function close() {
    setMega(null);
    setMobileOpen(false);
  }

  function openNavItem(item: NavItem) {
    setMega(hasDropdown(item) ? item.label : null);
    if (item.label === "Espresso Machines") {
      setCatalogUse("cafe");
    }
  }

  return (
    <header
      className="sticky top-0 z-50 overflow-x-clip bg-white text-[#2b2118]"
      onMouseLeave={() => setMega(null)}
    >
      <div className="hidden bg-[#D7192D] text-white lg:block">
        <div className="mx-auto grid h-[46px] max-w-[1900px] grid-cols-4 items-center px-8 text-sm font-semibold">
          <span className="inline-flex items-center gap-3">
            <Truck className="size-6 shrink-0" />
            Free Shipping on orders over ₱2,000
          </span>
          <span className="inline-flex items-center justify-center gap-3">
            <ShieldCheck className="size-6 shrink-0" />
            Secure Payment
          </span>
          <span className="inline-flex items-center justify-center gap-3">
            <Headphones className="size-8 shrink-0" />
            24/7 Customer Support
          </span>
          <div className="flex items-center justify-end gap-4 border-l border-white/60 pl-7 text-xl">
            <a href="#contact" aria-label="Facebook" className="hover:opacity-80">f</a>
            <a href="#contact" aria-label="Instagram" className="hover:opacity-80">⌾</a>
            <a href="#contact" aria-label="YouTube" className="hover:opacity-80">▷</a>
            <a href="#contact" aria-label="TikTok" className="hover:opacity-80">♪</a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:hidden">
        <SiteLogo showPitcorp={false} className="min-w-0 shrink-0 [&_img]:h-10 sm:[&_img]:h-11 lg:[&_img]:h-12" />
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center text-[#3a2a22] hover:text-[#D7192D]"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div className="mx-auto hidden h-[90px] max-w-[1900px] items-center gap-12 px-8 lg:flex">
        <SiteLogo showPitcorp={false} className="shrink-0 [&_img]:h-[78px]" />
        <SearchForm className="mx-auto max-w-[1000px] flex-1" large />
        <div className="ml-auto flex shrink-0 items-center gap-9">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-3 text-[15px] font-medium text-[#2b2118] hover:text-[#D7192D]"
          >
            <User className="size-7 stroke-[1.6] text-[#c4161c]" />
            Admin Login
          </Link>
          <Link
            href="/espresso-machines"
            aria-label="Cart"
            className="relative inline-flex text-[#2b2118] hover:text-[#D7192D]"
          >
            <ShoppingCart className="size-8 stroke-[1.6]" />
            <span className="absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full bg-[#FCE4E7] text-xs font-semibold text-[#D7192D]">
              0
            </span>
          </Link>
        </div>
      </div>

      <div className="hidden border-b border-[#e6c6a9] lg:block">
        <nav aria-label="Main navigation" className="overflow-x-auto">
          <div className="mx-auto flex h-[82px] w-max min-w-full items-center gap-2 px-4 xl:gap-3 xl:px-6 2xl:gap-4 2xl:px-[74px]">
            <NavCluster items={row1Left} mega={mega} pathname={pathname} onOpen={openNavItem} />
            <span className="mx-1 h-6 w-px shrink-0 bg-[#ead8cc] xl:mx-2 2xl:mx-4" />
            <NavCluster
              items={[...row1Right, ...row2Left]}
              mega={mega}
              pathname={pathname}
              onOpen={openNavItem}
            />
            <div className="ml-auto">
              <NavCluster items={row2Right} mega={mega} pathname={pathname} onOpen={openNavItem} />
            </div>
          </div>
        </nav>
      </div>

      <div className="border-b border-[#e6c6a9] px-4 pb-3 lg:hidden">
        <SearchForm />
      </div>

      {openItem && isBrandsMega(openItem) ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] bg-[#FFF3F4] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <div className="mx-auto flex max-w-[1440px] items-stretch gap-2 overflow-visible px-3 py-6 sm:gap-3 sm:px-6 lg:px-10 lg:py-7">
            {openItem.brands.map((name) => (
              <Link
                key={name}
                href={brandPageHref(name)}
                onClick={close}
                className="flex min-h-[140px] min-w-0 flex-1 items-center justify-center rounded-xl bg-white px-1.5 py-4 ring-1 ring-[#FCE4E7] transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1.5 hover:scale-[1.04] hover:shadow-[0_12px_24px_rgba(215,25,45,0.12)] sm:min-h-[160px] sm:px-2"
              >
                <BrandMark name={name} size="lg" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {openItem && isCatalogMega(openItem) && openItem.label === "Coffee" ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <CoffeeMenu onNavigate={close} />
        </div>
      ) : null}

      {openItem && isCatalogMega(openItem) && openItem.label === "Espresso Machines" ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <EspressoMachineMenu onNavigate={close} />
        </div>
      ) : null}

      {openItem &&
      isCatalogMega(openItem) &&
      openItem.label !== "Espresso Machines" &&
      openItem.label !== "Coffee" ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] bg-[#FFF3F4] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <div className="mx-auto max-w-[1440px] px-8 py-8 lg:px-10 lg:py-10">
            <div className="flex flex-wrap gap-16 lg:gap-28">
              <ul className="space-y-1">
                {openItem.children.map((child) => {
                  const childUse = catalogUseFromHref(child.href);
                  const active = Boolean(childUse && childUse === catalogUse);

                  return (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className={cn(
                          "block rounded-md px-1 py-1.5 text-[15px] transition-colors hover:text-[#D7192D]",
                          active ? "font-medium text-[#D7192D]" : "text-zinc-700"
                        )}
                        onMouseEnter={() => {
                          if (childUse) setCatalogUse(childUse);
                        }}
                        onClick={close}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {openItem.extras.length > 0 ? (
                <ul className="space-y-1">
                  {openItem.extras.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="block rounded-md px-1 py-1.5 text-[15px] text-zinc-700 transition-colors hover:text-[#D7192D]"
                        onClick={close}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              {!("brands" in openItem) && openItem.featured.length > 0 ? (
                <div className="ml-auto flex gap-6">
                  {openItem.featured.map((brand) => (
                    <div key={brand.cta} className="flex w-36 flex-col items-center">
                      <div className="flex h-[100px] w-36 items-center justify-center rounded-xl bg-white ring-1 ring-[#FCE4E7]">
                        {brand.src ? (
                          <div className="relative h-20 w-32">
                            <Image
                              src={brand.src}
                              alt={brand.alt}
                              fill
                              className="object-contain p-2"
                              sizes="144px"
                            />
                          </div>
                        ) : brand.name ? (
                          <BrandMark name={brand.name} size="lg" />
                        ) : null}
                      </div>
                      <Link
                        href={brand.href}
                        className="mt-3 text-center text-sm text-[#D7192D] hover:underline"
                        onClick={close}
                      >
                        {brand.cta}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {openItem && hasChildren(openItem) && !isCatalogMega(openItem) && !isBrandsMega(openItem) ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] bg-[#FFF3F4] py-3 shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <div className="mx-auto flex max-w-[1440px] gap-6 px-10">
            {openItem.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className="text-sm text-zinc-700 hover:text-[#D7192D]"
                onClick={close}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "border-t border-[#FCE4E7] bg-white lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="flex max-h-[70vh] flex-col overflow-y-auto px-4 py-3">
          <div className="mb-2 flex flex-col gap-3 border-b border-[#FCE4E7] pb-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#222222]"
              onClick={close}
            >
              <User className="size-5 stroke-[1.6]" />
              Admin Login
            </Link>
          </div>
          {mobileNav.map((item) => (
            <div key={item.label} className="py-1.5">
              <Link
                href={item.href}
                aria-current={pathMatches(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-full border px-4 py-2.5 text-sm font-medium",
                  pathMatches(pathname, item.href)
                    ? "border-[#D7192D] bg-[#D7192D] text-white"
                    : item.label === "Contact Us"
                      ? "border-[#FFBF55] bg-[#FFBF55] text-[#2b2118]"
                      : "border-[#FCE4E7] bg-[#FFF3F4] text-[#2b2118]"
                )}
                onClick={close}
              >
                {navDisplayLabel(item.label)}
                {hasDropdown(item) ? (
                  <ChevronDown className="size-4 text-current" />
                ) : null}
              </Link>
              {hasChildren(item)
                ? item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block py-2 pl-3 text-sm text-neutral-600"
                      onClick={close}
                    >
                      {child.label}
                    </Link>
                  ))
                : null}
              {isCatalogMega(item)
                ? item.extras.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block py-2 pl-3 text-sm text-neutral-600"
                      onClick={close}
                    >
                      {child.label}
                    </Link>
                  ))
                : null}
              {isBrandsMega(item)
                ? item.brands.map((name) => (
                    <Link
                      key={name}
                      href={brandPageHref(name)}
                      className="block py-2 pl-3 text-sm text-neutral-600"
                      onClick={close}
                    >
                      {name}
                    </Link>
                  ))
                : null}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
