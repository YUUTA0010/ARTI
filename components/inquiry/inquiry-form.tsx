"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: z.string().trim().max(120),
  message: z.string().trim().min(10, "Please add a little more detail.").max(3000),
  website: z.string().max(0).optional(),
});

type InquiryValues = z.infer<typeof inquirySchema>;

export function InquiryForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  async function submit(values: InquiryValues) {
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save your message.");
      toast.success("Your message was saved", { description: "Thanks for getting in touch with ARTI." });
      reset();
    } catch (error) {
      toast.error("Message not sent", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-label">Name<input className="form-input" autoComplete="name" {...register("name")} />{errors.name && <span className="form-error">{errors.name.message}</span>}</label>
        <label className="form-label">Email<input className="form-input" type="email" autoComplete="email" {...register("email")} />{errors.email && <span className="form-error">{errors.email.message}</span>}</label>
      </div>
      <label className="form-label">Subject <span className="font-normal text-muted">(optional)</span><input className="form-input" {...register("subject")} />{errors.subject && <span className="form-error">{errors.subject.message}</span>}</label>
      <label className="form-label">Message<textarea className="form-input min-h-32 resize-y py-3" {...register("message")} />{errors.message && <span className="form-error">{errors.message.message}</span>}</label>
      <label className="sr-only" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      <Button type="submit" variant="accent" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</Button>
      <p className="text-xs leading-5 text-muted">Messages are stored only when the project owner configures Supabase. Email delivery is not configured.</p>
    </form>
  );
}
