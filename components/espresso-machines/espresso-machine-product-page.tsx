"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import {
  ArrowDownToLine,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  ShoppingCart,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_src: string | null;
  description: string | null;
};

type ProductDetailRow = {
  name: string | null;
  description: string | null;
  dimensions: string | null;
  boiler_capacity: string | null;
  display: string | null;
  power_consumption: string | null;
  power_supply: string | null;
  steam_wands: string | null;
  water_wand: string | null;
  weight: string | null;
  key_advantages: string | null;
  image_src: string | null;
  images_list: string | null;
  download_catalog: string | null;
  file_url: string | null;
  url: string | null;
  product_type: string | null;
};

type ProductImageRow = {
  image_src: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductTab = "details" | "specifications" | "reviews";

type EspressoMachineData = {
  product: ProductRow;
  detail: ProductDetailRow | null;
  images: ProductImageRow[];
};

function publicUrl(value: string | null | undefined) {
  const url = value?.trim();
  if (!url) return null;
  return url.startsWith("//") ? `https:${url}` : url;
}

function splitImageUrls(value: string | null | undefined) {
  return (value ?? "")
    .split(/\s*,\s*/)
    .map((url) => publicUrl(url))
    .filter((url): url is string => Boolean(url));
}

function displayValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed !== "0" ? trimmed : null;
}

