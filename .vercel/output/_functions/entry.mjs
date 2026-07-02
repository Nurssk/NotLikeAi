import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DOcaai_e.mjs';
import { manifest } from './manifest_bNfyz4_c.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/checkout.astro.mjs');
const _page2 = () => import('./pages/api/credits/consume.astro.mjs');
const _page3 = () => import('./pages/api/credits/me.astro.mjs');
const _page4 = () => import('./pages/api/extension-auth/code.astro.mjs');
const _page5 = () => import('./pages/api/extension-auth/exchange.astro.mjs');
const _page6 = () => import('./pages/api/polar/webhook.astro.mjs');
const _page7 = () => import('./pages/extension/authorize.astro.mjs');
const _page8 = () => import('./pages/extension/code.astro.mjs');
const _page9 = () => import('./pages/faq.astro.mjs');
const _page10 = () => import('./pages/majd-style.astro.mjs');
const _page11 = () => import('./pages/privacy.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/checkout.ts", _page1],
    ["src/pages/api/credits/consume.ts", _page2],
    ["src/pages/api/credits/me.ts", _page3],
    ["src/pages/api/extension-auth/code.ts", _page4],
    ["src/pages/api/extension-auth/exchange.ts", _page5],
    ["src/pages/api/polar/webhook.ts", _page6],
    ["src/pages/extension/authorize.astro", _page7],
    ["src/pages/extension/code.astro", _page8],
    ["src/pages/faq.astro", _page9],
    ["src/pages/majd-style/index.ts", _page10],
    ["src/pages/privacy.astro", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "4e40bf2b-95ad-4f33-acea-9e6a7ac2d0c6",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
