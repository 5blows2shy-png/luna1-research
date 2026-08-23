import { NextResponse } from "next/server";
import {
  createKlyroDemoSession,
  KLYRO_DEMO_COOKIE,
  KLYRO_DEMO_LIFETIME_SECONDS,
} from "@/lib/klyro-demo-session";

export async function POST(request: Request) {
  const isSecureRequest = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const token = createKlyroDemoSession();
  if (!token) {
    return NextResponse.redirect(new URL("/login?demo=unavailable", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/klyro?welcome=demo", request.url), 303);
  response.cookies.set(KLYRO_DEMO_COOKIE, token, {
    httpOnly: true,
    maxAge: KLYRO_DEMO_LIFETIME_SECONDS,
    sameSite: "lax",
    secure: isSecureRequest,
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
