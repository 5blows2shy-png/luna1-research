import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer, Navbar } from "@/components/site";
import "./globals.css";
import "./luxury.css";
const sans=Geist({variable:"--font-sans",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
const serif=Cormorant_Garamond({variable:"--font-serif",subsets:["latin"],weight:["500","600"]});
export const viewport:Viewport={width:"device-width",initialScale:1,colorScheme:"dark",themeColor:"#090b10"};
export const metadata:Metadata={metadataBase:new URL("https://luna1research.com"),title:{default:"Luna1 Research | Independent Investment Research",template:"%s | Luna1 Research"},description:"Independent research across public markets, capital allocation, and real assets by Shyheim Lee.",applicationName:"Luna1 Research",category:"finance",robots:{index:true,follow:true},authors:[{name:"Shyheim Lee",url:"https://www.linkedin.com/in/shyheim-lee/"}],creator:"Shyheim Lee",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg",apple:"/apple-icon.png"},openGraph:{type:"website",siteName:"Luna1 Research",locale:"en_US",url:"/",title:"Luna1 Research",description:"Disciplined analysis, transparent decision-making, and continuous improvement across public markets and real assets."},twitter:{card:"summary_large_image",title:"Luna1 Research",description:"Independent research across public markets, capital allocation, and real assets."}};
const schema={"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"https://luna1research.com/#website","url":"https://luna1research.com","name":"Luna1 Research","description":"Independent educational investment research across public markets, capital allocation, and real assets."},{"@type":"Person","@id":"https://luna1research.com/#founder","name":"Shyheim Lee","url":"https://luna1research.com/about","jobTitle":"Founder and Investment Researcher","sameAs":["https://www.linkedin.com/in/shyheim-lee/"]}]};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} data-theme="dark" suppressHydrationWarning><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><a className="skip-link" href="#main-content">Skip to main content</a><Navbar/><main id="main-content" tabIndex={-1}>{children}</main><Footer/>{process.env.VERCEL&&<><Analytics/><SpeedInsights/></>}</body></html>}
