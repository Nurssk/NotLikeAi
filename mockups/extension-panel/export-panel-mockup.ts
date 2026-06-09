import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";

const TARGET_URL = process.env.PANEL_MOCKUP_URL ?? "http://localhost:3000/panel-mockup";
const OUTPUT_PATH =
  process.env.PANEL_MOCKUP_OUTPUT ??
  "mockups/extension-panel/extension-panel-mockup.png";

async function main() {
  await assertServerIsReachable(TARGET_URL);
  await mkdir(dirname(resolve(OUTPUT_PATH)), { recursive: true });

  const browser = await launchBrowser();

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 900,
        deviceScaleFactor: 2
      }
    });

    page.setDefaultTimeout(10_000);
    page.setDefaultNavigationTimeout(10_000);

    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });

    const panel = page.locator('[data-export-target="extension-panel-mockup"]');
    await panel.waitFor({ state: "visible" });
    await panel.screenshot({
      path: OUTPUT_PATH,
      animations: "disabled"
    });

    console.log(`Saved panel mockup screenshot to ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

async function launchBrowser() {
  try {
    return await chromium.launch({
      channel: "chrome",
      headless: true
    });
  } catch {
    return chromium.launch({
      headless: true
    });
  }
}

async function assertServerIsReachable(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      [
        `Could not reach ${url}.`,
        "Start the web app first:",
        "cd /Users/nursultansarsenbay/dev/swipeUI/web",
        "npm run dev"
      ].join("\n"),
      { cause: error }
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
