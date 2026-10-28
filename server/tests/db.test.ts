import assert from "node:assert/strict";
import { test } from "node:test";
import { createOrderRepository } from "../src/db.js";

test("salva pedidos confirmados e lista os mais recentes primeiro", () => {
  const repo = createOrderRepository(":memory:");

  try {
    const first = repo.save({ length: 5, height: 1.03, color: "Branca" });
    const second = repo.save({ length: 7.5, height: 2.03, color: "Verde" });
    const orders = repo.list();

    assert.equal(first.id, 1);
    assert.equal(second.id, 2);
    assert.equal(orders.length, 2);
    assert.equal(orders[0].id, second.id);
    assert.equal(orders[1].id, first.id);
    assert.equal(orders[0].height, 2.03);
    assert.equal(orders[0].color, "Verde");
    assert.match(orders[0].confirmedAt, /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    repo.close();
  }
});
