import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer, Navbar } from "@/components/site";
import "./globals.css";
const sans=Geist({variable:"--font-sans",subsets:["latin"]});const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
export const viewport:Viewport={width:"device-width",initialScale:1,colorScheme:"dark light",themeColor:[{media:"(prefers-color-scheme: dark)",color:"#0d0f0f"},{media:"(prefers-color-scheme: light)",color:"#f2f0e9"}]};
export const metadata:Metadata={metadataBase:new URL("https://luna1-research.vercel.app"),title:{default:"Luna1 Research",template:"%s | Luna1 Research"},description:"Institutional-quality independent investment research by Shyheim Lee.",applicationName:"Luna1 Research",category:"finance",robots:{index:true,follow:true},authors:[{name:"Shyheim Lee",url:"https://www.linkedin.com/in/shyheim-lee/"}],openGraph:{type:"website",siteName:"Luna1 Research",locale:"en_US",url:"/",title:"Luna1 Research",description:"Business fundamentals, valuation, institutional sponsorship, and technical structure.",images:[{url:"/brand/luna1-social-card.png",width:1200,height:630,alt:"Luna1 Research"}]},twitter:{card:"summary_large_image",title:"Luna1 Research",description:"Independent investment research by Shyheim Lee.",images:["/brand/luna1-social-card.png"]}};
const schema={"@context":"https://schema.org","@type":"WebSite","name":"Luna1 Research","description":"Independent educational investment research by Shyheim Lee."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><a className="skip-link" href="#main-content">Skip to main content</a><Navbar/><main id="main-content" tabIndex={-1}>{children}</main><Footer/>{process.env.VERCEL&&<><Analytics/><SpeedInsights/></>}</body></html>}
