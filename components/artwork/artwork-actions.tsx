"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ArtworkActions({ title, price }: { title: string; price?: number }) {
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Artwork link copied");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Could not share this artwork", { description: error.message });
      }
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {price ? (
        <Button variant="accent" size="lg" onClick={() => toast.info("Sample listing only", { description: "Checkout and payment are not enabled in this demo." })}>
          ${price.toLocaleString("en-US")} <span className="text-xs font-normal text-white/75">sample price</span>
        </Button>
      ) : <span className="text-sm text-muted">Price not provided</span>}
      <Button variant="outline" size="lg" onClick={share}><Share2 size={16} /> Share</Button>
    </div>
  );
}
