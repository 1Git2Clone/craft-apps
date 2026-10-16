import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

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
		prerender: {
			// Each page frames /apps/<name>/, upstream's own build, which the
			// prerenderer follows but cannot serve: it is a static directory, not a
			// page of this site. Anything else that 404s is a real broken link.
			handleHttpError: ({ path, message }) => {
				if (path.startsWith('/apps/')) return;
				throw new Error(message);
			}
		}
	}
};
