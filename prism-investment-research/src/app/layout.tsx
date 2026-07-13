import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Navbar } from "@/components/site";
import "./globals.css";

const sans=Geist({variable:"--font-sans",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});

export const metadata:Metadata={
  metadataBase:new URL("https://prism-investment-research.pharfromshy.chatgpt.site"),
  title:{default:"Prism Investment Research",template:"%s | Prism"},
  description:"Independent multi-factor investment research by Shy Lee. Price is the result. Prism reveals the causes.",
  authors:[{name:"Shy Lee",url:"https://www.linkedin.com/in/shyheim-lee/"}],
  keywords:["investment research","LUNA Framework","fundamental analysis","equity research"],
  icons:{icon:"/favicon.svg"},
  openGraph:{title:"Prism Investment Research",description:"Independent investment research. Price is the result. Prism reveals the causes.",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"Prism Investment Research",description:"Price is the result. Prism reveals the causes.",images:["/og.png"]}
};

const structuredData={"@context":"https://schema.org","@type":"ProfessionalService","name":"Prism Investment Research","description":"Independent multi-factor investment research by Shy Lee.","url":"https://prism-investment-research.pharfromshy.chatgpt.site","founder":{"@type":"Person","name":"Shy Lee","sameAs":"https://www.linkedin.com/in/shyheim-lee/"}};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/><Navbar/><main>{children}</main><Footer/></body></html>}
