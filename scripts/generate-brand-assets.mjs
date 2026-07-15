import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = path.join(root, "public", "brand");
const appDir = path.join(root, "src", "app");
const palette = { ink: "#0d0f0f", paper: "#f2f0e9", blue: "#4079a6", purple: "#8a6ba8", orange: "#c87545" };

const prism = ({ monochrome = null } = {}) => {
  const ink = monochrome ?? palette.ink;
  const accent = monochrome ?? palette.blue;
  const accent2 = monochrome ?? palette.purple;
  const accent3 = monochrome ?? palette.orange;
  return `<g><path d="M256 46 452 426H60L256 46Z" fill="${ink}"/><path d="M256 46 256 426H60L256 46Z" fill="#ffffff" opacity=".055"/><path d="M256 46 452 426H256V46Z" fill="#ffffff" opacity=".018"/><path d="M206 164v168h105" fill="none" stroke="#ffffff" stroke-width="26" stroke-linecap="square" stroke-linejoin="miter" opacity=".13"/><path d="M76 324 439 252" stroke="${accent}" stroke-width="9"/><path d="M70 346 444 316" stroke="${accent2}" stroke-width="9"/><path d="M64 369 449 381" stroke="${accent3}" stroke-width="9"/></g>`;
};
const svg = (body, viewBox = "0 0 512 512") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title desc"><title id="title">Luna1 Research</title><desc id="desc">A dark triangular prism with a subtle L monogram and spectral color lines.</desc>${body}</svg>`;
const wordmark = (fill = palette.ink, x = 590, y = 292, size = 104) => `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="700" letter-spacing="18">LUNA1</text><text x="${x + 5}" y="${y + 62}" fill="${fill}" opacity=".62" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600" letter-spacing="12">RESEARCH</text>`;

await fs.mkdir(brandDir, { recursive: true });
const icon = svg(prism());
const iconBlack = svg(prism({ monochrome: "#000000" }));
const iconWhite = svg(prism({ monochrome: "#ffffff" }));
const horizontal = svg(`<g transform="translate(34 20) scale(.78)">${prism()}</g>${wordmark()}`, "0 0 1280 440");
const stacked = svg(`<g transform="translate(244 42) scale(.82)">${prism()}</g>${wordmark(palette.ink, 238, 590, 112)}`, "0 0 1000 720");
const social = svg(`<rect width="1200" height="630" fill="${palette.ink}"/><circle cx="930" cy="250" r="330" fill="#1b1e1e"/><g transform="translate(720 76) scale(.91)">${prism()}</g>${wordmark(palette.paper, 82, 278, 92)}<text x="88" y="410" fill="${palette.paper}" opacity=".62" font-family="Arial, Helvetica, sans-serif" font-size="26">INSTITUTIONAL-QUALITY INDEPENDENT RESEARCH</text><path d="M88 454h510" stroke="${palette.blue}" stroke-width="4"/><path d="M88 468h510" stroke="${palette.purple}" stroke-width="4"/><path d="M88 482h510" stroke="${palette.orange}" stroke-width="4"/>`, "0 0 1200 630");
const poster = svg(`<rect width="1600" height="900" fill="${palette.ink}"/><circle cx="800" cy="430" r="360" fill="#151818"/><text x="95" y="94" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" letter-spacing="8">LUNA1 RESEARCH</text><text x="95" y="720" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="500">Price is the result.</text><text x="95" y="800" fill="${palette.paper}" opacity=".64" font-family="Arial, Helvetica, sans-serif" font-size="42">Luna1 reveals the causes.</text><g transform="translate(544 100) scale(1.48)">${prism()}</g>`, "0 0 1600 900");
for (const [name, contents] of new Map([["luna1-prism.svg", icon], ["luna1-prism-black.svg", iconBlack], ["luna1-prism-white.svg", iconWhite], ["luna1-logo-horizontal.svg", horizontal], ["luna1-logo-stacked.svg", stacked]])) await fs.writeFile(path.join(brandDir, name), contents);
const render = async (contents, target, width, height) => sharp(Buffer.from(contents)).resize(width, height, { fit: "contain" }).png().toFile(target);
await Promise.all([render(icon, path.join(brandDir, "luna1-prism-transparent.png"), 1024, 1024), render(horizontal, path.join(brandDir, "luna1-logo-horizontal.png"), 1280, 440), render(stacked, path.join(brandDir, "luna1-logo-stacked.png"), 1000, 720), render(social, path.join(brandDir, "luna1-social-card.png"), 1200, 630), render(poster, path.join(brandDir, "luna1-commercial-poster.png"), 1600, 900), render(icon, path.join(appDir, "icon.png"), 512, 512), render(icon, path.join(appDir, "apple-icon.png"), 180, 180)]);
const faviconPng = await sharp(Buffer.from(icon)).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(22); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4); header.writeUInt8(48, 6); header.writeUInt8(48, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(faviconPng.length, 14); header.writeUInt32LE(22, 18);
await fs.writeFile(path.join(appDir, "favicon.ico"), Buffer.concat([header, faviconPng]));
