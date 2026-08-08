import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const routes = [
  "src/app/page.tsx",
  "src/app/analyst-journal/page.tsx",
  "src/app/transaction-intelligence/page.tsx",
  "src/app/login/page.tsx",
  "src/app/about/page.tsx",
  "src/app/investment-philosophy/page.tsx",
  "src/app/luna1-framework/page.tsx",
  "src/app/research/page.tsx",
  "src/app/portfolio/page.tsx",
  "src/app/portfolio/mistake-journal/page.tsx",
  "src/app/portfolios/page.tsx",
  "src/app/market-commentary/page.tsx",
  "src/app/valuation-models/page.tsx",
  "src/app/certifications/page.tsx",
  "src/app/resume/page.tsx",
  "src/app/recruiter/page.tsx",
  "src/app/contact/page.tsx",
];

test("required routes and educational disclosure exist", () => {
  for (const path of routes) assert.ok(fs.existsSync(path), path);
  const footer = fs.readFileSync("src/components/site.tsx", "utf8");
  assert.match(footer, /Educational Disclosure:/);
  assert.match(footer, /not investment,\s+financial, tax, or legal advice/);
  assert.match(
    footer,
    /Always conduct your own research before\s+making investment decisions/,
  );
});

test("Klyro login preview uses trust messaging without claiming live security", () => {
  const login = fs.readFileSync("src/app/login/page.tsx", "utf8");
  assert.match(login, /Your business\. Your books\. Your control\./);
  assert.match(login, /is being designed to protect each business workspace/);
  assert.match(login, /Customer authentication is not active yet/);
  assert.match(login, /does not\s+collect credentials/);
  assert.doesNotMatch(login, /type="password"/);
});

test("public source excludes private contact details", () => {
  const files = [
    ...routes,
    "src/app/layout.tsx",
    "src/components/site.tsx",
    "src/app/api/contact/route.ts",
  ];
  const source = files.map((path) => fs.readFileSync(path, "utf8")).join("\n");
  for (const forbidden of [
    "leeshyheim@yahoo.com",
    "mailto:",
    "92123",
    "Escondido",
    "San Diego",
    "(302) 344-9724",
  ])
    assert.ok(!source.includes(forbidden), `found private value: ${forbidden}`);
});

test("contact delivery stays server-side and includes abuse controls", () => {
  const route = fs.readFileSync("src/app/api/contact/route.ts", "utf8");
  const form = fs.readFileSync(
    "src/components/validated-contact-form.tsx",
    "utf8",
  );
  const schema = fs.readFileSync("src/lib/contact-schema.ts", "utf8");
  for (const value of [
    "process.env.RESEND_API_KEY",
    "process.env.CONTACT_DESTINATION",
    "replyTo:parsed.data.email",
    "enforceRateLimit",
    "parsed.data.website",
  ])
    assert.ok(route.includes(value), `missing contact route control: ${value}`);
  for (const field of ["name", "email", "subject", "message", "website"])
    assert.ok(
      schema.includes(`${field}:`),
      `missing contact schema field: ${field}`,
    );
  assert.ok(form.includes('type="email"'));
  assert.ok(form.includes("aria-busy={isSubmitting}"));
  assert.ok(!form.includes("RESEND_API_KEY"));
  assert.ok(!form.includes("CONTACT_DESTINATION"));
});

test("public research branding uses Luna1 while Klyro remains a separate product", () => {
  const sourceFiles = [
    ...routes,
    "src/app/research/[slug]/page.tsx",
    "src/app/layout.tsx",
    "src/components/site.tsx",
    "src/components/luxury.tsx",
    "src/lib/data.ts",
    "src/app/globals.css",
    "src/app/luxury.css",
  ];
  const source = sourceFiles
    .map((path) => fs.readFileSync(path, "utf8"))
    .join("\n");
  assert.doesNotMatch(source, /Prism Research/i);
  assert.match(source, /Luna1 Research/);
  assert.match(source, /className="prism-core">\s*<span>L1<\/span>/);
  assert.match(source, /label: "Klyro"/);
  assert.match(source, /href: "\/klyro"/);
});

test("founder card and portrait appear on the resume", () => {
  const about = fs.readFileSync("src/app/about/page.tsx", "utf8");
  const resume = fs.readFileSync("src/app/resume/page.tsx", "utf8");
  assert.doesNotMatch(about, /shyheim-lee-founder.jpeg/);
  assert.match(resume, /portraitSrc = "\/shyheim-lee-founder.jpeg"/);
  assert.match(resume, /alt="Portrait of Shy Lee, founder of Luna1 Research"/);
  assert.match(
    resume,
    /Infrastructure, Compounders, Inflections, Bottle Neck\s+Constraint\s+Analysis/,
  );
  assert.ok(fs.existsSync("public/shyheim-lee-founder.jpeg"));
});

