import {
  Bean,
  ArrowRight,
  ChevronRight,
  CupSoda,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Roasted Coffee Beans", href: "/coffee?category=beans", icon: Bean },
  { label: "Pods", href: "/coffee?category=pods", icon: CupSoda },
] as const;

export function CoffeeMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="bg-[#FCE4E7] px-3 py-3 sm:px-5">
      <div className="mx-auto grid min-h-[430px] max-w-[2000px] grid-cols-1 overflow-hidden rounded-[30px] border border-[#f5b5c0] bg-[linear-gradient(110deg,#fffafa_0%,#fff5f6_46%,#FCE4E7_100%)] p-5 shadow-[0_18px_40px_rgba(215,25,45,.16)] sm:p-7 lg:grid-cols-[minmax(300px,21%)_minmax(0,1fr)] lg:gap-0 lg:px-9 lg:py-10">
        <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-9">
          <h2 className="border-b border-[#f0a3ae] pb-3 text-[20px] font-bold text-[#D7192D]">
            Coffee Categories
          </h2>
          <ul className="mt-2">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="group flex items-center gap-5 py-[10px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:text-[20px]"
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

        <section className="relative isolate flex min-h-[340px] items-center overflow-hidden rounded-2xl bg-[#fff3f4] lg:ml-8 lg:min-h-0 lg:rounded-none">
          <Image
            src="/images/hero-beans.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="absolute inset-0 z-0 object-cover object-[62%_54%]"
          />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,#fff7f8_0%,rgba(255,247,248,.98)_25%,rgba(255,247,248,.82)_42%,rgba(255,247,248,.08)_76%)]" />
          <div className="relative z-20 max-w-[420px] px-6 py-8 lg:pl-8">
            <h2 className="font-serif text-[64px] leading-[.9] font-bold tracking-tight text-[#3b1c17] sm:text-[84px]">
              Coffee
            </h2>
            <p className="mt-5 max-w-[320px] text-[19px] leading-snug text-[#4c4a4e] sm:text-[23px]">
              Premium Coffee for
              <br />
              Exceptional Taste.
            </p>
            <Link
              href="/coffee"
              onClick={onNavigate}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#ed1027] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#c70f22] sm:text-[18px]"
            >
              View All Coffee
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
