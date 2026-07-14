import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const routes=["src/app/page.tsx","src/app/about/page.tsx","src/app/investment-philosophy/page.tsx","src/app/luna1-framework/page.tsx","src/app/research/page.tsx","src/app/portfolios/page.tsx","src/app/market-commentary/page.tsx","src/app/valuation-models/page.tsx","src/app/certifications/page.tsx","src/app/resume/page.tsx","src/app/contact/page.tsx"];

test("required routes and educational disclosure exist",()=>{for(const path of routes)assert.ok(fs.existsSync(path),path);const footer=fs.readFileSync("src/components/site.tsx","utf8");assert.match(footer,/Educational Disclosure:/);assert.match(footer,/not investment, financial, tax, or legal advice/);assert.match(footer,/Always conduct your own research before making investment decisions/)});

test("public source excludes private contact details",()=>{const files=[...routes,"src/app/layout.tsx","src/components/site.tsx","src/app/api/contact/route.ts"];const source=files.map(path=>fs.readFileSync(path,"utf8")).join("\n");for(const forbidden of ["leeshyheim@yahoo.com","mailto:","92123","Escondido","San Diego","(302) 344-9724"])assert.ok(!source.includes(forbidden),`found private value: ${forbidden}`)});

test("public branding uses Luna1 exclusively",()=>{const sourceFiles=[...routes,"src/app/research/[slug]/page.tsx","src/app/layout.tsx","src/components/site.tsx","src/lib/data.ts","src/app/globals.css"];const source=sourceFiles.map(path=>fs.readFileSync(path,"utf8")).join("\n");assert.doesNotMatch(source,/prism/i);assert.match(source,/Luna1/);assert.match(source,/className="luna-shape">L</)});

test("portfolio reflects approved public positions",()=>{const source=fs.readFileSync("src/app/portfolios/page.tsx","utf8");for(const ticker of ["WWD","AMAT","GS","PDFS"])assert.ok(!source.includes(`ticker:\"${ticker}\"`),`${ticker} remains active`);assert.match(source,/ticker:\"PANW\"/);assert.match(source,/ticker:\"CASY\"/);assert.ok(!source.includes("Closed Positions"));assert.match(source,/ticker:\"AAPL\"/)});
