"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Gift,
  Headset,
  House,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { BrandsMenu } from "@/components/brands-menu";
import { CoffeeMenu } from "@/components/coffee-menu";
import { EspressoMachineMenu } from "@/components/espresso-machine-menu";
import { FlavourMenu } from "@/components/flavour-menu";
import { GrinderMenu } from "@/components/grinder-menu";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  brandPageHref,
  headerNavOrder,
  navDisplayLabel,
  navItems,
  navItemsByLabels,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type NavItem = (typeof navItems)[number];
type CatalogMega = Extract<NavItem, { mega: "catalog" }>;
type BrandsMega = Extract<NavItem, { mega: "brands" }>;

const desktopNav = navItemsByLabels([
  "Home",
  "About Us",
  "Brands",
  "Espresso Machines",
  "Grinders",
  "Coffee",
  "Flavours",
  "Puly Caff Product",
  "Barista Training",
  "Services",
  "News & Events",
  "Contact Us",
]);
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
    <div
      onMouseEnter={onOpen}
      className={cn(
        "shrink-0",
        item.label === "Puly Caff Product" && "ml-2 border-l border-[#D7192D] pl-2"
      )}
    >
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[16px] font-medium transition-colors xl:px-2 xl:text-[14px] 2xl:px-3 2xl:text-[17px]",
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
        {item.label === "Home" ? <House className="size-4 fill-current" /> : null}
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

function SearchForm({
  className,
  large = false,
}: {
  className?: string;
  large?: boolean;
}) {
  return (
    <form
      action="/search"
      method="get"
      className={cn(
        "flex min-w-0 items-center overflow-hidden rounded-full border border-[#f0e2d7] bg-white pr-1 shadow-[0_1px_3px_rgba(80,40,20,0.06)]",
        className
      )}
    >
      <label className="flex min-w-0 flex-1">
        <span className="sr-only">Search</span>
        <Input
          type="search"
          name="q"
          placeholder="What are you looking for?"
          className={cn(
            "min-w-0 flex-1 rounded-none border-0 bg-white px-4 text-[15px] shadow-none placeholder:text-neutral-400 focus-visible:border-transparent focus-visible:ring-0 2xl:text-[17px]",
            large ? "h-[72px]" : "h-11"
          )}
        />
      </label>
      <Button
        type="submit"
        aria-label="Search"
        className={cn(
          "shrink-0 rounded-full border-0 bg-[#D7192D] text-white hover:bg-[#b91427]",
          large ? "size-[76px]" : "size-11"
        )}
      >
        <Search className={cn(large ? "size-7" : "size-5")} />
      </Button>
    </form>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const pathname = usePathname();

  const openItem = navItems.find((item) => item.label === mega);

  function close() {
    setMega(null);
    setMobileOpen(false);
  }

  function openNavItem(item: NavItem) {
    setMega(hasDropdown(item) ? item.label : null);
  }

  return (
    <header
      className="sticky top-0 z-50 overflow-x-clip bg-[#fffaf6] text-[#2b2118]"
      onMouseLeave={() => setMega(null)}
    >
      <div className="hidden bg-[#b00016] text-white xl:block">
        <div className="mx-auto flex h-[50px] max-w-[1900px] items-center px-8">
          <div className="grid min-w-0 flex-1 grid-cols-3">
            <div className="flex items-center justify-center gap-3 border-r border-white/80 text-[16px] 2xl:text-[18px]">
              <Gift className="size-6 shrink-0 stroke-[2.4]" />
              <span>Ship you Order now</span>
            </div>
            <div className="flex items-center justify-center gap-3 border-r border-white/80 text-[16px] 2xl:text-[18px]">
              <ShieldCheck className="size-7 shrink-0 stroke-[2.2]" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-[16px] 2xl:text-[18px]">
              <Headset className="size-7 shrink-0 stroke-[2.2]" />
              <span>24/7 Customer Support</span>
            </div>
          </div>
          <div
            aria-label="Social media"
            className="ml-12 flex shrink-0 items-center gap-7"
          >
            <span aria-label="Facebook">
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.8-.1-1.6-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8z" />
              </svg>
            </span>
            <span aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="17.5" cy="6.8" r="1.3" fill="currentColor" />
              </svg>
            </span>
            <span aria-label="YouTube">
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <rect x="2.5" y="5" width="19" height="14" rx="4" />
                <path d="m10 9 5 3-5 3z" fill="#b00016" />
              </svg>
            </span>
            <span aria-label="TikTok">
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <path d="M15.8 3h3c.2 2 1.3 3.2 3.2 3.4v3a8 8 0 0 1-3.2-.9v6.2a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.2a3.1 3.1 0 1 0 1.9 2.8z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:hidden">
        <SiteLogo className="min-w-0 shrink-0 [&_img]:h-10 sm:[&_img]:h-11 lg:[&_img]:h-12" />
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

      <div className="mx-auto hidden h-[112px] max-w-[1900px] items-center justify-between gap-8 px-8 xl:flex">
        <SiteLogo className="w-[300px] shrink-0 [&_img]:h-[76px]" />
        <SearchForm large className="flex-1 max-w-[1000px]" />
        <div className="flex shrink-0 items-center gap-6">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-medium text-[#181818] transition-colors hover:text-[#D7192D] 2xl:text-[17px]"
          >
            <User className="size-8 stroke-[1.8] text-[#D7192D]" />
            Admin Login
          </Link>
        </div>
      </div>

      <div className="mx-auto hidden h-[84px] max-w-[1900px] items-center px-8 xl:flex">
        <nav aria-label="Main navigation" className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
          <div className="flex w-max min-w-full items-center justify-between gap-1.5">
            {desktopNav.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                isOpen={mega === item.label}
                isActive={pathMatches(pathname, item.href)}
                onOpen={() => openNavItem(item)}
              />
            ))}
          </div>
        </nav>
      </div>

      <div className="border-b border-[#e6c6a9] px-4 pb-3 xl:hidden">
        <SearchForm />
      </div>

      {openItem && isBrandsMega(openItem) ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <BrandsMenu brands={openItem.brands} onNavigate={close} />
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

      {openItem && isCatalogMega(openItem) && openItem.label === "Grinders" ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <GrinderMenu onNavigate={close} />
        </div>
      ) : null}

      {openItem && isCatalogMega(openItem) && openItem.label === "Flavours" ? (
        <div className="absolute inset-x-0 top-full border-t border-[#FCE4E7] shadow-[0_18px_40px_rgba(215,25,45,0.12)]">
          <FlavourMenu onNavigate={close} />
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
          "border-t border-[#FCE4E7] bg-white xl:hidden",
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
