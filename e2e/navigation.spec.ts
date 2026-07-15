import {test,expect,type Locator} from "@playwright/test";

async function activate(locator:Locator,projectName:string){
  if(projectName==="mobile"){await locator.tap();return;}
  await locator.click();
}

test("primary institutional pages load without horizontal overflow",async({page})=>{
  for(const route of ["/","/research","/portfolio-dashboard","/mistake-journal","/deal-lab","/real-estate","/python-lab","/recruiter","/contact"]){
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  }
});

test("educational disclosure is globally visible",async({page})=>{
  await page.goto("/");
  await expect(page.getByText("Educational Disclosure:",{exact:true})).toBeVisible();
  await expect(page.getByText("The information on Luna1 Research is provided for educational and informational purposes only.",{exact:false})).toBeVisible();
});

test("institutional navigation exposes the requested workspaces",async({page},testInfo)=>{
  await page.goto("/");
  if(testInfo.project.name!=="desktop")await activate(page.getByRole("button",{name:"Open navigation menu"}),testInfo.project.name);
  const navigation=page.getByRole("navigation",{name:testInfo.project.name==="desktop"?"Primary navigation":"Mobile navigation"});
  for(const label of ["Research","Portfolio","Deal Lab","Real Estate","Python Lab","Mistake Journal","About","Recruiter View"]){
    await expect(navigation.getByRole("link",{name:new RegExp(label)})).toBeVisible();
  }
});

