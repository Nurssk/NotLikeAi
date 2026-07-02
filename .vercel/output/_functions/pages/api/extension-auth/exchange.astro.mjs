import { e as extensionAuthCorsHeaders, b as exchangeExtensionAuthCode, a as extensionAuthJsonResponse } from '../../../chunks/extension-auth_DbC87bnZ.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const OPTIONS = async () => new Response(null, { status: 204, headers: extensionAuthCorsHeaders });
const POST = async ({ request }) => {
  try {
    return await exchangeExtensionAuthCode(request);
  } catch {
    return extensionAuthJsonResponse({ error: "code_exchange_failed" }, { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
