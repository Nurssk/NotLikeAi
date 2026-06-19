import type { APIRoute } from "astro";
import { creditCorsHeaders, getCreditsForRequest } from "../../../lib/credits";

export const prerender = false;

export const OPTIONS: APIRoute = async () => new Response(null, { status: 204, headers: creditCorsHeaders });

export const GET: APIRoute = async ({ request }) => getCreditsForRequest(request);
