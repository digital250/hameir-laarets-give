import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Hameir Laarets donation center", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="en" dir="ltr">/i);
  assert.match(html, /<title>Hameir Laarets \| Give Light\. Strengthen Lives\.<\/title>/i);
  assert.match(html, /Turn a sacred/);
  assert.match(html, /dignity for a family/);
  assert.match(html, /id="campaign-select"/);
  assert.match(html, /Donate Securely/);
  assert.match(html, /Choose the cause/);
  assert.match(html, /Strengthen Jewish Life in Mexico/);
  assert.equal((html.match(/<option value=/g) ?? []).length, 13);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/);
});

test("keeps tracking, responsive design, and project assets wired", async () => {
  const [page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /params\.get\("fundraiser"\)/);
  assert.match(page, /params\.get\("ref"\)/);
  assert.match(page, /params\.get\("collector"\)/);
  assert.match(page, /setSelectedCampaignId/);
  assert.match(page, /kaparot-family-hero\.png/);
  assert.match(page, /hameir-mark-transparent\.png/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /\.mobile-donate-bar/);
  assert.match(packageJson, /@phosphor-icons\/react/);
  assert.match(packageJson, /@fontsource\/cormorant-garamond/);
  assert.match(packageJson, /@fontsource\/dm-sans/);

  await access(new URL("../public/images/kaparot-family-hero.png", import.meta.url));
  await access(new URL("../public/images/hameir-mark-transparent.png", import.meta.url));
});
