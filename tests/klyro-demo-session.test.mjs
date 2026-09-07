import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const sessionSource = fs.readFileSync("src/lib/klyro-demo-session.ts", "utf8");
const loginSource = fs.readFileSync("src/app/login/page.tsx", "utf8");
const startRoute = fs.readFileSync("src/app/api/klyro/demo/start/route.ts", "utf8");

test("Klyro exposes an explicit 24-hour sample-data demo entry point", () => {
  assert.match(loginSource, /Launch demo workspace/);
  assert.match(loginSource, /fictional sample data/i);
  assert.match(sessionSource, /60 \* 60 \* 24/);
});

test("demo cookie is signed, HTTP-only, same-site, and secure over HTTPS", () => {
  assert.match(sessionSource, /createHmac\("sha256"/);
  assert.match(sessionSource, /timingSafeEqual/);
  assert.match(startRoute, /httpOnly: true/);
  assert.match(startRoute, /sameSite: "lax"/);
  assert.match(startRoute, /secure: isSecureRequest/);
  assert.match(startRoute, /x-forwarded-proto/);
});

test("production demo sessions require a dedicated server secret", () => {
  assert.match(sessionSource, /DEMO_SESSION_SECRET/);
  assert.match(sessionSource, /NODE_ENV !== "production"/);
  assert.doesNotMatch(sessionSource, /SUPABASE_SERVICE_ROLE_KEY/);
});
