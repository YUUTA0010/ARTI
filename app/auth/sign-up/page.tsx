import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Join ARTI" };

export default function SignUpPage() {
  return (
    <section className="site-container grid min-h-[70vh] items-center gap-12 py-14 md:grid-cols-2">
      <div className="max-w-lg">
        <p className="section-kicker">A place for your point of view</p>
        <h1 className="display-serif mt-3 text-5xl sm:text-6xl">Make space for <i className="text-blue">what you make.</i></h1>
        <p className="mt-4 text-sm leading-7 text-muted">Join a community made for artists and the people who love discovering art.</p>
      </div>
      <div className="mx-auto w-full max-w-md border border-line bg-card p-6 sm:p-8">
        <AuthForm mode="sign-up" />
        <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/auth/sign-in" className="font-medium text-blue">Sign in</Link></p>
      </div>
    </section>
  );
}
