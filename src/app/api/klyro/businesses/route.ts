import { NextResponse } from "next/server";
import { getDemoBusinesses } from "@/lib/klyro/demo-repository";
import { readSession } from "@/lib/klyro/session";
export async function GET() { const session = await readSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { return NextResponse.json({ businesses: getDemoBusinesses(session.userId) }); } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); } }
