"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import type { Artwork } from "@/lib/artworks";

export function ArtworkCard({ artwork, index = 0 }: { artwork: Artwork; index?: number }) {
  const [favorite, setFavorite] = useState(false);

  function toggleFavorite() {
    setFavorite((current) => !current);
    toast.info("Demo favorite", {
      description: "Favorites are saved in this browser demo only. Sign-in is required for account sync.",
    });
  }

  return (
    <article className="artwork-card group">
      <div className="relative overflow-hidden bg-[#e7e5df]" style={{ aspectRatio: index % 3 === 1 ? "4 / 5" : "1 / 1" }}>
        <Link href={`/artwork/${artwork.slug}`} aria-label={`View ${artwork.title} by ${artwork.artist}`}>
          <Image
            src={artwork.image}
            alt={`${artwork.title}, ${artwork.category.toLowerCase()} by ${artwork.artist}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="image-zoom object-cover"
          />
        </Link>
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={favorite ? `Remove ${artwork.title} from favorites` : `Add ${artwork.title} to favorites`}
          aria-pressed={favorite}
          className="focus-ring absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition hover:bg-white"
        >
          <Heart size={17} className={favorite ? "fill-blue text-blue" : ""} />
        </button>
        <span className="absolute bottom-3 left-3 bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
          {artwork.category}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 pt-3">
        <div className="min-w-0">
          <Link href={`/artwork/${artwork.slug}`} className="text-sm font-medium hover:text-blue">
            {artwork.title}
          </Link>
          <Link href={`/artists/${artwork.artistSlug}`} className="mt-1 block text-xs text-muted hover:text-ink">
            {artwork.artist}
          </Link>
        </div>
        {artwork.price ? <span className="shrink-0 pt-0.5 text-xs text-muted">{formatPrice(artwork.price)}</span> : null}
      </div>
    </article>
  );
}
