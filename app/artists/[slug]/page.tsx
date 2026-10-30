import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { artists, artworks } from "@/lib/artworks";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = artists.find((item) => item.slug === slug);
  return artist ? { title: artist.name, description: `${artist.bio} Sample artist profile on ARTI.` } : { title: "Artist not found" };
}

export function generateStaticParams() {
  return artists.map(({ slug }) => ({ slug }));
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
  const artist = artists.find((item) => item.slug === slug);
  if (!artist) notFound();
  const portfolio = artworks.filter((work) => work.artistSlug === artist.slug);

  return (
    <>
      <section className="site-container py-8">
        <Link href="/artists" className="inline-flex items-center gap-2 text-xs text-muted hover:text-ink"><ArrowLeft size={14} /> All artists</Link>
        <div className="relative mt-6 h-44 overflow-hidden bg-[#e6e5df] sm:h-64">
          <Image src={portfolio[0]?.image ?? artist.image} alt="" fill unoptimized sizes="100vw" className="object-cover opacity-75" />
          <div className="absolute inset-0 bg-ink/15" />
          <span className="absolute bottom-4 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">ARTI / ARTIST FILES</span>
        </div>
        <div className="relative -mt-12 ml-5 flex flex-col gap-5 sm:ml-10 sm:flex-row sm:items-end">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-paper bg-[#e6e5df] sm:h-36 sm:w-36">
            <Image src={artist.image} alt={`${artist.name}, artist`} fill unoptimized sizes="144px" className="object-cover" />
          </div>
          <div className="pb-1">
            <p className="section-kicker">Sample artist profile</p>
            <h1 className="display-serif mt-1 text-4xl sm:text-5xl">{artist.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><MapPin size={13} />{artist.location}</p>
          </div>
          <Link href="/about#contact" className="mb-1 inline-flex items-center gap-2 border border-line px-4 py-2.5 text-xs hover:border-blue sm:ml-auto">Send an inquiry <ArrowUpRight size={14} /></Link>
        </div>
        <div className="grid gap-8 border-b border-line py-9 md:grid-cols-[1fr_2fr]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue">{artist.medium}</p>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-muted">{artist.bio}</p>
            <div className="mt-5 flex gap-6 text-xs text-muted">
              <span>{portfolio.length} sample works</span>
              <span>Member data is illustrative</span>
            </div>
          </div>
        </div>
      </section>
      <section className="site-container pb-20 pt-10">
        <div className="mb-7 flex items-end justify-between">
          <div><p className="section-kicker">Selected work</p><h2 className="display-serif mt-2 text-4xl">The portfolio</h2></div>
          <span className="text-xs text-muted">{portfolio.length} works</span>
        </div>
        {portfolio.length ? <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{portfolio.map((item, index) => <ArtworkCard key={item.slug} artwork={item} index={index} />)}</div> : <p className="border border-line p-10 text-center text-sm text-muted">This artist hasn’t published work yet.</p>}
      </section>
    </>
  );
}
