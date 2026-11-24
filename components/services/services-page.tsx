import Image from "@/components/media-image";
import NextImage from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cog,
  GraduationCap,
  Headset,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";

import { HomeReveal } from "@/components/home-reveal";
import { diyCleaningProducts } from "@/lib/site";

const services = [
  {
    title: "Machine Maintenance & Repair",
    body: "Professional maintenance and repair services to keep your equipment in peak condition.",
    bullets: ["Preventive maintenance", "Diagnostics & troubleshooting", "Parts replacement"],
    image: "/images/service-maintenance.png",
    alt: "Espresso machine maintenance and repair",
    icon: Wrench,
    href: "#contact",
  },
  {
    title: "Barista Training",
    body: "Hands-on training for you and your team—from basic skills to advanced techniques.",
    bullets: ["Basic to advanced courses", "Brewing & latte art", "Café operations"],
    image: "/images/training-hero.png",
    alt: "Barista training at a coffee machine",
    icon: GraduationCap,
    href: "/training",
  },
  {
    title: "Clean Solution Support",
    body: "Complete cleaning solutions and guidance for a safe and hygienic coffee setup.",
    bullets: ["Cleaning chemicals & tools", "Equipment cleaning guide", "Hygiene best practices"],
    image: "/images/puly-caff-new.png",
    alt: "Puly Caff professional coffee equipment cleaner",
    icon: Sparkles,
    href: "/cleaning-solution",
  },
  {
    title: "Genuine Parts & Accessories",
    body: "High-quality, original parts and accessories for long-lasting performance.",
    bullets: ["Original spare parts", "Grinders & accessories", "Reliable & durable"],
    image: "/images/service-diagnostics.png",
    alt: "Espresso machine components and service parts",
    icon: Cog,
    href: "#contact",
  },
  {
    title: "Delivery & Installation",
    body: "Reliable delivery and professional installation for a seamless setup.",
    bullets: ["Safe & on-time delivery", "Machine installation", "On-site testing & briefing"],
    image: "/images/hero-warehouse.png",
    alt: "Coffee equipment ready for delivery and installation",
    icon: Truck,
    href: "#contact",
  },
  {
    title: "After-Sales Support",
    body: "We’re here after your purchase—ongoing support whenever you need it.",
    bullets: ["Technical support", "Service & repairs", "Customer care"],
    image: "/images/about-services.png",
    alt: "Coffee equipment supported by Prokrate service specialists",
    icon: Headset,
    href: "#contact",
  },
] as const;

const moreServices = [
  {
    title: "Diagnostics and Troubleshooting",
    description: "Rapid diagnostics and troubleshooting for reported machine trouble.",
    image: "/images/service-diagnostics.png",
    href: "#contact",
  },
  {
    title: "Boiler Reconditioning",
    description: "Cleaning and overhaul of boiler and related parts and fittings.",
    image: "/images/service-maintenance.png",
    href: "#contact",
  },
  {
    title: "Water Softener Regeneration",
    description: "Inspect and test water hardness, clean vessel, and apply treatment to restore proper water hardness.",
    image: "/images/machine-services-hero.jpg",
    href: "#contact",
  },
  {
    title: "Total Overhauling",
    description: "Descaling, component rebuild, and full machine refurbishment.",
    image: "/images/machine-services-hero.png",
    href: "#contact",
  },
] as const;

