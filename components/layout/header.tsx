"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Discover", href: "/" },
  { label: "Explore art", href: "/explore" },
  { label: "Artists", href: "/artists" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur-md">
        <div className="site-container flex h-[76px] items-center justify-between gap-6">
          <Link href="/" className="wordmark" aria-label="ARTI home">
            arti<span>.</span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </Button>
            <Link href="/auth/sign-in" className="nav-link px-3 py-2">
              Sign in
            </Link>
            <Link href="/auth/sign-up" className={cn(buttonVariants({ variant: "accent", radius: "full", size: "sm" }))}>
              Join ARTI <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line bg-paper px-6 pb-6 pt-3 sm:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-b border-line py-3 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-3">
              <Link href="/auth/sign-in" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>Sign in</Link>
              <Link href="/auth/sign-up" className={cn(buttonVariants({ variant: "accent" }), "flex-1")}>Join ARTI</Link>
            </div>
          </nav>
        )}
      </header>
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 px-4 pt-[15vh]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false);
          }}
        >
          <form
            onSubmit={search}
            className="w-full max-w-2xl border border-line bg-paper p-4 shadow-xl sm:p-6"
            role="search"
          >
            <div className="flex items-center gap-3">
              <Search className="shrink-0 text-muted" size={20} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search art, artists, or categories..."
                aria-label="Search art, artists, or categories"
                className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted"
              />
              <Button type="button" variant="ghost" size="icon" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted">Press Enter to explore matching works and artists.</p>
          </form>
        </div>
      )}
    </>
  );
}
