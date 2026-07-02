import { g as getCreditsForRequest, c as creditCorsHeaders } from '../../../chunks/credits_BjpG76A-.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const OPTIONS = async () => new Response(null, { status: 204, headers: creditCorsHeaders });
const GET = async ({ request }) => getCreditsForRequest(request);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	OPTIONS,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