export function ServicesPage() {
  return (
    <main className="flex-1 overflow-hidden bg-[#fff5f4] text-[#292226]">
      <section className="relative isolate min-h-[230px] overflow-hidden border-y border-[#f3c9c4] bg-[linear-gradient(100deg,#fffdfa_0%,#fff9f5_43%,#f8e6df_60%,#321e19_100%)] sm:min-h-[250px]">
        <div className="absolute inset-y-0 right-0 w-[64%]">
          <Image
            src="/images/training-hero.png"
            alt="A barista demonstrating coffee preparation in a professional cafe"
            fill
            preload
            className="object-cover object-[62%_42%]"
            sizes="(min-width: 1024px) 64vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffdfa_0%,#fffdfa_34%,rgba(255,253,250,.9)_42%,rgba(255,253,250,.08)_61%,rgba(20,12,10,.1)_100%)]" />
          <div className="absolute inset-y-0 right-2 hidden w-[112px] items-end justify-center pb-6 text-right font-serif text-[15px] leading-tight text-white italic drop-shadow-md sm:flex sm:right-4">
            Your Partner
            <br />
            in Every Brew.
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[230px] max-w-[1440px] items-center px-5 py-6 sm:min-h-[250px] sm:px-8 lg:px-14">
          <div className="max-w-[53%] sm:max-w-[47%]">
            <div className="flex items-center gap-3 text-[11px] font-bold tracking-wide text-[#d7192d] uppercase">
              <span>Our Services</span>
              <span className="h-px w-20 bg-[#e14b56] sm:w-36" />
            </div>
            <h1 className="mt-2 max-w-[570px] font-serif text-[27px] leading-[1.03] font-bold tracking-tight text-[#32221e] sm:text-[30px] lg:text-[42px]">
              Complete Solutions
              <span className="block text-[#d7192d]">for Your Coffee Business</span>
            </h1>
            <p className="mt-2 max-w-[400px] text-[11px] leading-relaxed text-[#423a38] sm:text-[13px]">
              From expert maintenance to professional training, we&apos;re here to support your business every step of the way.
            </p>
            <a
              href="#services"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e50925] px-4 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024] sm:text-[11px]"
            >
              Explore Our Services
              <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#fff8f6_0%,#fff0ef_50%,#fff8f6_100%)] px-3 py-4 sm:px-5 sm:py-5"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-28 top-16 size-[380px] rounded-full border-[28px] border-[#f7bbc0]/25" />
          <div className="absolute -right-36 bottom-0 size-[460px] rounded-full border-[32px] border-[#f7bbc0]/25" />
        </div>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="flex min-h-[160px] overflow-hidden rounded-[15px] border border-[#f2e3df] bg-white/80 p-2 shadow-[0_4px_14px_rgba(80,40,30,.05)] sm:min-h-[175px] sm:p-2.5"
              >
                <div className="relative min-h-full w-[37%] shrink-0 overflow-hidden rounded-[10px] bg-[#f7eee9]">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(min-width: 1024px) 15vw, (min-width: 640px) 25vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col pl-2.5 pr-1 py-1">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e50925] text-white">
                      <Icon className="size-4" />
                    </span>
                    <h2 className="font-serif text-[12px] leading-tight font-bold text-[#2b2118] sm:text-[13px]">
                      {service.title}
                    </h2>
                  </div>
                  <p className="mt-1.5 text-[10px] leading-[1.4] text-[#5b5350]">
                    {service.body}
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-1 text-[9px] leading-tight text-[#4c4542]"
                      >
                        <Check className="mt-px size-2.5 shrink-0 rounded-full bg-[#e50925] p-[2px] text-white" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[10px] font-semibold text-[#d7192d] hover:underline"
                  >
                    Learn More
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#fff8f6] px-4 pb-3 sm:px-6">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[#ed7d83]" />
            <h2 className="font-serif text-[15px] font-bold text-[#362621] sm:text-[18px]">
              More Services
            </h2>
            <span className="h-px flex-1 bg-[#ed7d83]" />
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {moreServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative isolate flex min-h-[130px] items-end overflow-hidden rounded-xl border border-white shadow-[0_4px_12px_rgba(80,40,30,.1)] sm:min-h-[150px]"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 -z-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <span className="relative z-10 p-3 text-white">
                  <span className="block font-serif text-[13px] leading-tight font-bold sm:text-[15px]">
                    {service.title}
                  </span>
                  <span className="mt-1 block max-w-[36ch] text-[9px] leading-snug text-white/90 sm:text-[10px]">
                    {service.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#fff8f6_0%,#fff0ef_50%,#fff8f6_100%)] px-5 py-7 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-10 size-[360px] rounded-full border-[28px] border-[#f7bbc0]/25" />
          <div className="absolute -right-32 bottom-0 size-[430px] rounded-full border-[30px] border-[#f7bbc0]/25" />
        </div>
        <HomeReveal>
          <h2 className="text-center font-serif text-[1.65rem] text-[#9b1020] md:text-[1.9rem]">
            Do It Yourself Cleaning
          </h2>
          <span className="mx-auto mt-2 block h-[2px] w-12 rounded-full bg-[#d0122d]/45" />
        </HomeReveal>
        <div className="mx-auto mt-5 grid max-w-[1280px] grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {diyCleaningProducts.map((item, index) => (
            <HomeReveal key={item.name} delay={50 + index * 40} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-xl border border-[#f0dfdb] bg-white/90 p-2.5 shadow-[0_4px_12px_rgba(80,50,20,0.04)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#dca5a3] hover:shadow-[0_12px_24px_rgba(80,50,20,0.12)] sm:p-3"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[180px] rounded-lg bg-[#faf6ef]">
                  <div
                    className="absolute inset-0 animate-product-float group-hover:[animation-play-state:paused]"
                    style={{ animationDelay: `${index * 280}ms` }}
                  >
                    <NextImage
                      src={item.src}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-contain p-2 drop-shadow-[0_14px_18px_rgba(80,50,20,0.12)] transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="180px"
                    />
                  </div>
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute inset-y-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-cta-shine" />
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-[14px] leading-snug text-[#4a4038] transition-colors duration-300 group-hover:text-[#d0122d] sm:text-[15px]">
                  {item.name}
                </h3>
                <p className="mt-1 text-[10px] text-zinc-400 transition-colors duration-300 group-hover:text-[#a07a58]">
                  {item.brand}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[10px] text-zinc-500 transition-colors duration-300 group-hover:text-[#d0122d]">
                  Learn more
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#d9d5d1] text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#d0122d] group-hover:shadow-[0_6px_12px_rgba(139,90,43,0.35)]">
                    <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-px" />
                  </span>
                </span>
              </Link>
            </HomeReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
