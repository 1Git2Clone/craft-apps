import { error } from '@sveltejs/kit';
import { apps, findApp } from '$lib/apps';
import type { EntryGenerator, PageLoad } from './$types';

// One prerendered page per app.
export const entries: EntryGenerator = () => apps.map((app) => ({ app: app.id }));

export const load: PageLoad = ({ params }) => {
	const app = findApp(params.app);
	if (!app) error(404, 'No such app');
	return { app };
};
