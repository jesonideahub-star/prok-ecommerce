"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import { mediaUrl } from "@/lib/supabase/media";

function localSrc(src: string) {
  if (/^(https?:|data:|blob:)/i.test(src)) return null;
  return src.startsWith("/") ? src : `/${src}`;
}

export default function MediaImage({ src, onError, ...props }: ImageProps) {
  const remote = typeof src === "string" ? mediaUrl(src) : src;
  const local = typeof src === "string" ? localSrc(src) : null;
  const initial = local ?? remote;
  const [current, setCurrent] = useState(initial);

  return (
    <Image
      src={current}
      {...props}
      onError={(event) => {
        onError?.(event);
        if (typeof remote === "string" && current !== remote) {
          setCurrent(remote);
        }
      }}
    />
  );
}
