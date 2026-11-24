import Image from "@/components/media-image";
import NextImage from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShieldCheck, Truck } from "lucide-react";

import { HomeReveal } from "@/components/home-reveal";
import { diyCleaningProducts, machineServicesCopy, valueProps } from "@/lib/site";

const highlightIcons = [ShieldCheck, Truck, Heart];

export function ServicesPage() {
  return (
    <main className="flex-1 bg-[#fff6ee]">
      <section className="mx-auto max-w-[1180px] px-5 py-8 md:px-8 md:py-10">
        <div className="relative min-h-[340px] overflow-hidden rounded-2xl md:min-h-[440px]">
          <Image
            src="/images/machine-services-hero.jpg"
            alt="Commercial espresso machines on the workshop bench for service"
            fill
            preload
            className="object-cover object-center"
            sizes="(min-width: 1180px) 1180px, 100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative flex min-h-[340px] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[440px] md:px-16">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {machineServicesCopy.title}
            </h1>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-7 text-white/95 md:text-base">
              {machineServicesCopy.body}
            </p>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl">
          <Image
            src="/images/the-importance-of-coffee-shops-in-communities-782577.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(min-width: 1180px) 1180px, 100vw"
          />
          <div className="absolute inset-0 bg-[#2b2118]/78" />
          <div className="relative grid grid-cols-1 gap-4 px-5 py-10 sm:grid-cols-3 sm:gap-5 md:px-8 md:py-14">
            {valueProps.map((item, index) => {
              const Icon = highlightIcons[index];
              return (
                <article
                  key={item.title}
                  className="flex min-h-[170px] flex-col items-center justify-center rounded-[28px] border border-white bg-white/10 px-5 py-8 text-center backdrop-blur-[2px] md:min-h-[210px] md:px-6"
                >
                  <Icon className="size-8 stroke-[1.4] text-white" />
                  <h2 className="mt-4 font-serif text-2xl text-white md:text-[1.65rem]">{item.title}</h2>
                  <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-white/90">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-16">
        <HomeReveal>
          <h2 className="text-center font-serif text-[1.85rem] text-[#9b1020] md:text-[2.1rem]">
            Do It Yourself Cleaning
          </h2>
          <span className="mx-auto mt-4 block h-[2px] w-12 rounded-full bg-[#d0122d]/45" />
        </HomeReveal>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {diyCleaningProducts.map((item, index) => (
            <HomeReveal key={item.name} delay={80 + index * 70} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-xl border border-[#e4e0da] bg-white p-4 shadow-[0_8px_18px_rgba(80,50,20,0.04)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#c4a882] hover:shadow-[0_22px_40px_rgba(80,50,20,0.14)]"
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
                      className="object-contain p-2 drop-shadow-[0_14px_18px_rgba(80,50,20,0.12)] transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="180px"
                    />
                  </div>
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute inset-y-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-cta-shine" />
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-[17px] leading-snug text-[#4a4038] transition-colors duration-300 group-hover:text-[#d0122d]">
                  {item.name}
                </h3>
                <p className="mt-1 text-[13px] text-zinc-400 transition-colors duration-300 group-hover:text-[#a07a58]">
                  {item.brand}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[13px] text-zinc-500 transition-colors duration-300 group-hover:text-[#d0122d]">
                  Learn more
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#d9d5d1] text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#d0122d] group-hover:shadow-[0_6px_12px_rgba(139,90,43,0.35)]">
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-px" />
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
