"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./klyro-account.module.css";

export function KlyroLogin() {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); setError(""); const data = new FormData(event.currentTarget); const response = await fetch("/api/klyro/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) }); setPending(false); if (!response.ok) { setError("Email or password is incorrect."); return; } router.refresh(); }
  return <main className={styles.shell}><section className={styles.panel}><p className={styles.eyebrow}>Financial decision support</p><h1>Klyro</h1><p>Sign in to securely access your business financial workspace.</p><form onSubmit={submit}><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>{error && <p role="alert" className={styles.error}>{error}</p>}<button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button></form><small>Development demo access is configured by the environment. Illustrative estimates · Not financial advice.</small></section></main>;
}

export function KlyroAccountActions() { const router = useRouter(); async function post(path: string) { await fetch(path, { method: "POST" }); router.refresh(); } return <div className={styles.actions}><button onClick={() => post("/api/klyro/demo/reset")}>Reset Demo Business</button><button onClick={() => post("/api/klyro/auth/logout")}>Sign out</button></div>; }
