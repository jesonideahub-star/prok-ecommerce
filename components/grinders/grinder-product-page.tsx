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
  ShieldCheck,
  SlidersHorizontal,
  Timer,
  Wrench,
} from "lucide-react";
import {
  loadGrinderCatalogDetails,
  grinderProductSlug,
  loadGrinders,
  type GrinderCatalogDetails,
  type GrinderCatalogVariant,
  type GrinderProduct,
} from "@/lib/grinders";

const galleryImages = [
  { src: "/images/product-firenze-75.jpg", alt: "Firenze 75 black commercial grinder" },
  { src: "/images/hero-grinder-firenze.png", alt: "Firenze 75 grinder front view" },
  { src: "/images/product-firenze-75.png", alt: "Firenze 75 grinder product image" },
];

const specifications = [
  ["Model", "Firenze 75"],
  ["Burrs", "75 mm Flat Burrs"],
  ["Motor Power", "650 W"],
  ["Bean Hopper", "1.5 kg"],
  ["Dimensions (W x D x H)", "230 x 270 x 600 mm"],
];

const features = [
  {
    icon: Timer,
    title: "“High Speed” Grind Dispersion",
    body: "The “High Speed” label marks those grinders able to reach highly reduced dispensing time.",
  },
  {
    icon: SlidersHorizontal,
    title: "Stepless Micrometric Regulation System",
    body: "Patented by Eureka, it assures incomparable setting precision and saving of time and coffee.",
  },
  {
    icon: ShieldCheck,
    title: "ACE System",
    body: "Anti-Clumps & Electrostaticity.",
  },
  {
    icon: Wrench,
    title: "“High Speed” Maintenance",
    body: "Handy and easy maintenance operations.",
  },
  {
    icon: Check,
    title: "All-Purpose Adjustable “Hands-Free” Fork",
    body: "Useful, robust and easy to regulate.",
  },
];

const productDetails = [
  "Touch screen (3 doses + continuous)",
  "Maintenance alert customised for burrs type",
  "Possibility to activate or deactivate the dose Pre-Selection",
  "Three different grinding activation modes: only microswitch, touch screen, or both microswitch and touch screen",
  "Total Control System available, allowing the user to set a password to manage and protect the advanced settings",
];

const relatedProducts = [
  {
    name: "Iron",
    brand: "La Nuova Era",
    src: "/images/product-la-nuova-era-iron.png",
    href: "/espresso-machines",
  },
  {
    name: "Altea Root",
    brand: "La Nuova Era",
    src: "/images/product-la-nuova-era-altea-root.png",
    href: "/espresso-machines",
  },
  {
    name: "Anniversario",
    brand: "La Nuova Era",
    src: "/images/product-la-nuova-era-anniversario.png",
    href: "/espresso-machines",
  },
  {
    name: "Firenze 85",
    brand: "Eureka",
    src: "/images/product-firenze-85.jpg",
    href: "/grinders",
  },
  {
    name: "Helios 75",
    brand: "Eureka",
    src: "/images/product-helios-75.jpg",
    href: "/grinders",
  },
  {
    name: "Eureka Mignon Bravo",
    brand: "Eureka",
    src: "/images/product-eureka-bravo.png",
    href: "/grinders",
  },
];

type ProductTab = "details" | "specifications" | "reviews";
type ProductDetails = GrinderProduct & { catalogDetails: GrinderCatalogDetails | null };

function technicalSpecificationRows(description: string | null | undefined) {
  if (!description) return [];
  const lines = description.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === "Technical Specifications");
  if (headingIndex < 0) return [];
  const section = lines.slice(headingIndex + 1);
  const firstBlankLine = section.findIndex((line) => line.trim() === "");

  return section
    .slice(0, firstBlankLine < 0 ? undefined : firstBlankLine)
    .flatMap((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex < 0) return [];
      return [[line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()]];
    });
}

