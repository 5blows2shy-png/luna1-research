"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LunaMark } from "@/components/luna-mark";
import { navigationItems } from "@/lib/data";

type ColorTheme = "dark" | "light";

const themeColors: Record<ColorTheme, string> = {
  dark: "#090b10",
  light: "#f4f1e9",
};

function applyTheme(theme: ColorTheme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = themeColors[theme];
    });
}

function hasStoredTheme() {
  try {
    return window.localStorage.getItem("theme") !== null;
  } catch {
    return false;
  }
}

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ColorTheme | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const activeTheme = theme ?? "dark";

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const legacyMedia = media as MediaQueryList & {
      addListener(listener: (event: MediaQueryListEvent) => void): void;
      removeListener(listener: (event: MediaQueryListEvent) => void): void;
    };
    const currentTheme: ColorTheme =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    applyTheme(currentTheme);
    const frame = requestAnimationFrame(() => {
      setTheme(
        document.documentElement.dataset.theme === "light" ? "light" : "dark",
      );
    });

    const followSystemTheme = (event: MediaQueryListEvent) => {
      if (hasStoredTheme()) return;
      const nextTheme: ColorTheme = event.matches ? "dark" : "light";
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    if ("addEventListener" in media) {
      media.addEventListener("change", followSystemTheme);
    } else {
      legacyMedia.addListener(followSystemTheme);
    }
    return () => {
      cancelAnimationFrame(frame);
      if ("removeEventListener" in media) {
        media.removeEventListener("change", followSystemTheme);
      } else {
        legacyMedia.removeListener(followSystemTheme);
      }
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: ColorTheme =
      activeTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // The selected theme still applies for this session if storage is blocked.
    }
    setTheme(nextTheme);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !drawer.current) return;
      const focusable = Array.from(
        drawer.current.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled])",
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    drawer.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const active = (href: string) =>
    path === href ||
    (href === "/portfolio-dashboard" && path === "/portfolios") ||
    (href !== "/" && path.startsWith(`${href}/`));

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <LunaMark />
          <span className="brand-lockup">
            <b>LUNA1 RESEARCH</b>
            <small>Independent investment research</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link
              className={active(item.href) ? "active" : ""}
              key={item.href}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className="icon-button"
            data-theme-toggle
            onClick={toggleTheme}
            aria-label={`Switch to ${activeTheme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={activeTheme === "dark"}
            title={`Use ${activeTheme === "dark" ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true">
              {activeTheme === "dark" ? "☼" : "☾"}
            </span>
          </button>
          <button
            ref={menuButton}
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={`${open ? "Close" : "Open"} navigation menu`}
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <div
          className="mobile-nav-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={drawer}
            id="mobile-navigation"
            className="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            <div className="mobile-nav-header">
              <span>Navigation</span>
              <small>Luna1 Research</small>
            </div>
            <nav aria-label="Mobile navigation">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  className={active(item.href) ? "active" : ""}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
