// news-image-20261127 entrypoint (Node 22, standard library only).
//
// The entry is one image, entry.png, held in this repository next to
// this file. The program copies it to the output directory the grader
// provides, after checking the shipped file really is the PNG it claims
// to be: the eight-byte PNG signature, the width and height from the
// IHDR chunk (each at most 1024), and a size of at most 1 MiB. It reads
// nothing else, reaches no network, and writes the same bytes on every
// run, so two runs of it are byte-identical by construction.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1048576; // 1 MiB
const MAX_SIDE = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Read the shipped image and check it before anything is written.
const image = readFileSync(source);
if (image.length < 33 || !image.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error('entry.png is not a PNG: bad signature');
}
if (image.readUInt32BE(12) !== 0x49484452) { // 'IHDR' must follow the signature
  throw new Error('entry.png is not a PNG: IHDR chunk missing');
}
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width > MAX_SIDE || height > MAX_SIDE) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}
if (image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB cap`);
}

// The image is valid; copy it byte for byte to the output.
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Confirm the copy landed whole: same size on disk as the source.
if (statSync(target).size !== image.length) {
  throw new Error('entry.png copy is incomplete');
}
console.log(`wrote ${target} (${width}x${height}, ${image.length} bytes)`);
