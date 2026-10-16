import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite-plus';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],

	// Oxfmt, set up the way hu-tao-dev's Prettier is.
	fmt: {
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100,
		ignorePatterns: ['build/**', '.svelte-kit/**', 'static/apps/**', 'pnpm-lock.yaml']
	},

	lint: {
		ignorePatterns: ['build/**', '.svelte-kit/**', 'static/apps/**']
	}
});
