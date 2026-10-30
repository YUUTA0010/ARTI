"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight, ImagePlus, LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Profile = { display_name: string; role: "artist" | "collector"; bio: string | null; location: string | null };
type Work = { id: string; title: string; status: "draft" | "published"; image_url: string | null; storage_path: string | null; category: string };

const profileSchema = z.object({
  display_name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(800),
  location: z.string().trim().max(120),
});

const workSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(3000),
  category: z.string().min(1),
  medium: z.string().trim().min(2).max(120),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  dimensions: z.string().trim().max(100),
  price: z.string().optional(),
  image: z.custom<FileList>((value) => typeof FileList !== "undefined" && value instanceof FileList && value.length === 1, "Choose an artwork image."),
});

type ProfileValues = z.infer<typeof profileSchema>;
type WorkInput = z.input<typeof workSchema>;
type WorkValues = z.output<typeof workSchema>;

export function Workspace({ userId, email, initialProfile }: { userId: string; email: string; initialProfile: Profile | null }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [works, setWorks] = useState<Work[]>([]);
  const [tab, setTab] = useState<"overview" | "profile" | "artwork">("overview");
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: initialProfile?.display_name ?? "",
      bio: initialProfile?.bio ?? "",
      location: initialProfile?.location ?? "",
    },
  });
  const workForm = useForm<WorkInput, unknown, WorkValues>({
    resolver: zodResolver(workSchema),
    defaultValues: { title: "", description: "", category: "Painting", medium: "", year: new Date().getFullYear(), dimensions: "", price: "" },
  });

  async function refreshWorks() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data, error } = await supabase.from("artworks").select("id,title,status,image_url,category").eq("artist_id", userId).order("created_at", { ascending: false });
    if (error) {
      toast.error("Could not load your artwork", { description: error.message });
      return;
    }
    const signedWorks = await Promise.all((data ?? []).map(async (work) => {
      if (!work.image_url) return { ...work, storage_path: null, image_url: null };
      const { data: signed, error: signedError } = await supabase.storage
        .from("artwork-images")
        .createSignedUrl(work.image_url, 3600);
      if (signedError) {
        toast.error(`Could not preview ${work.title}`, { description: signedError.message });
      }
      return { ...work, storage_path: work.image_url, image_url: signed?.signedUrl ?? null };
    }));
    setWorks(signedWorks as Work[]);
  }

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.from("artworks").select("id,title,status,image_url,category").eq("artist_id", userId).order("created_at", { ascending: false }).then(async ({ data, error }) => {
      if (!active) return;
      if (error) {
        toast.error("Could not load your artwork", { description: error.message });
        return;
      }
      const signedWorks = await Promise.all((data ?? []).map(async (work) => {
        if (!work.image_url) return { ...work, storage_path: null, image_url: null };
        const { data: signed, error: signedError } = await supabase.storage
          .from("artwork-images")
          .createSignedUrl(work.image_url, 3600);
        if (signedError) {
          toast.error(`Could not preview ${work.title}`, { description: signedError.message });
        }
        return { ...work, storage_path: work.image_url, image_url: signed?.signedUrl ?? null };
      }));
      if (active) setWorks(signedWorks as Work[]);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  async function saveProfile(values: ProfileValues) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.from("profiles").upsert({ id: userId, ...values }, { onConflict: "id" });
    if (error) {
      toast.error("Profile could not be saved", { description: error.message });
      return;
    }
    setProfile((current) => ({ role: current?.role ?? "artist", ...values }));
    toast.success("Profile saved");
  }

  async function addArtwork(values: WorkValues) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const file = values.image[0];
    if (!file || !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast.error("Choose an image under 10 MB.");
      return;
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("artwork-images").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      toast.error("Image upload failed", { description: uploadError.message });
      return;
    }
    const parsedPrice = values.price?.trim() ? Number(values.price) : null;
    if (parsedPrice !== null && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
      toast.error("Price must be a non-negative number.");
      const { error: cleanupError } = await supabase.storage.from("artwork-images").remove([path]);
      if (cleanupError) toast.error("The rejected upload could not be removed", { description: cleanupError.message });
      return;
    }
    const { error } = await supabase.from("artworks").insert({
      artist_id: userId,
      title: values.title,
      slug: `${values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${crypto.randomUUID().slice(0, 8)}`,
      description: values.description,
      category: values.category,
      medium: values.medium,
      year: values.year,
      dimensions: values.dimensions,
      price: parsedPrice,
      image_url: path,
      status: "draft",
      is_for_sale: parsedPrice !== null,
    });
    if (error) {
      toast.error("Artwork could not be saved", { description: error.message });
      const { error: cleanupError } = await supabase.storage.from("artwork-images").remove([path]);
      if (cleanupError) toast.error("The uploaded image could not be cleaned up", { description: cleanupError.message });
      return;
    }
    workForm.reset();
    toast.success("Artwork saved as a draft");
    await refreshWorks();
  }

  async function updateStatus(work: Work) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const status = work.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("artworks").update({ status }).eq("id", work.id).eq("artist_id", userId);
    if (error) {
      toast.error("Could not update artwork", { description: error.message });
      return;
    }
    setWorks((items) => items.map((item) => item.id === work.id ? { ...item, status } : item));
    toast.success(status === "published" ? "Artwork published" : "Artwork unpublished");
  }

  async function deleteWork(work: Work) {
    if (!window.confirm(`Delete “${work.title}”? This cannot be undone.`)) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.from("artworks").delete().eq("id", work.id).eq("artist_id", userId);
    if (error) {
      toast.error("Artwork could not be deleted", { description: error.message });
      return;
    }
    setWorks((items) => items.filter((item) => item.id !== work.id));
    toast.success("Artwork deleted");
    if (work.storage_path) {
      const { error: storageError } = await supabase.storage.from("artwork-images").remove([work.storage_path]);
      if (storageError) toast.error("Artwork deleted, but its image could not be removed", { description: storageError.message });
    }
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Could not sign out", { description: error.message });
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="site-container grid gap-8 pb-20 pt-10 md:grid-cols-[220px_1fr]">
      <aside className="border-b border-line pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-5">
        <p className="section-kicker">Artist workspace</p>
        <p className="mt-3 truncate text-sm font-medium">{profile?.display_name || email}</p>
        <p className="mt-1 text-xs text-muted">{email}</p>
        <nav className="mt-6 flex gap-2 overflow-auto md:flex-col" aria-label="Workspace sections">
          {(["overview", "profile", "artwork"] as const).map((item) => (
            <button type="button" key={item} onClick={() => setTab(item)} className={`whitespace-nowrap px-3 py-2 text-left text-xs capitalize ${tab === item ? "bg-blue text-white" : "text-muted hover:bg-black/5 hover:text-ink"}`}>{item === "artwork" ? "My artwork" : item === "profile" ? "My profile" : item}</button>
          ))}
        </nav>
        <button type="button" onClick={signOut} className="mt-6 hidden items-center gap-2 text-xs text-muted hover:text-ink md:flex"><LogOut size={14} /> Sign out</button>
      </aside>

      <div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="section-kicker">Your creative space</p><h1 className="display-serif mt-2 text-4xl sm:text-5xl">{tab === "overview" ? "Welcome to your workspace." : tab === "profile" ? "Your profile." : "Your artwork."}</h1></div>
          <Link href="/artists" className="inline-flex items-center gap-2 text-xs text-muted hover:text-blue">Public artist directory <ArrowUpRight size={14} /></Link>
        </div>

        {tab === "overview" && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {[["Portfolio works", works.length], ["Published", works.filter((work) => work.status === "published").length], ["Drafts", works.filter((work) => work.status === "draft").length]].map(([label, count]) => (
                <div key={label} className="border border-line bg-card p-5"><p className="text-xs text-muted">{label}</p><p className="display-serif mt-2 text-4xl">{count}</p></div>
              ))}
            </div>
            <div className="mt-6 border border-line p-5 sm:p-7">
              <h2 className="font-medium">A note about your workspace</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Your profile and portfolio are private until you choose to publish them. Only your account can edit your records. Uploads are limited to image files up to 10 MB.</p>
              <div className="mt-5 flex flex-wrap gap-3"><Button variant="accent" onClick={() => setTab("artwork")}><Plus size={15} /> Add artwork</Button><Button variant="outline" onClick={() => setTab("profile")}>Edit profile</Button></div>
            </div>
            <MyWorks works={works} onStatus={updateStatus} onDelete={deleteWork} />
          </>
        )}

        {tab === "profile" && (
          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="max-w-2xl space-y-4 border border-line bg-card p-5 sm:p-7">
            <p className="text-sm leading-6 text-muted">This profile is tied to your signed-in account. Keep private contact details out of your public bio.</p>
            <label className="form-label">Display name<input className="form-input" {...profileForm.register("display_name")} />{profileForm.formState.errors.display_name && <span className="form-error">{profileForm.formState.errors.display_name.message}</span>}</label>
            <label className="form-label">Location<input className="form-input" {...profileForm.register("location")} /></label>
            <label className="form-label">Public biography<textarea className="form-input min-h-32 py-3" {...profileForm.register("bio")} /></label>
            <Button type="submit" variant="accent" disabled={profileForm.formState.isSubmitting}>Save profile</Button>
            {!profile && <p className="text-xs text-muted">A profile record will be created for this signed-in account.</p>}
          </form>
        )}

        {tab === "artwork" && (
          <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={workForm.handleSubmit(addArtwork)} className="space-y-4 border border-line bg-card p-5 sm:p-7">
              <div><h2 className="font-medium">Add a work</h2><p className="mt-1 text-xs leading-5 text-muted">New works start as private drafts.</p></div>
              <label className="form-label">Title<input className="form-input" {...workForm.register("title")} />{workForm.formState.errors.title && <span className="form-error">{workForm.formState.errors.title.message}</span>}</label>
              <label className="form-label">Category<select className="form-input" {...workForm.register("category")}>{["Painting", "Digital Art", "Illustration", "Photography", "Sculpture", "Abstract Art", "Mixed Media", "Typography"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="form-label">Medium<input className="form-input" {...workForm.register("medium")} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="form-label">Year<input type="number" className="form-input" {...workForm.register("year")} /></label>
                <label className="form-label">Dimensions<input className="form-input" placeholder="e.g. 40 × 60 cm" {...workForm.register("dimensions")} /></label>
              </div>
              <label className="form-label">Description<textarea className="form-input min-h-24 py-3" {...workForm.register("description")} /></label>
              <label className="form-label">Price in USD <span className="font-normal text-muted">(optional)</span><input type="number" min="0" step="1" className="form-input" {...workForm.register("price")} /></label>
              <label className="form-label">Artwork image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="form-input file:mr-3 file:border-0 file:bg-blue/10 file:px-3 file:py-1 file:text-xs" {...workForm.register("image")} />{workForm.formState.errors.image && <span className="form-error">{workForm.formState.errors.image.message}</span>}<span className="mt-1 block text-[10px] text-muted">JPG, PNG, WebP or AVIF · 10 MB max</span></label>
              <Button type="submit" variant="accent" disabled={workForm.formState.isSubmitting}><ImagePlus size={15} />{workForm.formState.isSubmitting ? "Saving…" : "Save as draft"}</Button>
            </form>
            <MyWorks works={works} onStatus={updateStatus} onDelete={deleteWork} />
          </div>
        )}
      </div>
    </div>
  );
}

function MyWorks({ works, onStatus, onDelete }: { works: Work[]; onStatus: (work: Work) => void; onDelete: (work: Work) => void }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-sm font-medium">Your portfolio</h2>
      {works.length ? <div className="space-y-3">{works.map((work) => (
        <article key={work.id} className="flex items-center gap-4 border border-line bg-card p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#e6e5df]">
            {work.image_url && <Image src={work.image_url} alt="" fill unoptimized sizes="64px" className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{work.title}</p><p className="mt-1 text-xs text-muted">{work.category} · {work.status}</p></div>
          <Button variant="outline" size="sm" onClick={() => onStatus(work)}>{work.status === "published" ? "Unpublish" : "Publish"}</Button>
          <Button variant="ghost" size="icon" aria-label={`Delete ${work.title}`} onClick={() => onDelete(work)}><Trash2 size={15} /></Button>
        </article>
      ))}</div> : <p className="border border-dashed border-line p-8 text-center text-sm text-muted">Your portfolio is empty. Add your first work to get started.</p>}
    </section>
  );
}
