"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const collage = [
  { src: "photo-1541961017774-22349e4a1262", alt: "Expressive painting in deep blue", className: "hero-image-one" },
  { src: "photo-1549490349-8643362247b5", alt: "Abstract artwork with warm colors", className: "hero-image-two" },
  { src: "photo-1579783902614-a3fb3927b6a5", alt: "Modern art detail with muted colors", className: "hero-image-three" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="site-container grid items-center gap-12 pb-16 pt-12 md:min-h-[610px] md:grid-cols-[0.92fr_1.08fr] md:gap-8 md:pb-20 md:pt-14">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10"
      >
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue">
          A home for independent art
        </p>
        <h1 className="display-serif max-w-[650px] text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.91]">
          Art deserves to be <span className="italic text-blue">discovered.</span>
        </h1>
        <p className="mt-6 max-w-[460px] text-sm leading-7 text-muted sm:text-base">
          Discover extraordinary work from independent artists. Explore new perspectives, find your next favorite creator, and give art a place in your everyday life.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link className={cn(buttonVariants({ variant: "accent", size: "lg" }), "rounded-full")} href="/explore">
            Explore artwork <ArrowUpRight size={17} />
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline", size: "lg", radius: "full" }))} href="/auth/sign-up">
            Join as an artist
          </Link>
        </div>
        <a href="#featured" className="mt-12 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted hover:text-blue">
          Scroll to discover <ArrowDown size={14} />
        </a>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.12 }}
        className="hero-collage"
        aria-label="A collage of sample artwork"
      >
        {collage.map((item, index) => (
          <div className={cn("hero-image", item.className)} key={item.src}>
            <Image
              src={`https://images.unsplash.com/${item.src}?auto=format&fit=crop&w=1000&q=85`}
              alt={item.alt}
              fill
              priority={index === 0}
              unoptimized
              sizes="(max-width: 768px) 45vw, 28vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="hero-stamp"><span>ARTI</span><span>ISSUE Nº 01</span><span>OPEN EDITION</span></div>
        <p className="hero-collage-note">A collection of perspectives, made by people.</p>
      </motion.div>
    </section>
  );
}
