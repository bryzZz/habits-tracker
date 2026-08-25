import { promises as fs } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type { Plugin } from "vite";

const DATA_PATH = path.resolve(process.cwd(), "data/habits-data.json");

function isValidHabitsData(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.habits) && Array.isArray(v.entries);
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

/**
 * Local-only stand-in for the future Supabase backend (ADR-0003/0004):
 * serves and persists the real data/habits-data.json file over a tiny
 * REST-ish API, so the frontend never touches the filesystem directly.
 */
export function localDataApi(): Plugin {
  return {
    name: "local-data-api",
    configureServer(server) {
      server.middlewares.use(
        "/api/habits-data",
        async (req: IncomingMessage, res: ServerResponse) => {
          if (req.method === "GET") {
            try {
              const raw = await fs.readFile(DATA_PATH, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.end(raw);
            } catch {
              res.statusCode = 404;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error:
                    "data/habits-data.json not found — run scripts/extract_seed_data.py first",
                })
              );
            }
            return;
          }

          if (req.method === "PUT") {
            try {
              const body = await readBody(req);
              const parsed: unknown = JSON.parse(body);
              if (!isValidHabitsData(parsed)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "invalid HabitsData shape" }));
                return;
              }
              const tmpPath = `${DATA_PATH}.tmp`;
              await fs.writeFile(
                tmpPath,
                JSON.stringify(parsed, null, 2),
                "utf-8"
              );
              await fs.rename(tmpPath, DATA_PATH);
              res.statusCode = 204;
              res.end();
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
            return;
          }

          res.statusCode = 405;
          res.end();
        }
      );
    },
  };
}
