import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Brand Assets", description: "Download approved Luna1 Research logos, prism artwork, social graphics, and the complete brand kit." };
const assets = [
  { title: "Prism icon", preview: "/brand/luna1-prism.svg", file: "luna1-prism.svg", note: "Primary vector mark" },
  { title: "Horizontal logo", preview: "/brand/luna1-logo-horizontal.svg", file: "luna1-logo-horizontal.svg", note: "Wide-format lockup" },
  { title: "Stacked logo", preview: "/brand/luna1-logo-stacked.svg", file: "luna1-logo-stacked.svg", note: "Compact lockup" },
  { title: "Transparent PNG", preview: "/brand/luna1-prism-transparent.png", file: "luna1-prism-transparent.png", note: "1024×1024 transparent raster" },
  { title: "SVG version", preview: "/brand/luna1-prism-white.svg", file: "luna1-prism-white.svg", note: "Reversed vector mark", dark: true },
  { title: "Social-media card", preview: "/brand/luna1-social-card.png", file: "luna1-social-card.png", note: "1200×630" },
  { title: "Commercial poster", preview: "/brand/luna1-commercial-poster.png", file: "luna1-commercial-poster.png", note: "1600×900" },
] as const;
export default function BrandPage() { return <><section className="page-header brand-header"><span className="eyebrow">Luna1 Research · Public resources</span><h1>Brand Assets</h1><p>Approved artwork for press, partner references, and Luna1 Research communications.</p><a className="button primary" href="/brand/luna1-brand-kit.zip" download>Download Brand Kit <span>↓</span></a></section><section className="brand-assets" aria-labelledby="brand-assets-heading"><div className="section-heading"><span className="eyebrow">Approved downloads</span><h2 id="brand-assets-heading">Built for every format.</h2><p>Choose SVG for scalable production work and PNG for everyday digital use.</p></div><div className="brand-grid">{assets.map(asset => <article className="brand-card" key={asset.file}><div className={`brand-preview${"dark" in asset && asset.dark ? " dark" : ""}`}><Image src={asset.preview} alt={`Preview of ${asset.title}`} width={800} height={480} sizes="(max-width: 760px) calc(100vw - 64px), 380px"/></div><div><span><small>{asset.note}</small><h3>{asset.title}</h3></span><a className="button" href={`/brand/${asset.file}`} download>Download <span>↓</span></a></div></article>)}</div></section></>; }
