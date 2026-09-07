import { NextResponse } from "next/server";
import { KLYRO_DEMO_COOKIE } from "@/lib/klyro-demo-session";

export async function POST(request: Request) {
  const isSecureRequest = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const response = NextResponse.redirect(new URL("/login?demo=ended", request.url), 303);
  response.cookies.set(KLYRO_DEMO_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: isSecureRequest,
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
