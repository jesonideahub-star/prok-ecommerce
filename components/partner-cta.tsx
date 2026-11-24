import Image from "@/components/media-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";

export function PartnerCta() {
  return (
    <section className="relative isolate overflow-hidden border-y border-[#ed9ca5] bg-[linear-gradient(105deg,#fff1ed_0%,#ffe4e7_48%,#fff5ed_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-[linear-gradient(176deg,transparent_38%,#e55563_40%,#f7b2b4_45%,transparent_47%)]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-4 px-5 py-5 sm:grid-cols-[150px_1fr_auto] sm:px-8 lg:grid-cols-[220px_1fr_300px]">
        <div className="relative mx-auto hidden h-[125px] w-full sm:block">
          <Image
            src="/images/about-latte.png"
            alt="Freshly poured latte"
            fill
            className="object-contain drop-shadow-[0_10px_14px_rgba(114,39,35,.18)]"
            sizes="220px"
          />
        </div>
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-[#4c211f] sm:text-[30px]">
            Partner with Prokrate
          </h2>
          <p className="mt-1 text-xs text-[#463b35] sm:text-sm">
            Experience the difference of working with the leading brands in the coffee industry.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#d0122d] px-6 py-2 text-xs font-semibold text-white transition hover:bg-[#a91020]"
          >
            Contact Us <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="hidden items-center justify-center border-l border-[#c68884] pl-5 sm:flex">
          <div className="flex flex-col items-center">
            <SiteLogo className="[&_img]:h-12" />
            <p className="mt-1 text-[9px] font-bold tracking-[0.2em] text-[#30231e] uppercase">
              Good coffee. Greater possibilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
