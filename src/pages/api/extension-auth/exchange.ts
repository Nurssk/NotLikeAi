import type { APIRoute } from "astro";
import { exchangeExtensionAuthCode, extensionAuthCorsHeaders, extensionAuthJsonResponse } from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = async () => new Response(null, { status: 204, headers: extensionAuthCorsHeaders });

export const POST: APIRoute = async ({ request }) => {
  try {
    return await exchangeExtensionAuthCode(request);
  } catch {
    return extensionAuthJsonResponse({ error: "code_exchange_failed" }, { status: 500 });
  }
};
