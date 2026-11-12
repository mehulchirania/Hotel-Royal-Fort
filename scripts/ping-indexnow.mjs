// Submits every URL in the live sitemap to IndexNow (Bing, Yandex and partners).
// Run after a deploy has gone live: `npm run indexnow` (add `-- --dry` to only list URLs).
// The key file is served from public/<key>.txt, so the key must already be deployed.
import { readdirSync } from 'node:fs';

const HOST = 'hotelroyalfort.in';
const ORIGIN = `https://${HOST}`;
const dry = process.argv.includes('--dry');

const keyFile = readdirSync(new URL('../public/', import.meta.url)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (public/<32 hex>.txt) found.');
const key = keyFile.replace('.txt', '');

const sitemap = await fetch(`${ORIGIN}/sitemap.xml`);
if (!sitemap.ok) throw new Error(`Could not fetch sitemap: ${sitemap.status}`);
const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (urlList.length === 0) throw new Error('Sitemap contains no URLs.');

console.log(`${urlList.length} URLs from ${ORIGIN}/sitemap.xml`);
if (dry) {
  console.log(urlList.join('\n'));
  process.exit(0);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${ORIGIN}/${keyFile}`, urlList }),
});
console.log(`IndexNow responded ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