export function GrinderProductPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
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
        setLoadError(false);
        setIsLoading(true);
        const products = await loadGrinders();
        const match = products.find((item) => grinderProductSlug(item) === slug);
        if (match) {
          const catalogDetails = await loadGrinderCatalogDetails(match.name);
          if (active) setProduct({ ...match, catalogDetails });
        } else if (active) {
          setProduct(null);
        }
      } catch (error) {
        console.error("Unable to load the selected grinder product.", error);
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
        <Link href="/grinders" className="mt-4 inline-flex text-sm font-semibold text-[#e50925]">
          Back to grinders
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

  if (!product) {
    return (
      <main className="flex-1 bg-[#fff9f9] px-4 py-16 text-center text-[#25212a]">
        <p role="status" className="text-sm">Product not found.</p>
        <Link href="/grinders" className="mt-4 inline-flex text-sm font-semibold text-[#e50925]">
          Back to grinders
        </Link>
      </main>
    );
  }

  const isFirenze75 = product.name.toLowerCase() === "firenze 75";
  const catalogImages = product.catalogDetails?.images ?? [];
  const productImages = catalogImages.length
    ? catalogImages.map((image) => ({
        src: image.image_src,
        alt: image.alt || `${product.name} coffee grinder`,
      }))
    : isFirenze75
      ? galleryImages
      : [{ src: product.src, alt: `${product.name} coffee grinder` }];
  const selectedProductImage = productImages[selectedImage] ?? productImages[0];
  const catalogSpecifications = technicalSpecificationRows(product.catalogDetails?.description);
  const productSpecifications = isFirenze75
    ? specifications
    : [
        ["Model", product.name],
        ["Brand", product.brand],
        [
          "Series",
          product.series === "manual"
            ? "Manual Grinder"
            : product.series === "mignon"
              ? "Mignon Series"
              : "Commercial Series",
        ],
        ["Category", "Coffee Grinder"],
        ...catalogSpecifications,
      ];
  const variantGroups = (product.catalogDetails?.variants ?? []).reduce<
    { label: string; variants: GrinderCatalogVariant[] }[]
  >((groups, variant) => {
    const label = variant.option_label || "Available";
    const group = groups.find((item) => item.label === label);
    if (group) {
      group.variants.push(variant);
    } else {
      groups.push({ label, variants: [variant] });
    }
    return groups;
  }, []);

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
          <Home className="size-3.5" />
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/grinders" className="hover:text-[#e50925]">
          Grinders
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-[#e50925]">{product.name}</span>
      </nav>

      <section className="mx-auto max-w-[1440px] overflow-hidden rounded-xl border border-[#f5dfe2] bg-white shadow-[0_4px_16px_rgba(70,30,35,.04)]">
        <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)_minmax(205px,.66fr)] lg:gap-4">
          <div className="grid min-w-0 grid-cols-[54px_minmax(0,1fr)] gap-2 sm:grid-cols-[68px_minmax(0,1fr)]">
            <div className="flex flex-col gap-2">
              {productImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-[58px] overflow-hidden rounded-lg border bg-white transition sm:h-[68px] ${
                    selectedImage === index
                      ? "border-[#ed1027] ring-1 ring-[#ed1027]"
                      : "border-[#f3dfe2] hover:border-[#ed1027]"
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
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[22px] leading-tight font-extrabold tracking-tight text-[#211b35] sm:text-[26px]">
                  {product.name.toUpperCase()}
                </h1>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6c6971]">
                  {product.brand.replace(" 1920", "")} · Coffee Grinders
                </p>
                <p className="mt-1 border-t border-[#ddd9dc] pt-1 text-[10px] font-semibold">
                  Available only in selected countries.
                </p>
              </div>
              {product.brand.toLowerCase().includes("eureka") ? (
              <div className="flex shrink-0 items-center gap-1.5 text-[#e50925]">
                <Image
                  src="/images/brand-eureka-official.png"
                  alt=""
                  width={782}
                  height={768}
                  className="size-8 object-contain sm:size-10"
                  sizes="40px"
                />
                <span>
                  <span className="block text-[15px] leading-none font-extrabold sm:text-[17px]">
                    EUREKA
                  </span>
                  <span className="block text-[5px] leading-tight font-bold sm:text-[6px]">
                    YOUR COFFEE OUR PASSION
                  </span>
                </span>
              </div>
              ) : (
                <span className="shrink-0 text-[11px] font-bold uppercase text-[#e50925]">
                  {product.brand}
                </span>
              )}
            </div>

            {isFirenze75 ? (
            <ul className="mt-2 space-y-1.5">
              {features.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[#e5dfe2] text-[#282538]">
                    <Icon className="size-3" />
                  </span>
                  <span className="text-[9px] leading-[1.3] text-[#34303a] sm:text-[10px]">
                    <strong className="block font-bold">{title}</strong>
                    {body}
                  </span>
                </li>
              ))}
            </ul>
            ) : (
              <p className="mt-3 text-[10px] leading-relaxed text-[#5b5660]">
                Product details and configuration may vary by model. Contact our team for
                specific technical information about the {product.name}.
              </p>
            )}

            {isFirenze75 ? <ul className="mt-2 space-y-1">
              {productDetails.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-2 text-[9px] leading-[1.3] text-[#34303a] sm:text-[10px]"
                >
                  <Check className="mt-px size-3 shrink-0 text-[#ed1027]" strokeWidth={3} />
                  <span>{detail}</span>
                </li>
              ))}
            </ul> : null}
          </div>

          <aside className="flex flex-col gap-2 lg:pt-8">
            <div className="rounded-xl bg-[#fff0f1] p-3">
              <h2 className="text-[12px] font-bold">Key Specifications</h2>
              <dl className="mt-2 space-y-1.5">
                {productSpecifications.map(([label, value]) => (
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
            {variantGroups.length ? (
              <div className="rounded-xl border border-[#f5dfe2] bg-white p-3">
                <h2 className="text-[12px] font-bold">Available Colours</h2>
                <div className="mt-2 space-y-2">
                  {variantGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-semibold text-[#5b5660]">{group.label}</p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {group.variants?.map((variant) => (
                          <li
                            key={variant.name}
                            className="rounded-full border border-[#f1d5da] bg-[#fff9f9] px-2 py-1 text-[9px] text-[#39313a]"
                          >
                            {variant.color || variant.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
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
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#ed1027] px-4 py-2 text-[12px] font-bold text-[#e50925] transition-colors hover:bg-[#fff0f1]"
            >
              <ArrowDownToLine className="size-4" />
              Download Catalog
            </button>
            {(isAddedToCart || isWishlisted) && (
              <p role="status" className="sr-only">
                {isAddedToCart
                  ? `${product.name} added to cart.`
                  : `${product.name} added to wishlist.`}
              </p>
            )}
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
            {activeTab === "details" && product.catalogDetails?.description ? (
              <p className="whitespace-pre-line">{product.catalogDetails.description}</p>
            ) : activeTab === "details" && isFirenze75 ? (
              <>
                <p>
                  The Firenze 75 combines advanced technology, precision and elegant design,
                  making it the ideal grinder for professional baristas.
                </p>
                <p>
                  With its high-speed dispersion and user-friendly features, it delivers
                  consistent performance and exceptional coffee quality.
                </p>
              </>
            ) : activeTab === "details" ? (
              <p>
                {product.name} is part of the {product.brand} {product.series} grinder
                collection. Contact our team for model-specific details.
              </p>
            ) : activeTab === "specifications" ? (
              isFirenze75 ? (
                <p>
                  75 mm flat burrs · 650 W motor · 1.5 kg bean hopper · 230 x 270 x 600 mm.
                </p>
              ) : catalogSpecifications.length ? (
                <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  {catalogSpecifications.map(([label, value]) => (
                    <div key={label} className="flex gap-1">
                      <dt className="font-semibold">{label}:</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>Contact our team for model-specific technical specifications.</p>
              )
            ) : (
              <p>No reviews yet. Be the first to share your experience with the Firenze 75.</p>
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
                href={item.href}
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