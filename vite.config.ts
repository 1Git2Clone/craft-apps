import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite-plus';

// The repo this site was built from, linked from the About panel. Forgejo
// Actions and GitHub Actions both set these two, so a fork links to itself.
const server = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
const repository = process.env.GITHUB_REPOSITORY ?? '1Git2Clone/craft-apps';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	define: { __SOURCE_URL__: JSON.stringify(`${server}/${repository}`) },

	// Oxfmt, set up the way hu-tao-dev's Prettier is.
	fmt: {
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100,
		ignorePatterns: ['build/**', '.svelte-kit/**', 'static/apps/**', 'pnpm-lock.yaml']
	},

	lint: {
		ignorePatterns: ['build/**', '.svelte-kit/**', 'static/apps/**'],
		options: { typeAware: true },
		rules: { 'typescript/no-deprecated': 'error' }
	}
});
