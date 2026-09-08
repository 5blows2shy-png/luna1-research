"use client";

import { useState } from "react";
import { capitalEcosystems, connectedCompanyIds, type CapitalEcosystem } from "@/data/setora-relationships";
import styles from "./setora-map.module.css";

function EcosystemMap({ ecosystem, initiallyOpen }: { ecosystem: CapitalEcosystem; initiallyOpen: boolean }) {
  const [focus, setFocus] = useState("all");
  const [depth, setDepth] = useState(2);
  const [selected, setSelected] = useState(ecosystem.id === "robotics" ? "abb" : "nvidia");
  const visibleIds = connectedCompanyIds(ecosystem, focus, depth);
  const companies = ecosystem.companies.filter((company) => visibleIds.has(company.id));
  const relationships = ecosystem.relationships.filter((edge) => visibleIds.has(edge.supplier) && visibleIds.has(edge.customer));
  const selectedCompany = ecosystem.companies.find((company) => company.id === selected);
  const selectedEdges = ecosystem.relationships.filter((edge) => edge.supplier === selected || edge.customer === selected);
  const name = (id: string) => ecosystem.companies.find((company) => company.id === id)?.name ?? id;
  const positions = new Map(companies.map((company) => {
    const column = companies.filter((item) => item.column === company.column);
    return [company.id, { x: 125 + company.column * 280, y: 100 + column.indexOf(company) * (350 / Math.max(column.length - 1, 1)) }] as const;
  }));

  return (
    <details id={ecosystem.id} className={styles.ecosystem} open={initiallyOpen}>
      <summary className={styles.summary}>
        <span><small>CAPITAL ECOSYSTEM</small><strong>{ecosystem.name}</strong></span>
        <span className={styles.summaryMeta}>{ecosystem.companies.length} companies · {ecosystem.relationships.length} documented links <b aria-hidden="true">⌄</b></span>
      </summary>
      <div className={styles.content}>
        <p>{ecosystem.description}</p>
        <ol className={styles.capitalPath} aria-label={ecosystem.name + " capital allocation framework"}>
          {ecosystem.capitalPath.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className={styles.note}>Capital allocation framework above. Map arrows below point from supplier or technology provider to customer or adopter; they do not represent measured money transfers.</p>
        <div className={styles.controls}>
          <label htmlFor={ecosystem.id + "-company"}>Focus company
            <select id={ecosystem.id + "-company"} value={focus} onChange={(event) => { setFocus(event.target.value); if (event.target.value !== "all") setSelected(event.target.value); }}>
              <option value="all">Entire ecosystem</option>
              {ecosystem.companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
            </select>
          </label>
          <label htmlFor={ecosystem.id + "-depth"}>Relationship depth
            <select id={ecosystem.id + "-depth"} value={depth} disabled={focus === "all"} onChange={(event) => setDepth(Number(event.target.value))}>
              <option value={1}>Direct suppliers & customers</option>
              <option value={2}>Include suppliers’ suppliers</option>
              <option value={3}>Up to three connections</option>
            </select>
          </label>
          <span className={styles.legend}>Solid: supply evidence<br />Dashed: partnership, pilot, or announcement</span>
        </div>
        <div className={styles.workspace}>
          <div className={styles.scrollMap} tabIndex={0} role="region" aria-label={ecosystem.name + " supplier and customer map; scroll horizontally on small screens"}>
            <div className={styles.canvas}>
              <div className={styles.columns}><span>UPSTREAM</span><span>COMPONENTS / TECHNOLOGY</span><span>SYSTEMS / INTEGRATORS</span><span>CUSTOMERS / ADOPTERS</span></div>
              <svg viewBox="0 0 1100 540" aria-hidden="true">
                <defs><marker id={ecosystem.id + "-arrow"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
                {relationships.map((edge) => {
                  const start = positions.get(edge.supplier)!;
                  const end = positions.get(edge.customer)!;
                  const highlighted = edge.supplier === selected || edge.customer === selected;
                  return <path key={edge.id} d={`M ${start.x + 94} ${start.y} C ${start.x + 145} ${start.y}, ${end.x - 145} ${end.y}, ${end.x - 99} ${end.y}`} fill="none" className={highlighted ? styles.highlightedEdge : styles.edge} strokeDasharray={edge.kind === "Supply" ? undefined : "6 6"} markerEnd={`url(#${ecosystem.id}-arrow)`} />;
                })}
              </svg>
              {companies.map((company) => {
                const position = positions.get(company.id)!;
                return <button key={company.id} type="button" className={styles.node} style={{ left: position.x, top: position.y }} aria-pressed={selected === company.id} onClick={() => setSelected(company.id)}><strong>{company.name}</strong><small>{company.role}</small></button>;
              })}
            </div>
          </div>
          <aside className={styles.inspector} aria-live="polite">
            <small>SELECTED COMPANY</small><h3>{selectedCompany?.name}</h3><p>{selectedCompany?.role}</p>
            <h4>Direct suppliers / providers</h4>
            <ul>{selectedEdges.filter((edge) => edge.customer === selected).map((edge) => <li key={edge.id}>{name(edge.supplier)} <small>{edge.kind}</small></li>)}</ul>
            {!selectedEdges.some((edge) => edge.customer === selected) && <p>No upstream relationship documented in this dataset.</p>}
            <h4>Customers / adopters</h4>
            <ul>{selectedEdges.filter((edge) => edge.supplier === selected).map((edge) => <li key={edge.id}>{name(edge.customer)} <small>{edge.kind}</small></li>)}</ul>
            {!selectedEdges.some((edge) => edge.supplier === selected) && <p>No downstream relationship documented in this dataset.</p>}
            <p className={styles.note}>Multiple connections indicate company-level paths. They do not prove that the same component is used in every downstream product.</p>
          </aside>
        </div>
        <div className={styles.listHeading}><h3>Supplier & customer relationships</h3><span>{relationships.length} visible relationships</span></div>
        <div className={styles.relationships}>
          {relationships.map((edge) => (
            <details key={edge.id} className={styles.relationship}>
              <summary><span>{name(edge.supplier)} <b aria-hidden="true">→</b> {name(edge.customer)}</span><small>{edge.kind} · View evidence</small></summary>
              <div><p>{edge.description}</p><p><strong>Source date:</strong> {edge.sourceDate}</p><a href={edge.sourceUrl} target="_blank" rel="noreferrer">{edge.sourceTitle} ↗</a></div>
            </details>
          ))}
        </div>
        <p className={styles.note}>Curated public disclosures, not an exhaustive supplier database. Dates describe the source evidence; current contract status, revenue exposure, and transaction amounts are not independently confirmed.</p>
      </div>
    </details>
  );
}

export function SetoraMap() {
  return <div className={styles.maps}>{capitalEcosystems.map((ecosystem, index) => <EcosystemMap key={ecosystem.id} ecosystem={ecosystem} initiallyOpen={index === 0} />)}</div>;
}
