import type { Metadata } from "next";

import { SearchResults } from "@/components/search-results";

export const metadata: Metadata = {
  title: "Search | Prokrate International",
  description: "Search Prokrate coffee, equipment, and flavour products.",
};

export default async function Page({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;

  return <SearchResults key={query ?? ""} query={query ?? ""} />;
}
