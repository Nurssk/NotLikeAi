import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;

// Bearer-token APIs are called cross-origin by the Chrome extension.
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function json(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

/** 6-char A–Z0–9 one-time code (crypto-random). */
export function generateCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return out;
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlJson(obj: unknown): string {
  return base64url(JSON.stringify(obj));
}

export interface SessionPayload {
  typ: "extension-session";
  sub: string; // firebase uid
  email: string;
  emailKey: string;
  iat: number;
  exp: number;
}

/** Sign a compact HS256 session token (JWT-like), server-only. */
export function signSessionToken(
  payload: Omit<SessionPayload, "typ" | "iat" | "exp">,
  secret: string
): { token: string; expiresInSeconds: number } {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_TTL_SECONDS;
  const full: SessionPayload = { typ: "extension-session", ...payload, iat, exp };
  const header = base64urlJson({ alg: "HS256", typ: "JWT" });
  const body = base64urlJson(full);
  const signature = base64url(
    createHmac("sha256", secret).update(`${header}.${body}`).digest()
  );
  return { token: `${header}.${body}.${signature}`, expiresInSeconds: SESSION_TTL_SECONDS };
}

/** Verify + decode a session token. Returns null on any failure. */
export function verifySessionToken(
  token: string,
  secret: string
): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = base64url(
    createHmac("sha256", secret).update(`${header}.${body}`).digest()
  );
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    ) as SessionPayload;
    if (payload.typ !== "extension-session") return null;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000))
      return null;
    return payload;
  } catch {
    return null;
  }
}

/** Extract a bearer token from an Authorization header. */
export function readBearer(request: Request): string | null {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
