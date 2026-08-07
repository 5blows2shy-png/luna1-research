import { permanentRedirect } from "next/navigation";

export default function LegacyKlyroFrameworkPage() {
  permanentRedirect("/klyro");
}