test("resume reflects the current investment-focused source document", () => {
  const resume = fs.readFileSync("src/app/resume/page.tsx", "utf8").replace(/\s+/g, " ");
  for (const content of [
    "Data Center Operations Technician / NOC Technician",
    "VMware virtualized environments",
    "more than $10 million",
    "Advanced Finance Coursework",
    "Aztec Investment Fund – Equity Research &amp; Portfolio Management",
    "Financial statement analysis",
    "Budgeting and forecasting",
    "Account reconciliation",
  ])
    assert.ok(resume.includes(content), `missing resume content: ${content}`);
  for (const privateValue of ["(302) 344-9724", "leeshyheim@yahoo.com"])
    assert.ok(
      !resume.includes(privateValue),
      `found private resume value: ${privateValue}`,
    );
});

test("market commentary is hidden without deleting its archived routes", () => {
  const data = fs.readFileSync("src/lib/data.ts", "utf8");
  const home = fs.readFileSync("src/app/page.tsx", "utf8");
  assert.ok(!data.includes('label: "Market Commentary"'));
  assert.ok(!home.includes("Market journal"));
  assert.ok(fs.existsSync("src/app/market-commentary/page.tsx"));
  assert.ok(fs.existsSync("src/app/market-commentary/[slug]/page.tsx"));
});

test("portfolio reflects approved public positions", () => {
  const source = fs.readFileSync("src/app/portfolios/page.tsx", "utf8").replace(/\s+/g, "");
  const activeSource = source.slice(
    source.indexOf("constactivePositions"),
    source.indexOf("constcoreAllocation"),
  );
  for (const ticker of ["WWD", "AMAT", "GS", "PDFS", "PANW"])
    assert.ok(
      !activeSource.includes(`ticker:\"${ticker}\"`),
      `${ticker} remains active`,
    );
  for (const [ticker, price] of [
    ["CASY", "824.0"],
    ["WELL", "237.21"],
  ]) {
    assert.ok(
      activeSource.includes(`ticker:\"${ticker}\"`),
      `${ticker} is missing`,
    );
    assert.ok(
      activeSource.includes(`entryPrice:${price}`),
      `${ticker} entry price is missing`,
    );
  }
  assert.match(activeSource, /ticker:"ANET"/);
  assert.match(activeSource, /entryPrice:null/);
  assert.match(source, /Notpubliclydisclosed/);
  assert.doesNotMatch(activeSource, /Researchneeded/);
  assert.match(activeSource, /thesisStatus:"Thesisunderreview"/);
  assert.match(activeSource, /status:"Monitoring"/);
  assert.match(
    activeSource,
    /ANETmovedfromtheWatchlistintoActivePositions/,
  );
  for (const heading of [
    "Shares",
    "Cost basis",
    "Current price",
    "Unrealized return",
    "Position size",
  ])
    assert.ok(!source.includes(`<th>${heading}</th>`));
  assert.ok(!source.includes("Closed Positions"));
  assert.match(source, /ticker:"AAPL"/);
});

test("watchlist matches the approved research records", () => {
  const source = fs.readFileSync("src/lib/watchlist-data.ts", "utf8");
  for (const [ticker, score] of [
    ["GLW", 91],
    ["STRL", 89],
    ["ALAB", 88],
    ["JBL", 87],
    ["RY", 84],
  ]) {
    assert.ok(
      new RegExp(`ticker:\\s*\"${ticker}\"`).test(source),
      `${ticker} is missing from the watchlist`,
    );
    assert.match(
      source,
      new RegExp(`ticker:\\s*\"${ticker}\"[\\s\\S]{0,180}?score:\\s*${score}`),
      `${ticker} score is missing`,
    );
  }
  for (const field of ["note:", "catalyst:", "risk:"])
    assert.equal(
      source.match(new RegExp(field, "g"))?.length,
      7,
      `each record should include ${field}`,
    );
  for (const removed of ["AMAT", "WWD", "PDFS", "GS", "PANW", "ANET", "AIPO"])
    assert.ok(!source.includes(`ticker: "${removed}"`));
  for (const ticker of [
    "ROAD",
    "EVR",
    "VICR",
    "VIAV",
    "ROK",
    "ADPT",
    "AMKR",
    "TECH",
    "ATRO",
    "MRCY",
    "AYI",
    "HOOD",
    "HLT",
    "AGX",
    "CRDO",
  ])
    assert.ok(
      !source.includes(`ticker:\"${ticker}\"`),
      `${ticker} remains on the watchlist`,
    );
});

test("homepage uses the restrained prism without restoring the removed price arrow", () => {
  const home = fs.readFileSync("src/app/page.tsx", "utf8");
  const prism = fs.readFileSync("src/components/luxury.tsx", "utf8");
  assert.match(home, /PrismSignature/);
  assert.match(prism, /MARKET PRICE/);
  assert.ok(!home.includes("PRICE <b>→<\/b>"));
});

