import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";

const root = process.cwd();
const brand = path.join(root, "public", "brand");
const publicAssets = ["luna1-prism.svg", "luna1-prism-gold.svg", "luna1-prism-black.svg", "luna1-prism-white.svg", "luna1-prism-transparent.png", "luna1-logo-horizontal.svg", "luna1-logo-luxury.svg", "luna1-logo-horizontal.png", "luna1-logo-stacked.svg", "luna1-logo-stacked.png", "luna1-social-card.png", "luna1-commercial-poster.png", "README.md", "luna1-brand-kit.zip"];

test("brand kit and App Router metadata assets exist", async () => {
  for (const file of publicAssets) assert.ok((await fs.stat(path.join(brand, file))).size > 0, `${file} should not be empty`);
  for (const file of ["favicon.ico", "icon.png", "apple-icon.png"]) assert.ok((await fs.stat(path.join(root, "src", "app", file))).size > 0, `${file} should exist`);
  assert.ok((await fs.stat(path.join(root, "public", "favicon.svg"))).size > 0, "premium SVG favicon should exist");
});

test("every public SVG declares a valid viewBox", async () => {
  for (const file of publicAssets.filter(file => file.endsWith(".svg"))) {
    const source = await fs.readFile(path.join(brand, file), "utf8");
    assert.match(source, /viewBox="\d+ \d+ \d+ \d+"/, `${file} should declare a numeric viewBox`);
  }
});

test("transparent prism PNG has genuinely transparent corners", async () => {
  const image = sharp(path.join(brand, "luna1-prism-transparent.png"));
  const metadata = await image.metadata();
  assert.equal(metadata.hasAlpha, true);
  const { data } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(data[3], 0, "top-left corner alpha should be zero");
});

test("fixed-size campaign exports use approved dimensions", async () => {
  const social = await sharp(path.join(brand, "luna1-social-card.png")).metadata();
  const poster = await sharp(path.join(brand, "luna1-commercial-poster.png")).metadata();
  assert.deepEqual([social.width, social.height], [1200, 630]);
  assert.deepEqual([poster.width, poster.height], [1600, 900]);
});
