// Runs the language servers an editor would, over every .svelte file, and
// fails on what they report: errors, warnings, and anything marked
// deprecated (TypeScript reports `base` from $app/paths only as a hint, and
// Tailwind's suggestCanonicalClasses only reaches an editor).
//
// `svelte-check` and `vp lint` miss both of those, which is why this exists.
// It speaks plain LSP over stdio, so another server is one entry in SERVERS.
//
//   node scripts/lsp-check.mjs

import { spawn } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

const SERVERS = [
	{ name: 'svelte', command: 'svelteserver', args: ['--stdio'] },
	{
		name: 'tailwindcss',
		command: 'tailwindcss-language-server',
		args: ['--stdio'],
		// The server asks for its settings rather than reading them from disk.
		settings: { tailwindCSS: { lint: { suggestCanonicalClasses: 'warning' } } }
	}
];

// Servers publish diagnostics more than once as they warm up; a file's set
// counts as final once nothing new has arrived for this long.
const SETTLE_MS = 3000;
const TIMEOUT_MS = 90_000;

const SEVERITY = { 1: 'error', 2: 'warning', 3: 'info', 4: 'hint' };
const DEPRECATED_TAG = 2;

const files = (function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return walk(path);
		return entry.name.endsWith('.svelte') ? [path] : [];
	});
})(join(root, 'src'));

/** One language server, driven over JSON-RPC on its stdio. */
function start(server) {
	const child = spawn(join(root, 'node_modules/.bin', server.command), server.args, {
		cwd: root,
		// Servers log freely to stderr; only what they publish counts.
		stdio: ['pipe', 'pipe', 'ignore']
	});
	let buffer = Buffer.alloc(0);
	let nextId = 1;
	const pending = new Map();
	const diagnostics = new Map();
	let lastActivity = Date.now();

	const send = (message) => {
		const body = Buffer.from(JSON.stringify({ jsonrpc: '2.0', ...message }));
		child.stdin.write(`Content-Length: ${body.length}\r\n\r\n`);
		child.stdin.write(body);
	};

	const request = (method, params) =>
		new Promise((resolveReply) => {
			const id = nextId++;
			pending.set(id, resolveReply);
			send({ id, method, params });
		});

	// Requests the server makes of us, the "editor".
	const answer = (message) => {
		let result = null;
		if (message.method === 'workspace/configuration') {
			result = message.params.items.map((item) =>
				item.section ? (server.settings?.[item.section] ?? {}) : {}
			);
		}
		send({ id: message.id, result });
	};

	child.stdout.on('data', (chunk) => {
		buffer = Buffer.concat([buffer, chunk]);
		for (;;) {
			const headerEnd = buffer.indexOf('\r\n\r\n');
			if (headerEnd === -1) return;
			const length = Number(/Content-Length: (\d+)/i.exec(buffer.subarray(0, headerEnd))[1]);
			if (buffer.length < headerEnd + 4 + length) return;
			const message = JSON.parse(buffer.subarray(headerEnd + 4, headerEnd + 4 + length));
			buffer = buffer.subarray(headerEnd + 4 + length);

			if ('id' in message && !('method' in message)) {
				pending.get(message.id)?.(message.result);
				pending.delete(message.id);
			} else if ('id' in message) {
				answer(message);
			} else if (message.method === 'textDocument/publishDiagnostics') {
				// Keyed by path: servers re-encode URIs (`+` as %2B, `[` as %5B),
				// so the URI that comes back is not always the one we sent.
				diagnostics.set(fileURLToPath(message.params.uri), message.params.diagnostics);
				lastActivity = Date.now();
			}
		}
	});

	return { child, send, request, diagnostics, idleFor: () => Date.now() - lastActivity };
}

async function check(server) {
	const lsp = start(server);
	await lsp.request('initialize', {
		processId: process.pid,
		rootUri: pathToFileURL(root).href,
		workspaceFolders: [{ uri: pathToFileURL(root).href, name: 'root' }],
		capabilities: {
			workspace: { configuration: true, workspaceFolders: true },
			textDocument: {
				publishDiagnostics: { tagSupport: { valueSet: [1, 2] } },
				synchronization: { didSave: true }
			}
		},
		initializationOptions: server.settings ?? {}
	});
	lsp.send({ method: 'initialized', params: {} });

	for (const file of files) {
		lsp.send({
			method: 'textDocument/didOpen',
			params: {
				textDocument: {
					uri: pathToFileURL(file).href,
					languageId: 'svelte',
					version: 1,
					text: readFileSync(file, 'utf8')
				}
			}
		});
	}

	const started = Date.now();
	await new Promise((done) => {
		const timer = setInterval(() => {
			const allIn = files.every((file) => lsp.diagnostics.has(file));
			const timedOut = Date.now() - started > TIMEOUT_MS;
			if ((allIn && lsp.idleFor() > SETTLE_MS) || timedOut) {
				clearInterval(timer);
				done();
			}
		}, 250);
	});

	const missing = files.filter((file) => !lsp.diagnostics.has(file));
	lsp.child.kill();

	const problems = [];
	for (const [path, list] of lsp.diagnostics) {
		for (const d of list) {
			const deprecated = d.tags?.includes(DEPRECATED_TAG);
			if (d.severity > 2 && !deprecated) continue;
			const where = `${relative(root, path)}:${d.range.start.line + 1}:${d.range.start.character + 1}`;
			const kind = deprecated ? 'deprecated' : SEVERITY[d.severity];
			problems.push(`${where} ${kind} ${server.name}: ${d.message}`);
		}
	}
	return { problems, missing };
}

let failed = false;
for (const server of SERVERS) {
	const { problems, missing } = await check(server);
	for (const line of problems) console.log(line);
	// A file the server never reported on was not checked; that is a failure
	// of the check itself, not a pass.
	for (const file of missing) {
		console.log(`${relative(root, file)} not checked: ${server.name} sent no diagnostics`);
	}
	if (problems.length || missing.length) failed = true;
	else console.log(`pass: ${server.name} found nothing in ${files.length} files`);
}
process.exit(failed ? 1 : 0);
