"use client";

import { useState } from "react";
import { Score } from "@/components/luna-score";

export function Scorecard() {
  const [values, setValues] = useState([25, 20, 12, 12, 8, 4]);
  const total = values.reduce((a, b) => a + b, 0);
  const labels = [
    "Fundamentals",
    "Technical structure",
    "Institutional behavior",
    "Moat & industry",
    "Catalyst & runway",
    "Risk & entry",
  ];
  const max = [30, 25, 15, 15, 10, 5];
  return (
    <div className="scorecard">
      <div className="score-total">
        <Score score={total} />
        <div>
          <span className="eyebrow">Illustrative ticker · Klyro</span>
          <h3>
            {total >= 90
              ? "Klyro Superleader"
              : total >= 80
                ? "Klyro-A"
                : total >= 70
                  ? "Klyro-B / Inflection Leader"
                  : total >= 60
                    ? "Watchlist"
                    : "Does Not Qualify"}
          </h3>
        </div>
      </div>
      {labels.map((label, index) => (
        <label className="range-row" key={label}>
          <span>{label}</span>
          <input
            aria-label={label}
            type="range"
            min="0"
            max={max[index]}
            value={values[index]}
            onChange={(event) =>
              setValues(
                values.map((value, itemIndex) =>
                  itemIndex === index ? +event.target.value : value,
                ),
              )
            }
          />
          <b>
            {values[index]}/{max[index]}
          </b>
        </label>
      ))}
    </div>
  );
}

export function DcfCalculator() {
  const [rev, setRev] = useState(1200);
  const [growth, setGrowth] = useState(12);
  const [margin, setMargin] = useState(22);
  const [tax, setTax] = useState(21);
  const [discount, setDiscount] = useState(9);
  const [terminal, setTerminal] = useState(3);
  const [shares, setShares] = useState(100);
  const fcf = ((rev * (1 + growth / 100) * margin) / 100) * (1 - tax / 100);
  const ev = (fcf * (1 + terminal / 100)) / (discount / 100 - terminal / 100);
  const per = ev / shares;
  const fields: [
    [string, number, (value: number) => void, string],
    ...Array<[string, number, (value: number) => void, string]>,
  ] = [
    ["Revenue", rev, setRev, "$m"],
    ["Revenue growth", growth, setGrowth, "%"],
    ["Operating margin", margin, setMargin, "%"],
    ["Tax rate", tax, setTax, "%"],
    ["Discount rate", discount, setDiscount, "%"],
    ["Terminal growth", terminal, setTerminal, "%"],
    ["Shares outstanding", shares, setShares, "m"],
  ];
  return (
    <div className="dcf">
      <div className="dcf-inputs">
        {fields.map(([label, value, setter, unit]) => (
          <label key={label}>
            {label}
            <span>
              <input
                type="number"
                value={value}
                onChange={(event) => setter(+event.target.value)}
              />
              <b>{unit}</b>
            </span>
          </label>
        ))}
      </div>
      <div className="dcf-results">
        <span className="eyebrow">Illustrative output</span>
        <div>
          <small>Enterprise value</small>
          <strong>${Math.round(ev).toLocaleString()}m</strong>
        </div>
        <div>
          <small>Equity value*</small>
          <strong>${Math.round(ev).toLocaleString()}m</strong>
        </div>
        <div className="implied">
          <small>Implied value / share</small>
          <strong>${per.toFixed(2)}</strong>
        </div>
        <p>*Assumes zero net debt for this simplified educational model.</p>
      </div>
    </div>
  );
}
