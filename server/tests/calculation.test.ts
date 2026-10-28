import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FASTENERS_PER_PANEL,
  HEIGHTS,
  PANEL_LENGTH,
  calculateFence,
} from "../src/domain/calculation.js";

test("calcula quantidades para comprimento múltiplo exato do painel", () => {
  const result = calculateFence({ length: 5, height: 1.53, color: "Branca" });

  assert.equal(PANEL_LENGTH, 2.5);
  assert.equal(result.panels, 2);
  assert.equal(result.soldLength, 5);
  assert.equal(result.difference, 0);
  assert.equal(result.posts, 3);
  assert.equal(result.fasteners, 8);
  assert.equal(result.screws, 12);
});

test("arredonda o comprimento vendido para cima e informa a diferença", () => {
  const result = calculateFence({ length: 5.1, height: 2.03, color: "Verde" });

  assert.equal(result.panels, 3);
  assert.equal(result.soldLength, 7.5);
  assert.equal(result.difference, 2.4);
  assert.equal(result.posts, 4);
  assert.equal(result.fasteners, 18);
  assert.equal(result.screws, 16);
  assert.equal(result.color, "Verde");
});

test("atende pedidos menores que um painel", () => {
  const result = calculateFence({ length: 0.1, height: 1.03, color: "Sem pintura" });

  assert.equal(result.panels, 1);
  assert.equal(result.soldLength, 2.5);
  assert.equal(result.difference, 2.4);
  assert.equal(result.posts, 2);
  assert.equal(result.fasteners, 3);
  assert.equal(result.screws, 8);
});

test("omite diferenças menores que um centímetro", () => {
  const result = calculateFence({ length: 7.499999, height: 1.03, color: "Preta" });

  assert.equal(result.soldLength, 7.5);
  assert.equal(result.difference, 0);
});

test("usa a quantidade de fixadores correspondente a cada altura", () => {
  for (const height of HEIGHTS) {
    const result = calculateFence({ length: 2.5, height, color: "Branca" });

    assert.equal(result.fasteners, FASTENERS_PER_PANEL[height]);
  }
});
