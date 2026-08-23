import { NextResponse } from "next/server";
import { resetDemoBusiness } from "@/lib/klyro/demo-repository";
import { sameOrigin } from "@/lib/klyro/http-security";
import { readSession } from "@/lib/klyro/session";
export async function POST(request: Request) { if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 }); const session = await readSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { return NextResponse.json({ business: resetDemoBusiness(session.userId) }); } catch (error) { const message = error instanceof Error ? error.message : "Forbidden"; return NextResponse.json({ error: message }, { status: message === "DEMO_DISABLED" ? 404 : 403 }); } }
