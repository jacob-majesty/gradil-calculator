import assert from "node:assert/strict";
import { test } from "node:test";
import { parseConfirmed, parseFenceInput, ValidationError } from "../src/domain/validation.js";

test("aceita uma entrada válida", () => {
  const input = parseFenceInput({
    length: 12.75,
    height: 1.53,
    color: "Preta",
  });

  assert.deepEqual(input, { length: 12.75, height: 1.53, color: "Preta" });
});

test("rejeita comprimentos inválidos", () => {
  for (const length of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "10"]) {
    assert.throws(
      () => parseFenceInput({ length, height: 1.03, color: "Branca" }),
      ValidationError,
    );
  }
});

test("rejeita altura e cor fora das opções", () => {
  assert.throws(
    () => parseFenceInput({ length: 10, height: 1.5, color: "Branca" }),
    ValidationError,
  );
  assert.throws(
    () => parseFenceInput({ length: 10, height: 1.03, color: "Azul" }),
    ValidationError,
  );
});

test("trata a confirmação como opcional e booleana", () => {
  assert.equal(parseConfirmed({}), false);
  assert.equal(parseConfirmed({ confirmed: true }), true);
  assert.equal(parseConfirmed({ confirmed: false }), false);
  assert.throws(() => parseConfirmed({ confirmed: "sim" }), ValidationError);
});
