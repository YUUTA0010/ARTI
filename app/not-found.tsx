import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="site-container flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <p className="section-kicker">Not in this collection</p>
      <h1 className="display-serif mt-3 text-5xl">This page is a blank canvas.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">The link may have changed, or this piece may not be here yet.</p>
      <Link href="/" className={cn(buttonVariants({ variant: "accent" }), "mt-7 rounded-full")}><ArrowLeft size={15} /> Back to discover</Link>
    </section>
  );
}
