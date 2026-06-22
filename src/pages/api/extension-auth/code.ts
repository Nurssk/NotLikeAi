import type { APIRoute } from "astro";
import { createExtensionAuthCode, extensionAuthCorsHeaders, extensionAuthJsonResponse } from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = async () => new Response(null, { status: 204, headers: extensionAuthCorsHeaders });

export const POST: APIRoute = async ({ request }) => {
  try {
    return await createExtensionAuthCode(request);
  } catch {
    return extensionAuthJsonResponse({ error: "code_create_failed" }, { status: 500 });
  }
};
