import type { Metadata } from "next";
import Resume from "@/app/resume/page";

export const metadata:Metadata={title:"Recruiter View",description:"Executive profile, experience, education, investment research, analytical projects, and downloadable credentials for Shy Lee."};
export default function RecruiterView(){return <Resume/>}
