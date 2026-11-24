"use client";

import { useState, type FormEvent } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

import { siteContact } from "@/lib/site";

const contactEmail = "info@prokrate.com";
const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(siteContact.address)}&output=embed`;

export function ContactPage() {
  const [messageStatus, setMessageStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const subject = String(formData.get("subject") ?? "General inquiry");
    const message = String(formData.get("message") ?? "");
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMessageStatus("Your email app should open with your message ready to send.");
  }

  return (
    <main className="flex-1 bg-[#fff7f7] text-[#292226]">
      <section className="relative isolate min-h-[205px] overflow-hidden border-y border-[#f2b2ba] bg-[linear-gradient(105deg,#fff8f8_0%,#ffe8eb_50%,#f7b7c1_100%)] sm:min-h-[235px]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[120px] -top-[340px] size-[610px] rounded-full border-[26px] border-white/65" />
          <div className="absolute left-[18%] -top-[390px] size-[680px] rounded-full border-[22px] border-[#f19aa8]/25" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(170deg,transparent 0_43%,rgba(226,24,51,.18) 44%_52%,transparent 53%)]" />
        </div>
        <div className="absolute inset-y-0 right-0 w-[72%] sm:w-[65%]">
          <Image
            src="/images/about-latte.png"
            alt="Freshly poured latte with coffee beans"
            fill
            preload
            sizes="(min-width: 640px) 65vw, 72vw"
            className="object-cover object-[58%_52%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff8f8_0%,rgba(255,248,248,.92)_12%,rgba(255,248,248,.18)_50%,rgba(33,14,9,.12)_100%)]" />
        </div>
        <div className="relative mx-auto flex min-h-[205px] max-w-[1440px] items-center px-5 py-5 sm:min-h-[235px] sm:px-8 lg:px-14">
          <div className="relative z-10">
            <h1 className="font-serif text-[48px] leading-none font-medium tracking-tight text-[#3d211f] sm:text-[64px] lg:text-[78px]">
              Contact <span className="font-bold text-[#e50925] italic">Us</span>
            </h1>
            <span className="mt-2 block h-[2px] w-[130px] bg-[#e50925]" />
            <p className="mt-2 text-[16px] text-[#382c2a] sm:text-[20px]">
              We’d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,#fffdfd_0%,#fff4f4_70%,#ffe6e8_100%)]" />
        <div className="mx-auto grid max-w-[1280px] gap-3 lg:grid-cols-[minmax(350px,0.82fr)_minmax(0,1.42fr)]">
          <section className="rounded-[20px] border border-white/80 bg-white/80 p-5 shadow-[0_8px_24px_rgba(158,45,56,.08)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#ed0925] text-white shadow-[0_5px_12px_rgba(237,9,37,.2)]">
                <Mail className="size-6" />
              </span>
              <div>
                <h2 className="font-serif text-[25px] leading-tight font-bold text-[#432725] sm:text-[29px]">
                  Get in Touch
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-[#51484a]">
                  Have a question, feedback, or partnership inquiry? Fill out the form below and
                  we’ll get back to you shortly.
                </p>
              </div>
            </div>

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative block">
                  <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#837978]" />
                  <span className="sr-only">Your name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your Name"
                    className="h-11 w-full rounded-xl border border-[#eee2e2] bg-white/80 pr-3 pl-10 text-[13px] outline-none transition focus:border-[#ed7380] focus:ring-2 focus:ring-[#ed7380]/15"
                  />
                </label>
                <label className="relative block">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#837978]" />
                  <span className="sr-only">Email address</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email Address"
                    className="h-11 w-full rounded-xl border border-[#eee2e2] bg-white/80 pr-3 pl-10 text-[13px] outline-none transition focus:border-[#ed7380] focus:ring-2 focus:ring-[#ed7380]/15"
                  />
                </label>
              </div>

              <label className="relative block">
                <LayoutGrid className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#837978]" />
                <span className="sr-only">Subject</span>
                <select
                  name="subject"
                  defaultValue=""
                  required
                  className="h-11 w-full appearance-none rounded-xl border border-[#eee2e2] bg-white/80 pr-10 pl-10 text-[13px] text-[#6b6260] outline-none transition focus:border-[#ed7380] focus:ring-2 focus:ring-[#ed7380]/15"
                >
                  <option value="" disabled>
                    Subject
                  </option>
                  <option>Product inquiry</option>
                  <option>Barista training</option>
                  <option>Service and support</option>
                  <option>Partnership inquiry</option>
                  <option>Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#837978]" />
              </label>

              <label className="relative block">
                <MessageSquare className="pointer-events-none absolute top-3.5 left-3 size-4 text-[#837978]" />
                <span className="sr-only">Your message</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Your Message"
                  className="w-full resize-y rounded-xl border border-[#eee2e2] bg-white/80 py-3 pr-3 pl-10 text-[13px] outline-none transition focus:border-[#ed7380] focus:ring-2 focus:ring-[#ed7380]/15"
                />
              </label>

              <div className="flex flex-col items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#e50925] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_5px_12px_rgba(229,9,37,.16)] transition hover:bg-[#bd1024]"
                >
                  <Send className="size-4" />
                  Send Message
                  <ArrowRight className="size-4" />
                </button>
                <p aria-live="polite" className="min-h-4 text-center text-[11px] text-[#62595a]">
                  {messageStatus}
                </p>
              </div>
            </form>
          </section>

          <section className="rounded-[20px] border border-white/80 bg-white/80 p-4 shadow-[0_8px_24px_rgba(158,45,56,.08)] sm:p-6">
            <div className="mb-3 flex items-center gap-4 px-1">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ed0925] text-white">
                <MapPin className="size-5" />
              </span>
              <h2 className="font-serif text-[24px] leading-tight font-bold text-[#432725] sm:text-[28px]">
                Our Office Location
              </h2>
            </div>
            <div className="relative h-[260px] overflow-hidden rounded-[14px] bg-[#b8e4ed] sm:h-[330px] lg:h-[350px]">
              <iframe
                title="Map showing Prokrate's office in Davao City"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full border-0"
              />
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteContact.address)}`}
                target="_blank"
                rel="noreferrer"
                className="absolute right-3 bottom-3 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#4c211f] shadow hover:text-[#d0122d]"
              >
                Open in Google Maps
              </Link>
            </div>
            <div className="mt-3 grid gap-2 rounded-xl bg-[#fff7f7] p-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-2 border-[#f3b2b8] px-2 py-1 xl:border-r">
                <MapPin className="size-5 shrink-0 text-[#ed0925]" />
                <p className="text-[10px] leading-snug text-[#403739]">{siteContact.address}</p>
              </div>
              {siteContact.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replaceAll(" ", "")}`}
                  className="flex items-center gap-2 border-[#f3b2b8] px-2 py-1 text-[11px] text-[#403739] hover:text-[#d0122d] xl:border-r"
                >
                  <Phone className="size-5 shrink-0 text-[#ed0925]" />
                  {phone}
                </a>
              ))}
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 px-2 py-1 text-[11px] text-[#403739] hover:text-[#d0122d]"
              >
                <Mail className="size-5 shrink-0 text-[#ed0925]" />
                {contactEmail}
              </a>
            </div>
            <div className="mt-2 flex items-center gap-2 px-3 text-[10px] text-[#5b5151]">
              <Clock3 className="size-4 shrink-0 text-[#ed0925]" />
              <span>Contact us for current office hours.</span>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
