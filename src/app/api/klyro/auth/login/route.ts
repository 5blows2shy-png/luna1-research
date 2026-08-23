import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateDemo } from "@/lib/klyro/demo-repository";
import { allowLoginAttempt, sameOrigin } from "@/lib/klyro/http-security";
import { writeSession } from "@/lib/klyro/session";
const input = z.object({ email: z.email().max(254), password: z.string().min(8).max(200) });
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!allowLoginAttempt(ip)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const user = authenticateDemo(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  await writeSession(user.id, user.email); return NextResponse.json({ ok: true });
}
