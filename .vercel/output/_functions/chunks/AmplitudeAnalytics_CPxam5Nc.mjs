import { e as createComponent, l as renderComponent, n as renderScript, r as renderTemplate, h as createAstro } from './astro/server_BvoF-d3F.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/nursultansarsenbay/dev/polish/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$AmplitudeAnalytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/AmplitudeAnalytics.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/AmplitudeAnalytics.astro", void 0);

export { $$AmplitudeAnalytics as $, $$Index as a };
