import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { buttonVariants } from "@/components/ui/button";
import { ArtworkActions } from "@/components/artwork/artwork-actions";
import { artworks } from "@/lib/artworks";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = artworks.find((item) => item.slug === slug);
  return artwork
    ? { title: artwork.title, description: `${artwork.title} by ${artwork.artist} — sample artwork on ARTI.` }
    : { title: "Artwork not found" };
}

export function generateStaticParams() {
  return artworks.map(({ slug }) => ({ slug }));
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = artworks.find((item) => item.slug === slug);
  if (!artwork) notFound();

  const related = artworks.filter((item) => item.slug !== artwork.slug && (item.category === artwork.category || item.artistSlug === artwork.artistSlug)).slice(0, 3);

  return (
    <>
      <div className="site-container pt-7">
        <Link href="/explore" className="inline-flex items-center gap-2 text-xs text-muted hover:text-ink"><ArrowLeft size={14} /> Back to explore</Link>
      </div>
      <section className="site-container grid gap-10 py-8 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-12">
        <div className="relative min-h-[420px] overflow-hidden bg-[#e7e5df] sm:min-h-[600px]">
          <Image src={artwork.image} alt={`${artwork.title}, artwork by ${artwork.artist}`} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 bg-paper/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]">Sample artwork</span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="section-kicker">{artwork.category} <span className="mx-2 text-line">/</span> {artwork.year}</p>
          <h1 className="display-serif mt-3 text-5xl leading-[1.02] sm:text-6xl">{artwork.title}</h1>
          <Link href={`/artists/${artwork.artistSlug}`} className="mt-5 inline-flex w-fit items-center gap-3 text-sm hover:text-blue">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e7e1] text-xs font-semibold">{artwork.artist.split(" ").map((part) => part[0]).join("")}</span>
            <span>By <strong className="font-medium">{artwork.artist}</strong></span>
            <ArrowUpRight size={14} />
          </Link>
          <p className="mt-8 max-w-xl text-sm leading-7 text-muted">{artwork.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
            <div><dt className="text-xs text-muted">Medium</dt><dd className="mt-1">{artwork.medium}</dd></div>
            <div><dt className="text-xs text-muted">Dimensions</dt><dd className="mt-1">{artwork.dimensions}</dd></div>
            <div><dt className="text-xs text-muted">Year</dt><dd className="mt-1">{artwork.year}</dd></div>
            <div><dt className="text-xs text-muted">Availability</dt><dd className="mt-1">{artwork.price ? "Sample listing" : "Not listed for sale"}</dd></div>
          </dl>
          <ArtworkActions title={artwork.title} price={artwork.price} />
          <p className="mt-3 text-xs leading-5 text-muted">Sample listing only. No purchase or payment is available in this demo.</p>
          <Link href={`/artists/${artwork.artistSlug}`} className={cn(buttonVariants({ variant: "link" }), "mt-7 w-fit px-0")}>Meet {artwork.artist} <ArrowUpRight size={15} /></Link>
        </div>
      </section>
      {related.length > 0 && (
        <section className="bg-[#efeee9] py-14 sm:py-18">
          <div className="site-container">
            <p className="section-kicker">Follow the feeling</p>
            <h2 className="display-serif mb-8 mt-2 text-4xl">You might also like</h2>
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <ArtworkCard key={item.slug} artwork={item} index={index} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
