import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Empty at the root of a host. A GitHub Pages project site lives under
// /<repo>, which its workflow passes in.
const base = process.env.BASE_PATH ?? '';

/**
 * Every page is prerendered: the site is static files that caddy serves out
 * of the pages volume, with no server of its own.
 *
 * @type {import('@sveltejs/kit').Config}
 */
export default {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		inlineStyleThreshold: Infinity,
		paths: { base },
		prerender: {
			// Each page frames /apps/<name>/, upstream's own build, which the
			// prerenderer follows but cannot serve: it is a static directory, not a
			// page of this site. Anything else that 404s is a real broken link.
			handleHttpError: ({ path, message }) => {
				if (path.startsWith(`${base}/apps/`)) return;
				throw new Error(message);
			}
		}
	}
};
