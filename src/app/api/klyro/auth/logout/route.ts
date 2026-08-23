import { NextResponse } from "next/server";
import { recordAudit } from "@/lib/klyro/demo-repository";
import { sameOrigin } from "@/lib/klyro/http-security";
import { clearSession, readSession } from "@/lib/klyro/session";
export async function POST(request: Request) { if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 }); const session = await readSession(); if (session) recordAudit("LOGOUT", session.userId); await clearSession(); return NextResponse.json({ ok: true }); }
