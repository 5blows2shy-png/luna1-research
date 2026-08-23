import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const approvalSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

function isAuthorized(request: Request) {
  const expected = process.env.ADMIN_REVIEW_TOKEN;
  const provided = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!expected || !provided) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const parsed = approvalSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid approval status." }, { status: 400 });
  }
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return Response.json({ error: "Invalid submission ID." }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: "Review storage is unavailable." }, { status: 503 });
  }
  const { error } = await supabase
    .from("research_view_submissions")
    .update({
      approval_status: parsed.data.status,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    return Response.json({ error: "Review update failed." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
