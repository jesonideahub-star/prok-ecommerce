import { brandSlug, grinders } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

type SeriesKey = "mignon" | "commercial" | "manual";
type GrinderType = "on-demand" | "traditional" | "automatic";

export type GrinderProduct = {
  name: string;
  brand: string;
  series: SeriesKey;
  type: GrinderType;
  uses: readonly string[];
  src: string;
  detail?: string;
  imageName?: string;
};

export type GrinderCatalogImage = {
  image_src: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
};

export type GrinderCatalogVariant = {
  name: string;
  color: string | null;
  option_label: string | null;
  price: number | null;
  stock: number;
  image_src: string | null;
  sort_order: number;
};

export type GrinderCatalogDetails = {
  description: string | null;
  images: GrinderCatalogImage[];
  variants: GrinderCatalogVariant[];
};

export const grinderBucket = "Grinders";
const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;

function normalizeFilename(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/^product-/i, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function grinderDisplayName(filename: string) {
  return filename
    .replace(imageExtensions, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function grinderProductName(filename: string) {
  const name = grinderDisplayName(filename)
    .replace(/\s+(?:front(?:\s+(?:left|right))?|back(?:\s+(?:left|right))?|left|right|side|detail|fr|lat\s+(?:dx|sx)|trequa)$/i, "")
    .trim();

  return /^atom w 65$/i.test(name) ? "Atom Touch 65" : name;
}

function grinderImagePriority(filename?: string) {
  if (!filename) return 1;
  const name = grinderDisplayName(filename);
  if (/\bfront(?:\s+(?:left|right))?\b/i.test(name) || /\bfr$/i.test(name)) return 0;
  if (/\b(?:back|left|right|side|detail|lat\s+(?:dx|sx)|trequa)$/i.test(name)) return 2;
  return 1;
}

const knownGrinders = new Map(
  grinders.map((item) => [normalizeFilename(item.src.split("/").at(-1) ?? ""), item])
);

function grinderBrand(folder?: string) {
  if (!folder) return "Other";
  if (/^eureka grinder$/i.test(folder.trim())) return "Eureka 1920";
  if (/^casadio grinder$/i.test(folder.trim())) return "Casadio";
  return folder
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function grinderSeries(filename: string): SeriesKey {
  if (/baby\s+grinder/i.test(filename)) return "manual";
  return /mignon|libra|silenzio/i.test(filename) ? "mignon" : "commercial";
}

function grinderType(filename: string): GrinderType {
  if (/baby\s+grinder/i.test(filename)) return "traditional";
  if (/automatic|auto/i.test(filename)) return "automatic";
  if (/traditional|manual/i.test(filename)) return "traditional";
  return "on-demand";
}

function groupGrinderImages(products: GrinderProduct[]) {
  const grouped = new Map<string, GrinderProduct>();

  for (const product of products) {
    const name = product.name || grinderProductName(product.imageName ?? "");
    const key = `${normalizeFilename(product.brand)}:${normalizeFilename(name)}`;
    const existing = grouped.get(key);

    if (
      !existing ||
      grinderImagePriority(product.imageName) < grinderImagePriority(existing.imageName)
    ) {
      grouped.set(key, { ...product, name });
    }
  }

  return [...grouped.values()];
}

export async function loadGrinders(): Promise<GrinderProduct[]> {
  const supabase = createClient();
  const bucket = supabase.storage.from(grinderBucket);

  async function listDirectory(path: string) {
    const entries = [];
    const limit = 1000;

    for (let offset = 0; ; offset += limit) {
      const { data, error } = await bucket.list(path, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) throw error;
      entries.push(...(data ?? []));
      if (!data || data.length < limit) break;
    }

    return entries;
  }

  async function walk(path: string, parentBrand?: string): Promise<GrinderProduct[]> {
    const entries = await listDirectory(path);
    const products: GrinderProduct[] = [];

    for (const entry of entries) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.id === null) {
        products.push(...(await walk(entryPath, parentBrand ?? entry.name)));
        continue;
      }

      if (!imageExtensions.test(entry.name)) continue;

      const normalizedName = normalizeFilename(entry.name);
      const knownProduct =
        knownGrinders.get(normalizedName) ??
        [...knownGrinders.entries()].find(([filename]) =>
          normalizedName.endsWith(filename)
        )?.[1];
      const series = knownProduct?.series ?? grinderSeries(entry.name);
      products.push({
        name: knownProduct?.name ?? grinderProductName(entry.name),
        brand: knownProduct?.brand ?? grinderBrand(parentBrand),
        series,
        type: grinderType(entry.name),
        uses:
          knownProduct?.uses ??
          (series === "mignon"
            ? ["home", "office", "cafe"]
            : series === "manual"
              ? ["home", "office"]
              : ["cafe", "restaurant", "hotel", "office"]),
        src: bucket.getPublicUrl(entryPath).data.publicUrl,
        detail: knownProduct && "detail" in knownProduct ? knownProduct.detail : undefined,
        imageName: entry.name,
      });
    }

    return products;
  }

  return groupGrinderImages(await walk("")).sort(
    (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );
}

export function grinderProductSlug(product: Pick<GrinderProduct, "brand" | "name">) {
  return `${brandSlug(product.brand)}-${brandSlug(product.name)}`;
}

export async function loadGrinderCatalogDetails(
  productName: string
): Promise<GrinderCatalogDetails | null> {
  const supabase = createClient();
  const { data: catalogProduct, error: productError } = await supabase
    .from("products")
    .select("id, description")
    .eq("slug", brandSlug(productName))
    .eq("category", "grinder")
    .maybeSingle();

  if (productError) throw productError;
  if (!catalogProduct) return null;

  const [imagesResult, variantsResult] = await Promise.all([
    supabase
      .from("product_images")
      .select("image_src, alt, is_primary, sort_order")
      .eq("product_id", catalogProduct.id)
      .order("sort_order"),
    supabase
      .from("product_variants")
      .select("name, color, option_label, price, stock, image_src, sort_order")
      .eq("product_id", catalogProduct.id)
      .order("sort_order"),
  ]);

  if (imagesResult.error) throw imagesResult.error;
  if (variantsResult.error) throw variantsResult.error;

  return {
    description: catalogProduct.description,
    images: imagesResult.data ?? [],
    variants: variantsResult.data ?? [],
  };
}

export function grinderDetail(item: GrinderProduct) {
  if (item.detail) return item.detail;
  if (item.series === "manual") return "Manual Grinder";
  return item.series === "mignon" ? "Mignon Series" : "Commercial Series";
}
