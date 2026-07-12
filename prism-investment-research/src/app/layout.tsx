import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Navbar } from "@/components/site";
import "./globals.css";
const sans=Geist({variable:"--font-sans",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
export const metadata:Metadata={metadataBase:new URL("https://prism-investment-research.pharfromshy.chatgpt.site"),title:{default:"Prism Investment Research",template:"%s | Prism"},description:"Independent investment research by Shy Lee. Price is the result. Prism reveals the causes.",icons:{icon:"/favicon.svg"},openGraph:{title:"Prism Investment Research",description:"Price is the result. Prism reveals the causes.",images:["/og.png"]},twitter:{card:"summary_large_image",title:"Prism Investment Research",description:"Price is the result. Prism reveals the causes.",images:["/og.png"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><Navbar/><main>{children}</main><Footer/></body></html>}
