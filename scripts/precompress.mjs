// Writes a .br copy beside every compressible file in build/, for a server
// that serves those as they are (caddy's `precompressed br`) instead of
// compressing per request. The apps' wasm alone is tens of MiB.
//
//   node scripts/precompress.mjs [dir]

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';

// 11, the maximum, ran for over ten minutes on all the apps without finishing;
// 9 takes about a minute (426 MiB down to 118 MiB).
const QUALITY = 9;

const COMPRESSIBLE = /\.(html|js|mjs|css|json|svg|wasm|txt|md|xml)$/;

const dir = process.argv[2] ?? 'build';
let before = 0;
let after = 0;

for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || !COMPRESSIBLE.test(entry.name)) continue;
	const path = join(entry.parentPath, entry.name);
	const data = readFileSync(path);
	const compressed = brotliCompressSync(data, {
		params: {
			[constants.BROTLI_PARAM_QUALITY]: QUALITY,
			[constants.BROTLI_PARAM_SIZE_HINT]: data.length
		}
	});
	// Not worth a second file, and caddy would serve the bigger one.
	if (compressed.length >= data.length) continue;
	writeFileSync(`${path}.br`, compressed);
	before += data.length;
	after += compressed.length;
}

const mib = (bytes) => (bytes / 2 ** 20).toFixed(1);
console.log(`brotli: ${mib(before)} MiB -> ${mib(after)} MiB`);
