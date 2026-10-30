import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="site-container grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="wordmark">arti<span>.</span></Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            A considered space for independent art, fresh perspectives, and the people behind the work.
          </p>
        </div>
        <div>
          <h2 className="footer-heading">Discover</h2>
          <Link className="footer-link" href="/explore">Explore artwork</Link>
          <Link className="footer-link" href="/artists">Meet the artists</Link>
          <Link className="footer-link" href="/collections">Collections</Link>
        </div>
        <div>
          <h2 className="footer-heading">For artists</h2>
          <Link className="footer-link" href="/auth/sign-up">Join the community</Link>
          <Link className="footer-link" href="/dashboard">Artist workspace</Link>
          <Link className="footer-link" href="/about#contact">Get in touch</Link>
        </div>
        <div>
          <h2 className="footer-heading">Follow along</h2>
          <span className="footer-link text-muted">Social links coming soon</span>
          <span className="mt-3 inline-flex items-center gap-2 text-xs text-muted"><Instagram size={14} /> No official accounts configured</span>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ARTI. Made for the love of art.</p>
          <div className="flex gap-4"><Link className="hover:text-ink" href="/privacy">Privacy</Link><Link className="hover:text-ink" href="/terms">Terms</Link></div>
          <p className="flex items-center gap-1">Sample artwork is for demonstration <ArrowUpRight size={12} /></p>
        </div>
      </div>
    </footer>
  );
}
