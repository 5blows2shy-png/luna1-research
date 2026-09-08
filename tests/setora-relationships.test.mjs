import test from "node:test";
import assert from "node:assert/strict";
import { capitalEcosystems, connectedCompanyIds } from "../src/data/setora-relationships.ts";

test("relationship traversal separates direct counterparties from upstream suppliers", () => {
  const dc = capitalEcosystems[0];
  const direct = connectedCompanyIds(dc, "aws", 1);
  assert.deepEqual([...direct].sort(), ["aws", "nvidia"]);
  const secondOrder = connectedCompanyIds(dc, "aws", 2);
  assert.ok(secondOrder.has("tsmc"));
  assert.ok(!secondOrder.has("asml"));
  assert.ok(connectedCompanyIds(dc, "aws", 3).has("asml"));
});

test("every displayed relationship resolves to company nodes and primary evidence", () => {
  for (const ecosystem of capitalEcosystems) {
    const ids = new Set(ecosystem.companies.map((company) => company.id));
    assert.equal(ids.size, ecosystem.companies.length);
    for (const edge of ecosystem.relationships) {
      assert.ok(ids.has(edge.supplier));
      assert.ok(ids.has(edge.customer));
      assert.notEqual(edge.supplier, edge.customer);
      assert.ok(edge.sourceUrl.startsWith("https://"));
      assert.ok(edge.description.length > 40);
      assert.ok(edge.sourceDate);
    }
  }
});
