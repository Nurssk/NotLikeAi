import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

let localEnv: Record<string, string> | null = null;

function parseEnvFile(contents: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function readLocalEnv(): Record<string, string> {
  if (localEnv) return localEnv;

  localEnv = {};
  const cwd = process.cwd();
  const candidates = [join(cwd, ".env"), join(cwd, "..", ".env")];

  for (const file of candidates) {
    if (!existsSync(file)) continue;
    localEnv = { ...localEnv, ...parseEnvFile(readFileSync(file, "utf8")) };
  }

  return localEnv;
}

// Server-only env access. On Vercel serverless the runtime reads process.env;
// under `astro dev` / build Astro exposes non-PUBLIC vars via import.meta.env.
// Local runs in this repo may start from astro-landing while secrets live in
// the parent .env, so use that file as a final server-side fallback.
export function serverEnv(key: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[key] : undefined;
  // @ts-expect-error index access on import.meta.env
  return fromProcess ?? import.meta.env?.[key] ?? readLocalEnv()[key];
}

export function requireEnv(key: string): string {
  const value = serverEnv(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}
