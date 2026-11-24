"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import { siteContact } from "@/lib/site";

type SocialName = "Facebook" | "Instagram" | "YouTube" | "TikTok";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-of-service" },
  { label: "Contact Us", href: "/contact" },
] as const;

const socials = [
  { label: "Facebook", href: "#contact" },
  { label: "Instagram", href: "#contact" },
  { label: "YouTube", href: "#contact" },
  { label: "TikTok", href: "#contact" },
] as const;

function SocialGlyph({ name }: { name: SocialName }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="currentColor" d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.8-.1-1.6-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (name === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="4" fill="currentColor" />
        <path d="m10 9 5 3-5 3z" fill="#a8101c" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="currentColor" d="M15.8 3h3c.2 2 1.3 3.2 3.2 3.4v3a8 8 0 0 1-3.2-.9v6.2a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.2a3.1 3.1 0 1 0 1.9 2.8z" />
    </svg>
  );
}

function FooterDecor() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 180"
      className="pointer-events-none absolute bottom-0 h-36 w-44 text-[#31552c] sm:h-44 sm:w-56"
      fill="none"
    >
      <path d="M2 163C37 127 72 82 110 17M39 128C18 116 6 96 10 76c23 3 39 17 42 39M74 89c-2-26 8-47 29-59 13 19 14 42 1 61M106 47c15-20 37-30 61-26-2 23-16 41-39 49" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 180c33-37 52-55 86-75" stroke="#67401f" strokeWidth="8" strokeLinecap="round" />
      <circle cx="30" cy="145" r="13" fill="#c51d2d" />
      <circle cx="53" cy="155" r="14" fill="#e12a35" />
      <circle cx="74" cy="138" r="12" fill="#a90e22" />
      <path d="M30 132c4 7 9 10 16 11m0 0c-1-8 1-13 6-17m-6 17c7-4 13-4 19-1" stroke="#31552c" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="101" cy="153" rx="17" ry="9" transform="rotate(-32 101 153)" fill="#5a2916" />
      <path d="m88 162 25-18" stroke="#a66c3a" strokeWidth="2" />
      <ellipse cx="132" cy="166" rx="17" ry="9" transform="rotate(22 132 166)" fill="#5a2916" />
      <path d="m116 159 32 13" stroke="#a66c3a" strokeWidth="2" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-[linear-gradient(110deg,#8e1018_0%,#a8101c_48%,#760b16_100%)] text-white"
    >
      <FooterDecor />
      <div className="absolute right-0 bottom-0 -scale-x-100">
        <FooterDecor />
      </div>
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-4 border-b border-[#e7b453]/55 py-5 sm:grid-cols-[250px_1fr_auto] sm:gap-6 sm:py-6">
          <div className="flex items-center gap-3">
            <Mail className="size-9 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-serif text-lg font-semibold">Stay in the Loop</p>
              <p className="text-[11px] text-white/85">
                Get the latest offers, coffee tips, and more!
              </p>
            </div>
          </div>
          <form
            className="flex min-w-0 items-center gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Enter your email address"
              className="h-10 min-w-0 flex-1 rounded-full bg-white px-4 text-xs text-[#2b2118] outline-none placeholder:text-[#817873] focus-visible:ring-2 focus-visible:ring-[#f4c36b]"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full bg-[#f4c36b] px-5 text-xs font-semibold text-[#2b2118] transition hover:bg-[#ffd783]"
            >
              Subscribe <span aria-hidden="true">→</span>
            </button>
          </form>
          <div className="flex items-center gap-2 border-white/35 sm:border-l sm:pl-5">
            <span className="mr-1 text-xs font-medium">Follow Us</span>
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-7 items-center justify-center rounded-full bg-white text-[#8e1018] transition hover:bg-[#f4c36b]"
              >
                <SocialGlyph name={label} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 py-5 text-center text-[11px] text-white/90 sm:py-6">
          <p>© 2026 {siteContact.legalName}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {legalLinks.map((link, index) => (
              <span key={link.label} className="inline-flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true" className="text-white/60">|</span> : null}
                <Link href={link.href} className="transition hover:text-[#f4c36b]">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
