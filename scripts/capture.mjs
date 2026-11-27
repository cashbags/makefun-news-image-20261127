// Capture entry.png for news-image-20261127.
//
// Opens design.html in a real headless Chromium (Playwright) and
// screenshots the 1024x1024 page. The image is the browser's own layout
// of the page, never a render from the same data. The file is then
// verified from disk: PNG signature, 1024x1024 from the IHDR chunk,
// at most 1 MiB.
//
//   node scripts/capture.mjs [out-path]
//   default out-path: ./entry.png
//
// Chromium comes from this machine's Playwright browser cache; if the
// plain launch cannot find it, the script retries with the newest cached
// binary path it can find.

import { chromium } from 'playwright-core';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);
const outPath = resolve(process.argv[2] ?? join(root, 'entry.png'));
const pagePath = join(root, 'design.html');

if (!existsSync(pagePath)) {
  console.error('design.html not found at ' + pagePath);
  process.exit(1);
}

function newestCachedChromium() {
  try {
    const cache = join(homedir(), '.cache', 'ms-playwright');
    const found = execSync(`ls -d ${cache}/chromium-*/chrome-linux*/chrome 2>/dev/null`, { encoding: 'utf8' })
      .trim().split('\n').filter(Boolean).sort();
    return found.length ? found[found.length - 1] : null;
  } catch {
    return null;
  }
}

let browser = null;
try {
  browser = await chromium.launch({ args: ['--no-sandbox', '--force-device-scale-factor=1'] });
} catch (firstError) {
  const exe = newestCachedChromium();
  if (!exe) throw firstError;
  console.log('plain launch failed, retrying with cached binary: ' + exe);
  browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--force-device-scale-factor=1'] });
}

const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto('file://' + pagePath, { waitUntil: 'load' });
await page.waitForTimeout(400);
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
await browser.close();

// Verify from disk before the file is used anywhere.
const buf = readFileSync(outPath);
const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(pngSig)) {
  console.error('FAIL: not a PNG (bad signature)');
  process.exit(1);
}
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
const bytes = statSync(outPath).size;
console.log(`captured ${outPath}`);
console.log(`dimensions ${width}x${height}  bytes ${bytes}  limit 1048576`);
if (width !== 1024 || height !== 1024) {
  console.error('FAIL: dimensions are not 1024x1024');
  process.exit(1);
}
if (bytes > 1048576) {
  console.error('FAIL: over the 1 MiB cap');
  process.exit(1);
}
console.log('OK: real browser capture, 1024x1024, within the size cap');
