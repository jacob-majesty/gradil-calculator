import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Color, FenceInput, Height } from "./domain/calculation.js";

export interface SavedOrder extends FenceInput {
  id: number;
  confirmedAt: string;
}

export interface OrderRepository {
  save(input: FenceInput): SavedOrder;
  list(): SavedOrder[];
  close(): void;
}

interface OrderRow {
  id: number;
  length: number;
  height: number;
  color: string;
  confirmed_at: string;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    length REAL NOT NULL,
    height REAL NOT NULL,
    color TEXT NOT NULL,
    confirmed_at TEXT NOT NULL
  );
`;

export function createOrderRepository(dbPath: string): OrderRepository {
  const filePath = dbPath === ":memory:" ? dbPath : resolve(dbPath);

  if (filePath !== ":memory:") {
    mkdirSync(dirname(filePath), { recursive: true });
  }

  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(SCHEMA);

  const insertOrder = db.prepare(
    "INSERT INTO orders (length, height, color, confirmed_at) VALUES (?, ?, ?, ?)",
  );
  const listOrders = db.prepare(
    "SELECT id, length, height, color, confirmed_at FROM orders ORDER BY confirmed_at DESC, id DESC",
  );

  return {
    save(input) {
      const confirmedAt = new Date().toISOString();
      const result = insertOrder.run(input.length, input.height, input.color, confirmedAt);

      return {
        id: Number(result.lastInsertRowid),
        ...input,
        confirmedAt,
      };
    },

    list() {
      const rows = listOrders.all() as unknown as OrderRow[];

      return rows.map((row) => ({
        id: row.id,
        length: row.length,
        height: row.height as Height,
        color: row.color as Color,
        confirmedAt: row.confirmed_at,
      }));
    },

    close() {
      db.close();
    },
  };
}
