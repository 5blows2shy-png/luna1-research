"use client";

import { useId, useState, type ReactNode } from "react";

type SectionDisclosureProps = {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function SectionDisclosure({ id, number, title, children, defaultOpen = false }: SectionDisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return <section id={id} className={`section-disclosure${open ? " is-open" : ""}`}>
    <button className="section-disclosure-trigger" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
      <span className="section-disclosure-label"><b>{number}</b>{title}</span>
      <span className="section-disclosure-icon" aria-hidden="true">+</span>
    </button>
    <div id={panelId} className="section-disclosure-grid"><div className="section-disclosure-panel">{children}</div></div>
  </section>;
}
