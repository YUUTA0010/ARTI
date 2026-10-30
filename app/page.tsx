import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { buttonVariants } from "@/components/ui/button";
import { artists, artworks, categories, collections } from "@/lib/artworks";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="featured" className="bg-[#efeee9] py-16 sm:py-20">
        <div className="site-container">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">A good place to begin</p>
              <h2 className="display-serif mt-2 text-4xl sm:text-5xl">Works worth a closer look</h2>
            </div>
            <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-medium hover:text-blue">
              Explore all art <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mb-7 text-xs text-muted">Curated sample works — not submitted by real ARTI members.</p>
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.filter((artwork) => artwork.featured).map((artwork, index) => (
              <ArtworkCard key={artwork.slug} artwork={artwork} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Find your point of view</p>
            <h2 className="display-serif mt-2 text-4xl sm:text-5xl">Explore by category</h2>
          </div>
          <Link href="/explore" className="hidden items-center gap-2 text-sm hover:text-blue sm:inline-flex">
            All categories <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category, index) => (
            <Link href={`/explore?category=${encodeURIComponent(category.name)}`} key={category.name} className="category-tile group">
              <Image src={category.image} alt="" fill unoptimized sizes="(max-width: 640px) 45vw, 22vw" className="image-zoom object-cover" />
              <span className="category-shade" />
              <span className="relative z-10">
                <span className="block text-sm font-semibold sm:text-base">{category.name}</span>
                <span className="mt-1 block text-xs text-white/75">{category.count} works</span>
              </span>
              <span className="category-number">0{index + 1}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#efeee9] py-16 sm:py-20">
        <div className="site-container">
          <div className="mb-9 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Good work, good people</p>
              <h2 className="display-serif mt-2 text-4xl sm:text-5xl">Meet the artists</h2>
            </div>
            <Link href="/artists" className="inline-flex items-center gap-2 text-sm hover:text-blue">
              All artists <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mb-7 text-xs text-muted">Artist profiles below are fictional examples for the demo.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {artists.map((artist) => (
              <article key={artist.slug} className="artist-tile">
                <Link href={`/artists/${artist.slug}`} className="artist-photo">
                  <Image src={artist.image} alt={`${artist.name}, artist`} fill unoptimized sizes="(max-width: 640px) 90vw, 24vw" className="object-cover" />
                </Link>
                <div className="pt-4">
                  <Link href={`/artists/${artist.slug}`} className="font-medium hover:text-blue">{artist.name}</Link>
                  <p className="mt-1 text-xs text-muted">{artist.location}</p>
                  <p className="mt-3 text-xs leading-5 text-muted">{artist.medium}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-muted">{artist.works} sample works</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">A point of view, in many pieces</p>
            <h2 className="display-serif mt-2 text-4xl sm:text-5xl">Curated for the curious</h2>
          </div>
          <Link href="/collections" className="inline-flex items-center gap-2 text-sm hover:text-blue">
            Browse collections <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {collections.slice(0, 4).map((collection, index) => (
            <Link key={collection.slug} href={`/collections#${collection.slug}`} className={cn("collection-tile", index === 1 && "md:translate-y-8")}>
              <Image src={collection.image} alt="" fill unoptimized sizes="(max-width: 768px) 90vw, 48vw" className="image-zoom object-cover" />
              <span className="collection-shade" />
              <span className="collection-copy">
                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/80">{collection.label}</span>
                <span className="display-serif mt-2 block text-3xl text-white">{collection.title}</span>
                <span className="mt-2 block max-w-sm text-xs leading-5 text-white/80">{collection.description}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-xs text-white">{collection.count} works <ArrowUpRight size={14} /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-blue py-16 text-white sm:py-20">
        <div className="site-container flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70"><Sparkles size={14} /> For the makers</p>
            <h2 className="display-serif text-5xl leading-[0.98] sm:text-7xl">Your art belongs here.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80">Create your profile, showcase your work, and let the right people discover what you create.</p>
          </div>
          <Link href="/auth/sign-up" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-fit rounded-full border-white text-white hover:bg-white hover:text-blue")}>
            Start your artist journey <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="site-container py-14">
        <div className="flex flex-col items-start justify-between gap-5 border-y border-line py-8 sm:flex-row sm:items-center">
          <div>
            <p className="section-kicker">A note on the demo</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Artwork and artist profiles are illustrative sample content. ARTI is being built as a community platform; member accounts and uploads require Supabase configuration.</p>
          </div>
          <Link href="/about" className={cn(buttonVariants({ variant: "ghost" }))}>How ARTI works <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </>
  );
}
