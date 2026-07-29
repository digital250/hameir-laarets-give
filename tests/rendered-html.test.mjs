import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (relativePath) =>
  readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("public routes use the current donation experience", async () => {
  const [home, karine, v4] = await Promise.all([
    read("app/page.tsx"),
    read("app/karine/page.tsx"),
    read("app/v4/page.tsx"),
  ]);

  assert.match(home, /V4Page/);
  assert.match(karine, /v4\/page/);
  assert.match(v4, /double-elul/);
  assert.match(v4, /Double\.openCheckout|openCheckout/);
  assert.match(v4, /hameir-solicitor/);
  assert.match(v4, /params\.get\("fundraiser"\)/);
  assert.match(v4, /params\.get\("ref"\)/);
  assert.match(v4, /params\.get\("collector"\)/);
});

test("project checkout does not inherit Elul banner selections", async () => {
  const page = await read("app/v4/page.tsx");

  assert.match(page, /const openDoubleCheckout = \(campaign: Campaign\)/);
  assert.match(page, /campaign: campaign\.doubleCampaign/);
  assert.doesNotMatch(page, /useBannerSelection/);
  assert.doesNotMatch(page, /frequency: frequency/);
});

test("security headers and production dependency overrides are configured", async () => {
  const [config, packageJson] = await Promise.all([
    read("next.config.ts"),
    read("package.json"),
  ]);

  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /Strict-Transport-Security/);
  assert.match(config, /X-Content-Type-Options/);
  assert.match(config, /Permissions-Policy/);
  assert.match(config, /poweredByHeader:\s*false/);
  assert.match(packageJson, /"postcss": "8\.5\.25"/);
  assert.match(packageJson, /"sharp": "0\.35\.3"/);
});

test("critical visual assets are present", async () => {
  await Promise.all([
    access(new URL("../public/images/hameir-laarets-logo-new.png", import.meta.url)),
    access(new URL("../public/images/elul-volunteers-hero-v3.jpg", import.meta.url)),
    access(new URL("../public/images/rabbis-together-final.png", import.meta.url)),
  ]);
});
