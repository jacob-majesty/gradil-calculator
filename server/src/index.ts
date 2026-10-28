import { resolve } from "node:path";
import { createApp } from "./app.js";
import { createOrderRepository } from "./db.js";

const port = Number(process.env.PORT ?? 3000);
const dbPath = process.env.DB_PATH ?? resolve("data", "gradil.db");
const publicDir = resolve("public");

const repo = createOrderRepository(dbPath);
const app = createApp(repo, publicDir);

const server = app.listen(port, () => {
  console.log(`Gradil API disponível em http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    repo.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
