import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-[#fff6ee]">
      <article className="mx-auto max-w-[760px] px-5 py-12 md:px-8 md:py-16">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[#d0122d] uppercase">
          Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#2b2118] md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {updated}</p>
        <div className="prose-legal mt-8 space-y-5 text-[15px] leading-7 text-zinc-700 [&_a]:text-[#d0122d] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#2b2118] [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </main>
  );
}