test("theme control preserves a high-trust light and dark system",async({page})=>{
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  await page.getByRole("button",{name:"Switch to light theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","light");
  await page.getByRole("button",{name:"Switch to dark theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
});

test("brand assets page exposes working downloads",async({page,request})=>{
  await page.goto("/brand");
  await expect(page.getByRole("heading",{name:"Brand Assets"})).toBeVisible();
  const links=page.locator("a[download]");
  await expect(links).toHaveCount(10);
  for(const href of await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")))){
    expect(href).toBeTruthy();
    expect((await request.get(href!)).ok(),`${href} should download`).toBeTruthy();
  }
  const first=await page.locator(".brand-card").nth(0).boundingBox();
  expect(first).not.toBeNull();
  expect(first!.x+first!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await expect(page.getByRole("link",{name:/Download Brand Kit/})).toBeVisible();
});

test("Deal Lab exposes its transaction workspace and downloads",async({page,request})=>{
  await page.goto("/deal-lab");
  await expect(page.getByRole("heading",{name:/transaction room/i})).toBeVisible();
  await expect(page.getByRole("tab",{name:"Company Valuation"})).toBeVisible();
  await page.getByRole("tab",{name:"Model Downloads"}).click();
  const first=page.locator("a[download]").first();
  await expect(first).toBeVisible();
  const href=await first.getAttribute("href");
  expect((await request.get(href!)).ok()).toBeTruthy();
});

test("contact form and endpoint validate",async({page,request})=>{
  await page.goto("/contact");
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Subject")).toBeVisible();
  await expect(page.getByRole("button",{name:"Request connection"})).toBeVisible();
  const invalid=await request.post("/api/contact",{data:{name:"Research Visitor",email:"not-an-email",subject:"Research discussion",message:"I would like to discuss the educational research methodology."}});
  expect(invalid.status()).toBe(400);
  const spam=await request.post("/api/contact",{data:{name:"Research Visitor",email:"visitor@example.com",subject:"Research discussion",message:"I would like to discuss the educational research methodology.",website:"https://spam.example"}});
  expect(spam.ok()).toBeTruthy();
});

test("contact form does not report success when email delivery is unconfigured",async({page},testInfo)=>{
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Research Visitor");
  await page.getByLabel("Email").fill("visitor@example.com");
  await page.getByLabel("Organization").fill("Example Organization");
  await page.getByLabel("Subject").fill("Research discussion");
  await page.getByLabel("Message").fill("I would like to discuss the educational research methodology.");
  await activate(page.getByRole("button",{name:"Request connection"}),testInfo.project.name);
  await expect(page.locator(".contact-form").getByRole("alert")).toContainText("could not be sent");
  await expect(page.getByText("Thank you. Your message has been sent.")).toHaveCount(0);
});

test("contact endpoint rate-limits repeated submissions",async({request},testInfo)=>{
  const data={name:"Rate Limit Test",email:"rate-limit@example.com",subject:"Rate limit validation",message:"This safe automated message verifies the contact endpoint rate limit."};
  const testIp=testInfo.project.name==="mobile"?"198.51.100.43":testInfo.project.name==="tablet"?"198.51.100.44":"198.51.100.42";
  for(let attempt=0;attempt<5;attempt++)expect((await request.post("/api/contact",{data,headers:{"x-forwarded-for":testIp}})).status()).toBe(503);
  const limited=await request.post("/api/contact",{data,headers:{"x-forwarded-for":testIp}});
  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBeTruthy();
});

test("recruiter view combines founder profile and downloadable credentials",async({page})=>{
  await page.goto("/recruiter");
  await expect(page.getByText("Shy Lee · Founder")).toBeVisible();
  await expect(page.getByAltText("Portrait of Shy Lee, founder of Luna1 Research")).toBeVisible();
  await expect(page.getByText("Infrastructure, Compounders, Inflections, Bottle Neck Constraint Analysis")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Analysis grounded in accountable execution."})).toBeVisible();
  await expect(page.getByText("Microsoft Excel").locator("..")).toContainText("Completed");
  await expect(page.getByRole("heading",{name:"A repeatable structure for evidence and risk."})).toBeVisible();
  await expect(page.getByRole("link",{name:/Download Profile/})).toBeVisible();
});

test("real-estate scenarios expose coverage and refinance discipline",async({page})=>{
  await page.goto("/real-estate");
  await expect(page.getByText("BRRR analysis · Sample")).toBeVisible();
  await expect(page.getByText("DSCR sensitivity · Sample")).toBeVisible();
  await expect(page.getByText("Refinance scenarios · Sample")).toBeVisible();
  await expect(page.getByText("Sample educational underwriting only.",{exact:false})).toBeVisible();
});

test("watchlist displays approved research detail without overflow",async({page},testInfo)=>{
  await page.goto("/portfolios");
  await activate(page.getByRole("tab",{name:"Research Priority"}),testInfo.project.name);
  for(const ticker of ["AIPO","GLW","STRL","ALAB","JBL","RY","PANW","PDFS","ANET","WWD","AMAT","GS"])await expect(page.getByText(ticker,{exact:true}).first()).toBeVisible();
  await expect(page.getByLabel("LUNA Score 95 out of 100")).toBeVisible();
  await expect(page.getByText("Arista Networks is a leading AI and cloud-networking business",{exact:false})).toBeVisible();
  await expect(page.getByText("Accelerating Ethernet-based AI networking",{exact:false})).toBeVisible();
  await expect(page.getByText("Hyperscaler concentration, competition",{exact:false})).toBeVisible();
  if(testInfo.project.name==="mobile"){
    const row=page.locator(".watchlist-table tbody tr").first();
    await expect.poll(()=>row.evaluate(element=>getComputedStyle(element).display)).toBe("block");
    const box=await row.boundingBox();expect(box).not.toBeNull();expect(box!.x+box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
});

test("portfolio performance reuses the disclosed analytical view",async({page},testInfo)=>{
  await page.goto("/portfolio-dashboard");
  await activate(page.getByRole("tab",{name:"Performance"}),testInfo.project.name);
  await expect(page.getByText("Illustrative, manually entered data.",{exact:false})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Benchmark comparison"})).toBeVisible();
});

test("opens the JBL investment-committee decision review",async({page},testInfo)=>{
  await page.goto("/mistake-journal");
  await expect(page.getByText("Jabil Inc.")).toBeVisible();
  await activate(page.getByRole("button",{name:"View Review"}),testInfo.project.name);
  await expect(page.getByRole("dialog",{name:/JBL/})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Final Assessment"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Before Rule / After Rule"})).toBeVisible();
  await activate(page.getByRole("button",{name:"Close JBL decision review"}),testInfo.project.name);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("filters Mistake Journal decisions",async({page},testInfo)=>{
  await page.goto("/mistake-journal");
  await page.getByLabel("Classification").selectOption("Failed Thesis");
  await expect(page.getByRole("status")).toContainText("no decisions");
  await activate(page.getByRole("button",{name:"Reset filters"}).first(),testInfo.project.name);
  await expect(page.getByText("Jabil Inc.")).toBeVisible();
});

test("commercial remains outside the public experience",async({page,request})=>{
  await page.goto("/");
  await expect(page.getByText("Luna1 cinematic teaser",{exact:false})).toHaveCount(0);
  expect((await request.get("/commercial")).status()).toBe(404);
});

test("reduced motion disables the prism sweep",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expect(page.locator(".prism-signature")).toBeVisible();
  await expect.poll(()=>page.locator(".prism-signature").evaluate(element=>getComputedStyle(element,"::after").display)).toBe("none");
});