test("long-term portfolio allocations are complete", () => {
  const source = fs.readFileSync("src/app/portfolios/page.tsx", "utf8").replace(/\s+/g, "");
  for (const [ticker, allocation] of [
    ["VOO", "30%"],
    ["QQQM", "50%"],
    ["IAU", "10%"],
    ["AIPO", "9%"],
    ["SGOV", "1%"],
    ["LLY", "25%"],
    ["AAPL", "20%"],
    ["COST", "20%"],
    ["Private", "15%"],
    ["AMZN", "20%"],
  ])
    assert.match(
      source,
      new RegExp(`ticker:"${ticker}".*?allocation:"${allocation}"`),
      `${ticker} allocation is missing`,
    );
  assert.ok(!source.includes("Average cost"));
  assert.ok(!source.includes('ticker:"SLV"'));
  assert.ok(!source.includes('ticker:"PG"'));
  assert.match(source, /SpaceExplorationTechnologiesCorp\.\(SpaceX\)/);
  assert.match(source, /investmentthesiscentersonStarlink/);
  assert.match(source, /Notpubliclytraded/);
});

test("equity research uses the canonical research route", () => {
  const data = fs.readFileSync("src/lib/data.ts", "utf8");
  assert.match(data, /label: "Equity Research", href: "\/research"/);
  assert.ok(!data.includes("/equity-research"));
  assert.ok(!fs.existsSync("src/app/equity-research"));
});

test("portfolio hides performance while preserving tested calculations", () => {
  const page = fs.readFileSync("src/app/portfolios/page.tsx", "utf8");
  const component = fs.readFileSync(
    "src/components/portfolio-dashboard.tsx",
    "utf8",
  );
  assert.ok(!page.includes('"Performance"'));
  assert.ok(!page.includes("<PortfolioPerformance"));
  assert.match(component, /export function PortfolioPerformance/);
  assert.match(
    component,
    /annualizedSharpe, cumulativeReturn, maxDrawdown, sortinoRatio/,
  );
});

test("homepage omits the retired overview modules", () => {
  const page = fs.readFileSync("src/app/page.tsx", "utf8");
  for (const section of [
    "Featured Research",
    "Evidence before opinion.",
    "Career and Credentials",
    "Portfolio · Latest Decision Review",
    "Portfolio Snapshot",
    "Current Areas of Focus",
  ])
    assert.ok(!page.includes(section), `homepage still includes: ${section}`);
});

test("temporarily hidden navigation pages remain available", () => {
  const data = fs.readFileSync("src/lib/data.ts", "utf8");
  assert.ok(!data.includes('label: "Financial Models"'));
  assert.ok(!data.includes('label: "Market Commentary"'));
  assert.ok(fs.existsSync("src/app/financial-models/page.tsx"));
  assert.ok(fs.existsSync("src/app/market-commentary/page.tsx"));
});

test("resume powers a dedicated recruiter view with privacy-safe downloads", () => {
  const source = fs.readFileSync("src/app/resume/page.tsx", "utf8");
  const recruiter = fs.readFileSync("src/app/recruiter/page.tsx", "utf8");
  const actions = fs.readFileSync(
    "src/components/recruiter-actions.tsx",
    "utf8",
  );
  for (const section of [
    "Professional summary",
    "Experience",
    "Education",
    "Certifications",
    "Investment philosophy",
  ])
    assert.ok(source.includes(section), `missing resume section: ${section}`);
  for (const removed of [
    "Businesses worth understanding.",
    "Valuation with visible assumptions.",
    "Klyro Framework",
    "Conviction made accountable.",
    "Portfolio · Mistake Journal",
    "A career built across finance and operations.",
    "Start a professional conversation.",
    "Transaction Intelligence",
  ])
    assert.ok(!source.includes(removed), `removed resume content remains: ${removed}`);
  assert.match(
    source,
    /A thesis is not a story to defend\. It is a hypothesis to update as\s+evidence changes\./,
  );
  assert.match(
    source,
    /Start with business change\. Test it through earnings, competitive\s+position, institutional recognition, valuation, technical structure,\s+and explicit risk rules\./,
  );
  assert.match(recruiter, /RecruiterView/);
  assert.match(recruiter, /ResumeContent/);
  assert.match(recruiter, /portraitSrc="\/shyheim-lee-recruiter-headshot-1080.jpg"/);
  assert.ok(fs.existsSync("public/shyheim-lee-recruiter-headshot-1080.jpg"));
  assert.match(actions, /Download Profile/);
  assert.match(actions, /Data center evidence/);
  assert.ok(!source.includes("FMVA"));
  assert.match(source, /Microsoft Excel<\/b>\s*<span>\s*Completed/);
  for (const file of [
    "public/downloads/shy-lee-resume.pdf",
    "public/downloads/shy-lee-one-page-profile.pdf",
    "public/downloads/shyheim-lee-data-center-finance-evidence-sheet.pdf",
  ])
    assert.ok(fs.existsSync(file), `missing download: ${file}`);
});

