"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow, Search, SlidersHorizontal, X } from "lucide-react";
import { artworks, categories } from "@/lib/artworks";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { Button } from "@/components/ui/button";

const mediums = ["All mediums", "Oil on linen", "Archival pigment print", "Digital collage, archival print", "Acrylic and graphite", "Hand-built ceramic"];

export function ExploreGrid() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All art");
  const [medium, setMedium] = useState("All mediums");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Curated");
  const [visibleCount, setVisibleCount] = useState(6);

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = artworks.filter((artwork) => {
      const matchesSearch = !search || [artwork.title, artwork.artist, artwork.category, artwork.medium].some((value) => value.toLowerCase().includes(search));
      const matchesCategory = category === "All art" || artwork.category === category;
      const matchesMedium = medium === "All mediums" || artwork.medium === medium;
      const matchesPrice = price === "Any price" || (price === "Under $500" ? !artwork.price || artwork.price < 500 : Boolean(artwork.price && artwork.price >= 500));
      return matchesSearch && matchesCategory && matchesMedium && matchesPrice;
    });
    if (sort === "Title A–Z") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "Newest") filtered.sort((a, b) => b.year - a.year);
    return filtered;
  }, [category, medium, price, query, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("All art");
    setMedium("All mediums");
    setPrice("Any price");
    setSort("Curated");
  }

  return (
    <div className="site-container pb-20">
      <div className="border-y border-line py-6">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="flex items-center gap-3 border-b border-line pb-4">
          <Search size={20} className="text-muted" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(6); }} placeholder="Search artwork, artists, or a medium..." aria-label="Search artworks and artists" className="w-full bg-transparent text-base outline-none placeholder:text-muted sm:text-lg" />
          {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={17} /></button>}
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={15} className="mr-1 text-muted" />
          <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)} className="filter-select">
            <option>All art</option>
            {categories.map((item) => <option key={item.name}>{item.name}</option>)}
          </select>
          <select aria-label="Filter by medium" value={medium} onChange={(event) => setMedium(event.target.value)} className="filter-select">
            {mediums.map((item) => <option key={item}>{item}</option>)}
            {!mediums.includes(medium) && <option>{medium}</option>}
          </select>
          <select aria-label="Filter by price" value={price} onChange={(event) => setPrice(event.target.value)} className="filter-select">
            {["Any price", "Under $500", "$500 and up"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <span className="hidden flex-1 sm:block" />
          <ArrowDownWideNarrow size={15} className="ml-1 text-muted" />
          <select aria-label="Sort artworks" value={sort} onChange={(event) => setSort(event.target.value)} className="filter-select">
            {["Curated", "Newest", "Title A–Z"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between py-6">
        <p className="text-sm text-muted" aria-live="polite"><span className="font-medium text-ink">{results.length}</span> sample {results.length === 1 ? "work" : "works"}</p>
        {(query || category !== "All art" || medium !== "All mediums" || price !== "Any price") && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters <X size={14} /></Button>}
      </div>

      {results.length ? (
        <>
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visibleCount).map((artwork, index) => <ArtworkCard key={artwork.slug} artwork={artwork} index={index} />)}
          </div>
          {visibleCount < results.length && <div className="mt-12 flex justify-center"><Button variant="outline" radius="full" onClick={() => setVisibleCount((count) => count + 6)}>Load more works</Button></div>}
        </>
      ) : (
        <div className="border border-dashed border-line py-20 text-center">
          <p className="display-serif text-3xl">Nothing in this frame.</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">Try another search or clear the filters to find something new.</p>
          <Button variant="outline" radius="full" className="mt-6" onClick={clearFilters}>Clear filters</Button>
        </div>
      )}
    </div>
  );
}
