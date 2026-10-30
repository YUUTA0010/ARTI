import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the form fields and try again." }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ saved: true });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Message storage is unavailable in demo mode. Configure Supabase to enable inquiries." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  if (error) {
    console.error("Could not save inquiry:", error.message);
    return NextResponse.json({ error: "We could not save your message. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ saved: true }, { status: 201 });
}
