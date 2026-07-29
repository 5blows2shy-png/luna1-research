import { enforceRateLimit, clientIdentifier } from "@/lib/rate-limit";
import { researchViewSchema } from "@/lib/research-view-schema";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return Response.json(
      { message: "Content-Type must be application/json." },
      { status: 415 },
    );
  }
  const parsed = researchViewSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { message: "Please review the submission fields and source link." },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return Response.json({
      message: "Your view was submitted for private review.",
    });
  }
  const retryAfter = enforceRateLimit(
    "research-view",
    clientIdentifier(request),
  );
  if (retryAfter) {
    return Response.json(
      { message: "Too many submissions. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      {
        message:
          "Private review storage is not configured. Your analysis was not stored.",
      },
      { status: 503 },
    );
  }
  const { website, consent, ...submission } = parsed.data;
  void website;
  void consent;
  const { error } = await supabase.from("research_view_submissions").insert({
    ...submission,
    approval_status: "pending",
  });
  if (error) {
    console.error("Research-view submission failed.");
    return Response.json(
      { message: "Private submission is temporarily unavailable." },
      { status: 502 },
    );
  }
  return Response.json(
    { message: "Your view was submitted for private review." },
    { status: 201 },
  );
}
