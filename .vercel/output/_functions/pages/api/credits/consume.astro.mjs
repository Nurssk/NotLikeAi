import { c as creditCorsHeaders, a as consumeCreditsForRequest, j as jsonResponse } from '../../../chunks/credits_BjpG76A-.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const OPTIONS = async () => new Response(null, { status: 204, headers: creditCorsHeaders });
const POST = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  const amount = typeof body.amount === "number" ? body.amount : 1;
  try {
    return await consumeCreditsForRequest(request, amount);
  } catch {
    return jsonResponse({ error: "credit_consume_failed" }, { status: 500 });
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
