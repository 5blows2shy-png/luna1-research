import test from "node:test";
import assert from "node:assert/strict";
import {annualizedSharpe,cumulativeReturn,maxDrawdown,sortinoRatio} from "../src/lib/portfolio-metrics.ts";
test("cumulative return compounds",()=>assert.ok(Math.abs(cumulativeReturn([.1,-.05])-.045)<1e-9));
test("maximum drawdown finds peak-to-trough decline",()=>assert.ok(Math.abs(maxDrawdown([100,120,90,130])-.25)<1e-9));
test("risk ratios remain finite for flat or insufficient series",()=>{assert.equal(annualizedSharpe([.01]),0);assert.equal(annualizedSharpe([.01,.01]),0);assert.equal(sortinoRatio([.01,.02]),0)});
