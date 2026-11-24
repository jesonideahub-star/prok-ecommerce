import {
  ArrowRight,
  Cherry,
  ChevronRight,
  CupSoda,
  GlassWater,
  Milk,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const flavourCategories = [
  { label: "Syrups", href: "/flavours?tab=syrups", icon: CupSoda },
  { label: "Sauce", href: "/flavours?tab=sauce", icon: GlassWater },
  { label: "Powdered Mix", href: "/flavours?tab=powder", icon: Milk },
] as const;

const flavourTypes = [
  { label: "Premium Syrups", href: "/flavours?tab=syrups" },
  { label: "Gourmet Sauces", href: "/flavours?tab=sauce" },
  { label: "Powdered Mixes", href: "/flavours?tab=powder" },
  { label: "Toppings & Add-ons", href: "/flavours?tab=sauce" },
] as const;

const heroBottles = [
  {
    src: "/images/syrup-chocolate-cutout.png",
    alt: "Catcher Gourmet chocolate syrup",
    className: "bottom-0 left-[2%] h-[78%] w-[18%]",
  },
  {
    src: "/images/syrup-caramel-2l-cutout.png",
    alt: "Catcher Gourmet caramel syrup",
    className: "bottom-0 left-[17%] h-[73%] w-[18%]",
  },
  {
    src: "/images/syrup-matcha-cutout.png",
    alt: "Catcher Gourmet matcha syrup",
    className: "bottom-0 left-[34%] h-[80%] w-[18%]",
  },
  {
    src: "/images/syrup-hazelnut-cutout.png",
    alt: "Catcher Gourmet hazelnut syrup",
    className: "top-0 left-[51%] h-[92%] w-[17%]",
  },
  {
    src: "/images/syrup-white-chocolate-cutout.png",
    alt: "Catcher Gourmet white chocolate syrup",
    className: "top-0 left-[67%] h-[89%] w-[17%]",
  },
  {
    src: "/images/syrup-pistachio-cutout.png",
    alt: "Catcher Gourmet pistachio syrup",
    className: "top-0 right-0 h-[92%] w-[17%]",
  },
] as const;

export function FlavourMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="bg-[#FCE4E7] px-3 py-3 sm:px-5">
      <div className="mx-auto grid min-h-[380px] max-w-[2000px] grid-cols-1 overflow-hidden rounded-[30px] border border-[#f5b5c0] bg-[linear-gradient(110deg,#fffafa_0%,#fff5f6_46%,#FCE4E7_100%)] p-5 shadow-[0_18px_40px_rgba(215,25,45,.16)] sm:p-7 lg:grid-cols-[minmax(300px,21%)_minmax(310px,20%)_minmax(0,1fr)] lg:gap-0 lg:px-9 lg:py-7">
        <section className="lg:border-r lg:border-[#f3b9c0] lg:pr-9">
          <h2 className="border-b border-[#f0a3ae] pb-3 text-[18px] font-bold uppercase text-[#D7192D] sm:text-[20px]">
            Flavour Categories
          </h2>
          <ul className="mt-2">
            {flavourCategories.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="group flex items-center gap-5 py-[11px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:text-[20px]"
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
          <h2 className="border-b border-[#f0a3ae] pb-3 text-[18px] font-bold uppercase text-[#D7192D] sm:text-[20px]">
            Explore Flavours
          </h2>
          <ul className="mt-2">
            {flavourTypes.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="group flex items-center justify-between gap-3 py-[11px] text-[18px] font-medium text-[#29282d] transition-colors hover:text-[#D7192D] sm:text-[20px]"
                >
                  {item.label}
                  <ChevronRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative isolate flex min-h-[330px] items-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#fff5f6_5%,#f8d3d9_55%,#fff5f6_100%)] lg:ml-8 lg:min-h-0 lg:rounded-none">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(255,255,255,.82),transparent_58%),linear-gradient(155deg,transparent_60%,rgba(247,131,150,.22)_60.4%,transparent_77%)]" />
          <div className="absolute inset-x-0 bottom-0 z-0 h-[17%] bg-[linear-gradient(15deg,rgba(251,156,171,.48)_0%,rgba(255,225,230,.12)_40%,transparent_41%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[57%] lg:block">
            {heroBottles.map((bottle) => (
              <span key={bottle.src} className={`absolute ${bottle.className}`}>
                <Image
                  src={bottle.src}
                  alt={bottle.alt}
                  fill
                  sizes="(min-width: 1280px) 9vw, 15vw"
                  className="object-contain object-bottom"
                />
              </span>
            ))}
          </div>
          <div className="relative z-10 max-w-[520px] px-6 py-8 lg:pl-8">
            <h2 className="font-serif text-[56px] leading-[.94] font-bold tracking-tight text-[#6c160f] sm:text-[72px]">
              Flavours
            </h2>
            <p className="mt-4 max-w-[380px] font-serif text-[20px] leading-snug text-[#4c4a4e] sm:text-[24px]">
              Enhance Every Sip.
              <br />
              Create Unforgettable Taste.
            </p>
            <Link
              href="/flavours"
              onClick={onNavigate}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#ed1027] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#c70f22] sm:text-[18px]"
            >
              View All Flavours
              <ArrowRight className="size-5" />
            </Link>
          </div>
          <span className="pointer-events-none absolute right-[39%] bottom-3 z-0 hidden lg:block">
            <Cherry className="size-4 text-[#714637]/75" />
          </span>
        </section>
      </div>
    </div>
  );
}
