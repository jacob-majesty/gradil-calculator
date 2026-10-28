import { existsSync } from "node:fs";
import { join } from "node:path";
import express, { type NextFunction, type Request, type Response } from "express";
import type { OrderRepository } from "./db.js";
import {
  COLORS,
  PANEL_LENGTH,
  SCREWS_PER_POST,
  calculateFence,
  heightOptions,
} from "./domain/calculation.js";
import { parseConfirmed, parseFenceInput, ValidationError } from "./domain/validation.js";

export function createApp(repo: OrderRepository, publicDir?: string) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/options", (_req, res) => {
    res.json({
      heights: heightOptions(),
      colors: COLORS,
      panelLength: PANEL_LENGTH,
      screwsPerPost: SCREWS_PER_POST,
    });
  });

  app.post("/api/orders", (req, res) => {
    const input = parseFenceInput(req.body);
    const confirmed = parseConfirmed(req.body);
    const result = calculateFence(input);
    const order = confirmed ? repo.save(input) : null;

    res.status(confirmed ? 201 : 200).json({ result, order });
  });

  app.get("/api/orders", (_req, res) => {
    res.json({ orders: repo.list() });
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
  });

  if (publicDir && existsSync(publicDir)) {
    app.use(express.static(publicDir));
    app.get("*", (_req, res) => {
      res.sendFile(join(publicDir, "index.html"));
    });
  }

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Corpo da requisição inválido." });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  });

  return app;
}
