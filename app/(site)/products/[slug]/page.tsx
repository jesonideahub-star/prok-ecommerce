import type { Metadata } from "next";

import { GrinderProductPage } from "@/components/grinders/grinder-product-page";
import { EspressoMachineProductPage } from "@/components/espresso-machines/espresso-machine-product-page";

export const metadata: Metadata = {
  title: "Product Details | Prokrate International",
  description:
    "Explore product specifications and details from Prokrate International.",
};

export default async function Page({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;

  if (slug === "nettuno-a1") {
    return <EspressoMachineProductPage slug={slug} />;
  }

  return <GrinderProductPage slug={slug} />;
}