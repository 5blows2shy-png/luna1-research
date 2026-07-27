"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

export function LunaMark() {
  return (
    <span className="mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
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
    const frame = requestAnimationFrame(() => setTheme(currentTheme));

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
      const first = focusable[0],
        last = focusable[focusable.length - 1];
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

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-intro">
          <Link className="brand" href="/">
            <LunaMark />
            <span className="brand-lockup">
              <b>LUNA1 RESEARCH</b>
              <small>Independent investment research</small>
            </span>
          </Link>
          <p>
            Disciplined public-markets research, portfolio accountability, and
            transparent decision reviews.
          </p>
        </div>
        <div>
          <span className="eyebrow">Research platform</span>
          <p>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/portfolio/mistake-journal">
              Portfolio Decision Reviews
            </Link>
            <Link href="/about">About</Link>
            <Link href="/development-log">Development Log</Link>
          </p>
        </div>
        <div>
          <span className="eyebrow">Professional profile</span>
          <p>
            <Link href="/recruiter">Recruiter View</Link>
            <Link href="/contact">Contact</Link>
          </p>
        </div>
        <div>
          <span className="eyebrow">Professional inquiries</span>
          <p>
            Recruiting, research, and collaboration inquiries are available
            through the secure <Link href="/contact">contact form</Link>.
          </p>
        </div>
      </div>
      <div className="disclaimer">
        <strong>Educational Disclosure:</strong> The information on Luna1
        Research is provided for educational and informational purposes only. It
        reflects personal analysis and opinions and is not investment,
        financial, tax, or legal advice. Always conduct your own research before
        making investment decisions.
      </div>
      <div className="copyright">
        <span>© 2026 Luna1 Research. All rights reserved.</span>
        <span>
          <Link href="/about">About</Link>
          <Link className="footer-brand-link" href="/brand">
            Brand Assets
          </Link>
        </span>
      </div>
    </footer>
  );
}
export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-header">
      <div className="page-header-rule" />
      <div>
        <span className="eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}
export function Score({ score }: { score: number }) {
  return (
    <div className="score" aria-label={`LUNA Score ${score} out of 100`}>
      <span>{score}</span>
      <small>
        LUNA
        <br />
        SCORE
      </small>
    </div>
  );
}
export function Scorecard() {
  const [values, setValues] = useState([25, 20, 12, 12, 8, 4]);
  const total = values.reduce((a, b) => a + b, 0);
  const labels = [
    "Fundamentals",
    "Technical structure",
    "Institutional behavior",
    "Moat & industry",
    "Catalyst & runway",
    "Risk & entry",
  ];
  const max = [30, 25, 15, 15, 10, 5];
  return (
    <div className="scorecard">
      <div className="score-total">
        <Score score={total} />
        <div>
          <span className="eyebrow">Illustrative ticker · LUNA</span>
          <h3>
            {total >= 90
              ? "LUNA Superleader"
              : total >= 80
                ? "LUNA-A"
                : total >= 70
                  ? "LUNA-B / Inflection Leader"
                  : total >= 60
                    ? "Watchlist"
                    : "Does Not Qualify"}
          </h3>
        </div>
      </div>
      {labels.map((label, index) => (
        <label className="range-row" key={label}>
          <span>{label}</span>
          <input
            aria-label={label}
            type="range"
            min="0"
            max={max[index]}
            value={values[index]}
            onChange={(event) =>
              setValues(
                values.map((value, itemIndex) =>
                  itemIndex === index ? +event.target.value : value,
                ),
              )
            }
          />
          <b>
            {values[index]}/{max[index]}
          </b>
        </label>
      ))}
    </div>
  );
}
export function DcfCalculator() {
  const [rev, setRev] = useState(1200),
    [growth, setGrowth] = useState(12),
    [margin, setMargin] = useState(22),
    [tax, setTax] = useState(21),
    [discount, setDiscount] = useState(9),
    [terminal, setTerminal] = useState(3),
    [shares, setShares] = useState(100);
  const fcf = ((rev * (1 + growth / 100) * margin) / 100) * (1 - tax / 100);
  const ev = (fcf * (1 + terminal / 100)) / (discount / 100 - terminal / 100);
  const per = ev / shares;
  const fields: [
    [string, number, (value: number) => void, string],
    ...Array<[string, number, (value: number) => void, string]>,
  ] = [
    ["Revenue", rev, setRev, "$m"],
    ["Revenue growth", growth, setGrowth, "%"],
    ["Operating margin", margin, setMargin, "%"],
    ["Tax rate", tax, setTax, "%"],
    ["Discount rate", discount, setDiscount, "%"],
    ["Terminal growth", terminal, setTerminal, "%"],
    ["Shares outstanding", shares, setShares, "m"],
  ];
  return (
    <div className="dcf">
      <div className="dcf-inputs">
        {fields.map(([label, value, setter, unit]) => (
          <label key={label}>
            {label}
            <span>
              <input
                type="number"
                value={value}
                onChange={(event) => setter(+event.target.value)}
              />
              <b>{unit}</b>
            </span>
          </label>
        ))}
      </div>
      <div className="dcf-results">
        <span className="eyebrow">Illustrative output</span>
        <div>
          <small>Enterprise value</small>
          <strong>${Math.round(ev).toLocaleString()}m</strong>
        </div>
        <div>
          <small>Equity value*</small>
          <strong>${Math.round(ev).toLocaleString()}m</strong>
        </div>
        <div className="implied">
          <small>Implied value / share</small>
          <strong>${per.toFixed(2)}</strong>
        </div>
        <p>*Assumes zero net debt for this simplified educational model.</p>
      </div>
    </div>
  );
}
