import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer, Navbar } from "@/components/site";
import "./globals.css";
const sans=Geist({variable:"--font-sans",subsets:["latin"]});const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
export const metadata:Metadata={metadataBase:new URL("https://luna1-research.vercel.app"),title:{default:"Luna1 Research",template:"%s | Luna1 Research"},description:"Institutional-quality independent investment research by Shyheim Lee.",authors:[{name:"Shyheim Lee",url:"https://www.linkedin.com/in/shyheim-lee/"}],icons:{icon:"/favicon.svg"},openGraph:{title:"Luna1 Research",description:"Business fundamentals, valuation, institutional sponsorship, and technical structure.",images:["/og.png"]},twitter:{card:"summary_large_image",title:"Luna1 Research",description:"Independent investment research by Shyheim Lee.",images:["/og.png"]}};
const schema={"@context":"https://schema.org","@type":"WebSite","name":"Luna1 Research","description":"Independent educational investment research by Shyheim Lee."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><Navbar/><main>{children}</main><Footer/><Analytics/><SpeedInsights/></body></html>}
