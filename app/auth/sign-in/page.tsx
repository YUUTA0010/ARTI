import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <section className="site-container grid min-h-[70vh] items-center gap-12 py-14 md:grid-cols-2">
      <div className="max-w-lg">
        <p className="section-kicker">Good to have you back</p>
        <h1 className="display-serif mt-3 text-5xl sm:text-6xl">Return to your <i className="text-blue">ARTI.</i></h1>
        <p className="mt-4 text-sm leading-7 text-muted">Sign in to manage your profile, your work, and the art you love.</p>
      </div>
      <div className="mx-auto w-full max-w-md border border-line bg-card p-6 sm:p-8">
        <AuthForm mode="sign-in" />
        <p className="mt-6 text-center text-sm text-muted">New to ARTI? <Link href="/auth/sign-up" className="font-medium text-blue">Create an account</Link></p>
      </div>
    </section>
  );
}