export function EspressoMachineProductPage({ slug }: { slug: string }) {
  const [data, setData] = useState<EspressoMachineData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductTab>("details");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const relatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setLoadError(false);
        const supabase = createClient();
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("id, name, slug, category, image_src, description")
          .eq("slug", slug)
          .eq("category", "espresso_machine")
          .maybeSingle();

        if (productError) throw productError;
        if (!product) {
          if (active) setData(null);
          return;
        }

        const [detailResult, imagesResult] = await Promise.all([
          supabase
            .from("product_details")
            .select(
              "name, description, dimensions, boiler_capacity, display, power_consumption, power_supply, steam_wands, water_wand, weight, key_advantages, image_src, images_list, download_catalog, file_url, url, product_type"
            )
            .eq("product_id", product.id)
            .maybeSingle(),
          supabase
            .from("product_images")
            .select("image_src, alt, is_primary, sort_order")
            .eq("product_id", product.id)
            .order("sort_order"),
        ]);

        if (detailResult.error) throw detailResult.error;
        if (imagesResult.error) throw imagesResult.error;

        if (active) {
          setData({
            product,
            detail: detailResult.data,
            images: imagesResult.data ?? [],
          });
        }
      } catch (error) {
        console.error("Unable to load the selected espresso machine.", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loadError) {
    return (
      <main className="flex-1 bg-[#fff9f9] px-4 py-16 text-center text-[#25212a]">
        <p role="alert" className="text-sm">
          This product could not be loaded. Please try again later.
        </p>
        <Link
          href="/espresso-machines"
          className="mt-4 inline-flex text-sm font-semibold text-[#e50925]"
        >
          Back to espresso machines
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 bg-[#fff9f9] px-4 py-16 text-center text-sm text-[#5b5660]">
        Loading product details…
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex-1 bg-[#fff9f9] px-4 py-16 text-center text-[#25212a]">
        <p role="status" className="text-sm">
          Product not found.
        </p>
        <Link
          href="/espresso-machines"
          className="mt-4 inline-flex text-sm font-semibold text-[#e50925]"
        >
          Back to espresso machines
        </Link>
      </main>
    );
  }

  const { product, detail } = data;
  const productName = detail?.name?.trim() || product.name;
  const imageUrls = [
    ...splitImageUrls(detail?.image_src),
    ...[...data.images]
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
      .map((image) => publicUrl(image.image_src))
      .filter((url): url is string => Boolean(url)),
    ...splitImageUrls(detail?.images_list),
    publicUrl(product.image_src),
  ].filter((url): url is string => Boolean(url));
  const gallery = [...new Set(imageUrls)].map((src) => ({
    src,
    alt: `${productName} espresso machine`,
  }));
  const selectedProductImage = gallery[selectedImage] ?? gallery[0];
  const specifications = [
    ["Model", productName],
    ["Groups", "Single group"],
    ["Boiler capacity", detail?.boiler_capacity],
    ["Dimensions", detail?.dimensions],
    ["Display", detail?.display],
    ["Power consumption", detail?.power_consumption],
    ["Power supply", detail?.power_supply],
    ["Steam wands", detail?.steam_wands],
    ["Water wand", detail?.water_wand],
    ["Weight", detail?.weight],
  ].filter((item): item is [string, string] => Boolean(displayValue(item[1])));
  const advantages = (detail?.key_advantages ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const downloads = [
    ["Download catalogue", detail?.download_catalog],
    ["Technical sheet", detail?.file_url],
  ]
    .map(([label, url]) => [label, publicUrl(url)] as const)
    .filter((item): item is readonly [string, string] => Boolean(item[1]));
  const productDescription = displayValue(detail?.description) || product.description;
  const productUrl = publicUrl(detail?.url);
  const relatedProducts = [
    {
      name: "Nettuno A2",
      brand: "Casadio",
      src: "/images/product-casadio-nettuno-a2.jpg",
    },
    {
      name: "Nettuno A3",
      brand: "Casadio",
      src: "/images/product-casadio-nettuno-a3.jpg",
    },
    {
      name: "Casadio Compact",
      brand: "Casadio",
      src: "/images/product-casadio-compact.png",
    },
    {
      name: "Altea Root",
      brand: "La Nuova Era",
      src: "/images/product-la-nuova-era-altea-root.png",
    },
    {
      name: "Anniversario",
      brand: "La Nuova Era",
      src: "/images/product-la-nuova-era-anniversario.png",
    },
    {
      name: "IRON",
      brand: "La Nuova Era",
      src: "/images/product-la-nuova-era-iron.png",
    },
  ];

  function scrollRelated(direction: -1 | 1) {
    if (!relatedRef.current) return;
    relatedRef.current.scrollBy({
      left: direction * relatedRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <main className="flex-1 bg-[#fff9f9] px-3 pb-8 text-[#25212a] sm:px-5 lg:px-7">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-[1440px] items-center gap-2 py-2 text-[11px] text-[#39313a]"
      >
        <Link href="/" aria-label="Home" className="hover:text-[#e50925]">
          <Home className="size-4" />
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/espresso-machines" className="hover:text-[#e50925]">
          Espresso Machines
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-[#e50925]">{productName}</span>
      </nav>

      <section className="mx-auto max-w-[1440px] overflow-hidden rounded-xl border border-[#f5dfe2] bg-white shadow-[0_4px_16px_rgba(70,30,35,.04)]">
        <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)_minmax(205px,.66fr)] lg:gap-4">
          <div className="grid min-w-0 grid-cols-[54px_minmax(0,1fr)] gap-2 sm:grid-cols-[68px_minmax(0,1fr)]">
            {gallery.length ? (
              <>
                <div className="flex flex-col gap-2">
                  {gallery.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-[58px] overflow-hidden rounded-lg border bg-white transition sm:h-[68px] ${
                        selectedImage === index
                          ? "border-[#D7192D] ring-1 ring-[#D7192D]"
                          : "border-[#f3dfe2] hover:border-[#D7192D]"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="68px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
                <div className="relative min-h-[230px] overflow-hidden rounded-lg border border-[#f5edef] bg-white sm:min-h-[285px] lg:min-h-[290px]">
                  <Image
                    src={selectedProductImage.src}
                    alt={selectedProductImage.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 34vw, 80vw"
                    className="object-contain p-2"
                  />
                </div>
              </>
            ) : (
              <div className="flex min-h-[230px] items-center justify-center rounded-lg bg-[#fff3f4] text-sm text-[#746b6b] sm:col-span-2 sm:min-h-[285px]">
                Product image unavailable
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-[22px] leading-tight font-extrabold tracking-tight text-[#211b35] sm:text-[26px]">
                  {productName.toUpperCase()}
                </h1>
                <p className="text-[11px] font-semibold tracking-wide text-[#6c6971] uppercase">
                  CASADIO · SINGLE GROUP ESPRESSO MACHINE
                </p>
              </div>
              <Image
                src="/images/brand-casadio.png"
                alt="Casadio"
                width={120}
                height={54}
                className="h-9 w-[86px] shrink-0 object-contain sm:h-10 sm:w-[100px]"
                sizes="100px"
              />
            </div>
            <p className="mt-1 border-t border-[#ddd9dc] pt-1 text-[10px] font-semibold">
              Available only in selected countries.
            </p>
            {productDescription ? (
              <p className="mt-2 line-clamp-4 whitespace-pre-line text-[9px] leading-[1.35] text-[#5b5660] sm:text-[10px]">
                {productDescription}
              </p>
            ) : null}

            {advantages.length ? (
              <ul className="mt-3 space-y-1.5">
                  {advantages.map((advantage) => (
                    <li
                      key={advantage}
                      className="flex gap-2 text-[9px] leading-[1.35] text-[#34303a] sm:text-[10px]"
                    >
                      <Check className="mt-px size-3 shrink-0 text-[#ed1027]" strokeWidth={3} />
                      <span>{advantage}</span>
                    </li>
                  ))}
              </ul>
            ) : null}
            {!advantages.length && productDescription ? (
              <p className="mt-3 whitespace-pre-line text-[10px] leading-[1.35] text-[#5b5660]">
                {productDescription}
              </p>
            ) : null}
          </div>

          <aside className="flex flex-col gap-2 lg:pt-8">
            <div className="rounded-xl bg-[#fff0f1] p-3">
              <h2 className="text-[12px] font-bold">Key Specifications</h2>
              <dl className="mt-2 space-y-1.5">
                {specifications.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-[9px] text-[#5b5660] sm:text-[10px]"
                  >
                    <dt>{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <button
              type="button"
              onClick={() => setIsAddedToCart(true)}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-[#ed1027] px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#c70f22]"
            >
              <ShoppingCart className="size-4" />
              {isAddedToCart ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              type="button"
              aria-pressed={isWishlisted}
              onClick={() => setIsWishlisted((current) => !current)}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#ed1027] px-4 py-2 text-[12px] font-bold text-[#e50925] transition-colors hover:bg-[#fff0f1]"
            >
              <Heart className={`size-4 ${isWishlisted ? "fill-current" : ""}`} />
              {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
            </button>
            {downloads.length ? (
              <a
                href={downloads[0][1]}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#ed1027] px-4 py-2 text-[12px] font-bold text-[#e50925] transition-colors hover:bg-[#fff0f1]"
              >
                <ArrowDownToLine className="size-4" />
                Download Catalog
              </a>
            ) : null}
            {productUrl ? (
              <a
                href={productUrl}
                target="_blank"
                rel="noreferrer"
                className="text-center text-[10px] font-semibold text-[#e50925] underline"
              >
                Manufacturer details
              </a>
            ) : null}
            {(isAddedToCart || isWishlisted) ? (
              <p role="status" className="sr-only">
                {isAddedToCart
                  ? `${productName} added to cart.`
                  : `${productName} added to wishlist.`}
              </p>
            ) : null}
          </aside>
        </div>

        <div className="border-t border-[#f4dfe2] px-3 sm:px-4">
          <div role="tablist" aria-label="Product information" className="flex gap-7">
            {([
              ["details", "Product Details"],
              ["specifications", "Specifications"],
              ["reviews", "Reviews (0)"],
            ] as const).map(([tab, label]) => (
              <button
                key={tab}
                id={`product-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="product-tab-panel"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 py-2 text-[10px] font-semibold transition-colors ${
                  activeTab === tab
                    ? "border-[#ed1027] text-[#e50925]"
                    : "border-transparent text-[#38323c] hover:text-[#e50925]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            id="product-tab-panel"
            role="tabpanel"
            aria-labelledby={`product-tab-${activeTab}`}
            className="min-h-[42px] border-t border-[#f4dfe2] py-2 text-[9px] leading-[1.35] text-[#37313a] sm:text-[10px]"
          >
            {activeTab === "details" ? (
              <p className="whitespace-pre-line">
                {productDescription ||
                  `${productName} is a commercial espresso machine from Casadio. Contact our team for model-specific details.`}
              </p>
            ) : activeTab === "specifications" ? (
              <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {specifications.map(([label, value]) => (
                  <div key={label} className="flex gap-1">
                    <dt className="font-semibold">{label}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>No reviews yet. Be the first to share your experience with {productName}.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-5 max-w-[1440px]">
        <div className="mb-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#d8d1d2]" />
          <h2 className="text-center text-[17px] font-bold text-[#39343a] sm:text-[20px]">
            Related Products
          </h2>
          <span className="h-px flex-1 bg-[#d8d1d2]" />
        </div>
        <div className="relative">
          <div
            ref={relatedRef}
            className="grid grid-flow-col auto-cols-[44%] gap-2 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:auto-cols-[30%] lg:auto-cols-[calc((100%-2.5rem)/6)]"
          >
            {relatedProducts.map((item) => (
              <Link
                key={item.name}
                href="/espresso-machines"
                className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#f1e4e6] bg-white p-2 shadow-[0_3px_10px_rgba(94,35,43,.04)] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-[112px] overflow-hidden bg-white sm:h-[125px]">
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, 40vw"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="mt-1 line-clamp-1 text-[10px] font-semibold text-[#302a31]">
                  {item.name}
                </span>
                <span className="text-[9px] text-[#6b6469]">{item.brand}</span>
                <span className="mt-1 text-[11px] tracking-[-0.1em] text-[#aeb0b1]" aria-label="No reviews">
                  ★★★★★
                </span>
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll related products left"
            onClick={() => scrollRelated(-1)}
            className="absolute top-1/2 -left-2 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8dfe1] bg-white shadow-md transition hover:text-[#e50925] sm:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll related products right"
            onClick={() => scrollRelated(1)}
            className="absolute top-1/2 -right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8dfe1] bg-white shadow-md transition hover:text-[#e50925]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
