import { Polar } from "@polar-sh/sdk";
import { requireEnv, serverEnv } from "./env";

let client: Polar | null = null;

/** Lazily-constructed Polar client (server-only). */
export function getPolar(): Polar {
  if (client) return client;
  const server = serverEnv("POLAR_SERVER") === "sandbox" ? "sandbox" : "production";
  client = new Polar({
    accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
    server,
  });
  return client;
}

export function getPolarProductId(): string {
  return requireEnv("POLAR_PRODUCT_ID");
}
