import type { Metadata } from "next";

import { EventDetailPage } from "@/components/news-events/event-detail-page";

export const metadata: Metadata = {
  title: "Event Details | Prokrate International",
  description: "News and event details from Prokrate International.",
};

export default async function Page({ params }: PageProps<"/news-events/[slug]">) {
  const { slug } = await params;
  return <EventDetailPage slug={slug} />;
}