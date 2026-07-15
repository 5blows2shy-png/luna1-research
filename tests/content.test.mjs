import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const routes=["src/app/page.tsx","src/app/about/page.tsx","src/app/investment-philosophy/page.tsx","src/app/luna1-framework/page.tsx","src/app/research/page.tsx","src/app/portfolios/page.tsx","src/app/market-commentary/page.tsx","src/app/valuation-models/page.tsx","src/app/certifications/page.tsx","src/app/resume/page.tsx","src/app/contact/page.tsx"];

test("required routes and disclaimer exist",()=>{for(const path of routes)assert.ok(fs.existsSync(path),path);assert.match(fs.readFileSync("src/components/site.tsx","utf8"),/Nothing on this website constitutes personalized investment advice/)});

test("public source excludes private contact details",()=>{const files=[...routes,"src/app/layout.tsx","src/components/site.tsx","src/app/api/contact/route.ts"];const source=files.map(path=>fs.readFileSync(path,"utf8")).join("\n");for(const forbidden of ["leeshyheim@yahoo.com","mailto:","92123","Escondido","San Diego","(302) 344-9724"])assert.ok(!source.includes(forbidden),`found private value: ${forbidden}`)});

test("public branding uses Luna1 exclusively",()=>{const sourceFiles=[...routes,"src/app/research/[slug]/page.tsx","src/app/layout.tsx","src/components/site.tsx","src/lib/data.ts","src/app/globals.css"];const source=sourceFiles.map(path=>fs.readFileSync(path,"utf8")).join("\n");assert.doesNotMatch(source,/prism/i);assert.match(source,/Luna1/);assert.match(source,/className="luna-shape">L</)});

test("founder card includes Shy Lee portrait",()=>{const source=fs.readFileSync("src/app/about/page.tsx","utf8");assert.match(source,/src="\/shyheim-lee-founder.jpeg"/);assert.match(source,/alt="Portrait of Shy Lee, founder of Luna1 Research"/);assert.ok(fs.existsSync("public/shyheim-lee-founder.jpeg"))});

test("portfolio reflects approved public positions",()=>{const source=fs.readFileSync("src/app/portfolios/page.tsx","utf8");for(const ticker of ["WWD","AMAT","GS","PDFS"])assert.ok(!source.includes(`ticker:\"${ticker}\"`),`${ticker} remains active`);for(const [ticker,price] of [["CASY","824.00"],["PANW","272.54"],["WELL","237.21"]]){assert.ok(source.includes(`ticker:\"${ticker}\"`),`${ticker} is missing`);assert.ok(source.includes(`entryPrice:${price}`),`${ticker} entry price is missing`)}for(const heading of ["Shares","Cost basis","Current price","Unrealized return"])assert.ok(!source.includes(`<th>${heading}</th>`));assert.ok(!source.includes("Closed Positions"));assert.match(source,/ticker:\"AAPL\"/)});

test("long-term portfolio allocations are complete",()=>{const source=fs.readFileSync("src/app/portfolios/page.tsx","utf8");for(const [ticker,allocation] of [["VOO","30%"],["QQQM","50%"],["IAU","10%"],["SLV","9%"],["SGOV","1%"],["LLY","25%"],["AAPL","20%"],["COST","20%"],["PG","15%"],["AMZN","20%"]])assert.match(source,new RegExp(`ticker:\"${ticker}\"[^\\n]+allocation:\"${allocation}\"`),`${ticker} allocation is missing`);assert.ok(!source.includes("Average cost"))});

test("equity research navigation alias is removed",()=>{const data=fs.readFileSync("src/lib/data.ts","utf8");assert.ok(!data.includes("Equity Research"));assert.ok(!data.includes("/equity-research"));assert.ok(!fs.existsSync("src/app/equity-research"))});

test("portfolio dashboard hides the performance tab without removing its reusable component",()=>{const page=fs.readFileSync("src/app/portfolios/page.tsx","utf8");const component=fs.readFileSync("src/components/portfolio-dashboard.tsx","utf8");assert.ok(!page.includes('"Performance"'));assert.ok(!page.includes("<PortfolioPerformance"));assert.match(component,/export function PortfolioPerformance/)});
