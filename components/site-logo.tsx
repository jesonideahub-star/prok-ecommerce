import Image from "@/components/media-image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
}: {
  className?: string;
}) {
  return (
    <Link href="/" className={cn("flex min-w-0 items-center", className)}>
      <Image
        src="/images/prokrate-international-logo.png"
        alt="Prokrate International Trading Corporation"
        width={2657}
        height={768}
        unoptimized
        priority
        className="h-11 w-auto object-contain sm:h-12"
      />
    </Link>
  );
}
