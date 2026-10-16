import type { Handle } from '@sveltejs/kit';
import { defaultTheme, themeStyle } from '$lib/themes';

// Prerendered pages start in the default theme, from src/lib/themes.ts.
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%crafts.theme%', themeStyle(defaultTheme))
	});