test("quiet-luxury tokens and permanent navigation are centralized", () => {
  const data = fs.readFileSync("src/lib/data.ts", "utf8");
  const styles = fs.readFileSync("src/app/luxury.css", "utf8");
  for (const label of [
    "Home",
    "Equity Research",
    "Valuation Lab",
    "Klyro",
    "Portfolio Lab",
    "Analyst Journal",
    "Recruiter View",
    "Contact",
    "Development Log",
  ])
    assert.ok(
      data.includes(`label: "${label}"`),
      `missing navigation item: ${label}`,
    );
  for (const retired of [
    "Deal Lab",
    "Real Estate",
    "Python Lab",
    "Mistake Journal",
  ])
    assert.ok(
      !data.includes(`label: "${retired}"`),
      `retired top-level navigation remains: ${retired}`,
    );
  assert.ok(fs.existsSync("src/app/research/page.tsx"));
  assert.ok(fs.existsSync("src/app/analyst-journal/page.tsx"));
  for (const token of [
    "--charcoal:",
    "--graphite:",
    "--ivory:",
    "--gold:",
    "--platinum:",
    "--emerald:",
    "--burgundy:",
    "--font-serif",
  ])
    assert.ok(styles.includes(token), `missing luxury token: ${token}`);
});

test("recruiter-facing architecture documents analyst process without fabricated precision", () => {
  const profile = fs.readFileSync(
    "src/lib/professional-profile.ts",
    "utf8",
  );
  const home = fs.readFileSync("src/app/page.tsx", "utf8");
  const recruiter = fs.readFileSync("src/app/resume/page.tsx", "utf8");
  const portfolio = fs.readFileSync(
    "src/app/portfolios/page.tsx",
    "utf8",
  );
  for (const pillar of [
    "Equity Research",
    "Valuation Lab",
    "Klyro",
    "Portfolio Lab",
    "Analyst Journal",
    "Development Log",
  ])
    assert.ok(profile.includes(`title: "${pillar}"`), `missing pillar: ${pillar}`);
  for (const stage of [
    "Military",
    "Supply Chain",
    "Financial Accountability",
    "Accounting",
    "Data Center Operations",
    "Finance",
    "Investment Research",
    "Investment & Strategy",
  ])
    assert.ok(profile.includes(`stage: "${stage}"`), `missing stage: ${stage}`);
  assert.match(home, /professionalPositioning/);
  assert.match(recruiter, /Why hire me\?/);
  assert.match(recruiter, /Luna1 is a professional research portfolio/);
  for (const field of [
    "valuation",
    "thesisStatus",
    "whatChanged",
  ])
    assert.ok(portfolio.includes(field), `missing portfolio field: ${field}`);
  assert.doesNotMatch(portfolio, /positionSize|Position size/);
  assert.doesNotMatch(portfolio, /purchaseDate|Purchase date/);
  assert.match(portfolio, /Not publicly disclosed/);
});

test("retired expanded sections are absent and Mistake Journal belongs to Portfolio", () => {
  for (const path of [
    "src/app/deal-lab/page.tsx",
    "src/app/python-lab/page.tsx",
    "src/app/real-estate/page.tsx",
    "src/components/deal-lab.tsx",
    "src/lib/deal-lab.ts",
    "src/lib/lab-data.ts",
    "tests/deal-lab.test.mjs",
    "public/downloads/deal-lab/dcf-model.csv",
  ])
    assert.ok(!fs.existsSync(path), `retired product remains: ${path}`);
  assert.ok(fs.existsSync("src/app/portfolio/mistake-journal/page.tsx"));
  const redirects = fs.readFileSync("next.config.ts", "utf8");
  assert.match(
    redirects,
    /source:\s*"\/mistake-journal",\s*destination:\s*"\/portfolio\/mistake-journal",\s*permanent:\s*true/,
  );
  const home = fs.readFileSync("src/app/page.tsx", "utf8");
  for (const retired of [
    "Deal Lab Preview",
    "Real Estate Preview",
    "Python Lab Preview",
    "/deal-lab",
    "/real-estate",
    "/python-lab",
  ])
    assert.ok(
      !home.includes(retired),
      `retired homepage promotion remains: ${retired}`,
    );
});

test("certification roadmap marks Excel complete and removes FMVA", () => {
  const source = fs.readFileSync("src/app/certifications/page.tsx", "utf8");
  assert.match(source, /\[\"Microsoft Excel\",\"Microsoft\",\"Completed\"/);
  assert.ok(!source.includes("FMVA"));
});
