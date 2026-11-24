import Image from "@/components/media-image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Coffee,
  GraduationCap,
  Headset,
  Package,
  ShoppingBag,
  Utensils,
  Wrench,
} from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { aboutCopy } from "@/lib/site";

const essentials = [
  { label: "Coffee Machines", icon: Coffee, href: "/espresso-machines" },
  { label: "Grinders", icon: Wrench, href: "/grinders" },
  { label: "Specialty Beans", icon: Package, href: "/coffee" },
  { label: "Gourmet Sauces", icon: Utensils, href: "/flavours" },
  { label: "Barista Tools", icon: ShoppingBag, href: "/training" },
] as const;

const missionIcons = [GraduationCap, Headset, Wrench] as const;
const objectiveIcons = [Coffee, ArrowRight, ShoppingBag] as const;

export function AboutPage() {
  return (
    <main className="flex-1 overflow-hidden bg-[#fff7ef] text-[#30231e]">
      <section className="relative isolate min-h-[218px] overflow-hidden border-b border-[#e9c2b9] sm:min-h-[235px]">
        <Image
          src="/images/hero-beans.png"
          alt="Freshly brewed coffee and roasted coffee beans"
          fill
          priority
          className="object-cover object-[62%_52%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff5f2_0%,rgba(255,245,242,.98)_29%,rgba(255,245,242,.68)_45%,rgba(255,245,242,.03)_71%)]" />
        <div className="relative mx-auto flex min-h-[218px] max-w-[1280px] items-center px-5 py-7 sm:min-h-[235px] sm:px-8 lg:px-10">
          <div className="max-w-[420px]">
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-[#b20f26] uppercase">
              About Us <span className="h-px w-32 bg-[#d68b82]" />
            </p>
            <h1 className="mt-1 font-serif text-[42px] leading-[0.88] font-bold tracking-tight sm:text-[50px]">
              Brewing Better
              <span className="block text-[48px] font-semibold italic text-[#d0122d] sm:text-[58px]">
                Together
              </span>
            </h1>
            <p className="mt-3 max-w-[390px] text-[13px] leading-[1.35] text-[#392d28]">
              At Prokrate Trading Corporation, we’re passionate about coffee
              and committed to bringing the world’s finest brands and solutions
              to cafés, restaurants, and coffee lovers across the Philippines.
            </p>
            <Link
              href="#our-story"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#d0122d] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#a91020]"
            >
              Our Story <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="our-story" className="relative isolate px-4 py-3 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,.86),rgba(255,247,239,0)_70%)]" />
        <div className="relative mx-auto grid max-w-[1280px] gap-3 lg:grid-cols-[1.05fr_.72fr_1.38fr]">
          <article className="rounded-[20px] border border-[#f2ded7] bg-white/80 p-4 shadow-[0_8px_24px_rgba(114,39,35,.06)] sm:p-5">
            <SectionLabel>About Our Company</SectionLabel>
            <h2 className="mt-2 font-serif text-[21px] leading-[1.05] font-bold">
              Prokrate International Trading Corporation
            </h2>
            <p className="mt-2 text-[12px] leading-[1.38] text-[#463b35]">
              {aboutCopy.company}
            </p>
          </article>

          <div className="relative min-h-[200px] overflow-hidden rounded-[20px] shadow-[0_8px_24px_rgba(114,39,35,.10)] lg:min-h-0">
            <Image
              src="/images/hero-slayer-barista.png"
              alt="Barista preparing coffee at a cafe"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, 100vw"
            />
          </div>

          <article className="rounded-[20px] border border-[#f2ded7] bg-white/80 p-4 shadow-[0_8px_24px_rgba(114,39,35,.06)] sm:p-5">
            <SectionLabel>Your Coffee Essentials in One Stop</SectionLabel>
            <p className="mt-2 text-[12px] leading-[1.4] text-[#463b35]">
              {aboutCopy.company}
            </p>
            <div className="mt-4 grid grid-cols-5 divide-x divide-[#d5c7bf]">
              {essentials.map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex min-w-0 flex-col items-center gap-1 px-1 text-center transition hover:text-[#d0122d]"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#ffe8e8] text-[#d0122d]">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-[10px] leading-[1.05]">{label}</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[20px] border border-[#f2ded7] bg-white/80 p-4 shadow-[0_8px_24px_rgba(114,39,35,.06)] sm:p-5">
            <SectionLabel>Our Mission</SectionLabel>
            <ul className="mt-2 space-y-2">
              {aboutCopy.mission.map((item, index) => {
                const Icon = missionIcons[index] ?? Coffee;
                return (
                  <li key={item} className="flex items-start gap-2 text-[11px] leading-[1.32]">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#fff0ef] text-[#c7132b]">
                      <Icon className="size-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </article>

          <div className="relative min-h-[200px] overflow-hidden rounded-[20px] shadow-[0_8px_24px_rgba(114,39,35,.10)] lg:min-h-0">
            <Image
              src="/images/about-latte.png"
              alt="Latte art in a freshly poured coffee"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, 100vw"
            />
          </div>

          <article className="rounded-[20px] border border-[#f2ded7] bg-white/80 p-4 shadow-[0_8px_24px_rgba(114,39,35,.06)] sm:p-5">
            <SectionLabel>Our Objectives</SectionLabel>
            <ul className="mt-2 space-y-3">
              {aboutCopy.objectives.map((item, index) => {
                const Icon = objectiveIcons[index] ?? ArrowRight;
                return (
                  <li key={item} className="flex items-start gap-2.5 text-[11px] leading-[1.35]">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffe8e8] text-[#d0122d]">
                      <Icon className="size-4" />
                    </span>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-[#e4a0a4] bg-[linear-gradient(100deg,#fff7ef,#fff0eb_47%,#ffe4e4)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-[linear-gradient(176deg,transparent_38%,#e55563_40%,#f7b2b4_45%,transparent_47%)]" />
        <div className="relative mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-5 py-4 sm:flex-row sm:px-8">
          <SiteLogo showPitcorp={false} className="[&_img]:h-10 sm:[&_img]:h-11" />
          <p className="font-serif text-lg italic text-[#a91020] sm:text-xl">
            Exceptional Coffee Experiences. Anytime. Anywhere.
          </p>
          <p className="text-[9px] font-semibold tracking-[0.18em] text-[#a91020] uppercase">
            Good coffee. Greater possibilities.
          </p>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 rounded-full bg-[#ffe1e3] px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#c3142c] uppercase">
        {children}
      </span>
      <span className="h-px flex-1 bg-[#e6a1a0]" />
    </div>
  );
}
