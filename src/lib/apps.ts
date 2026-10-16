import versions from '../../sites.json';

export interface App {
	id: keyof typeof versions;
	name: string;
	description: string;
	/** The colour of the app's icon in the switcher. */
	colour: string;
	/** The body of a 24x24 SVG. */
	icon: string;
	/** The upstream release published here, from sites.json. */
	version: string;
}

const list: Omit<App, 'version'>[] = [
	{
		id: 'photocraft',
		name: 'PhotoCraft',
		description: 'Image editing',
		colour: '#4ab3ff',
		icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'
	},
	{
		id: 'filmcraft',
		name: 'FilmCraft',
		description: 'Video editing',
		colour: '#9b8cff',
		icon: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>'
	},
	{
		id: 'effectcraft',
		name: 'EffectCraft',
		description: 'Motion graphics & VFX',
		colour: '#3ccf8e',
		icon: '<path d="M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1z"/>'
	},
	{
		id: 'figcraft',
		name: 'FigCraft',
		description: 'Interface design',
		colour: '#ff8a65',
		icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'
	},
	{
		id: 'wordcraft',
		name: 'WordCraft',
		description: 'Documents & word processing',
		colour: '#5c9dff',
		icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'
	},
	{
		id: 'gridcraft',
		name: 'GridCraft',
		description: 'Spreadsheets',
		colour: '#3ccf8e',
		icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'
	},
	{
		id: 'deckcraft',
		name: 'DeckCraft',
		description: 'Presentations & slides',
		colour: '#ffb74d',
		icon: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>'
	},
	{
		id: 'cadcraft',
		name: 'CADCraft',
		description: 'CAD & drafting',
		colour: '#ffd54f',
		icon: '<path d="M4 20V4l16 16z"/><path d="M8 16v-4l4 4z"/>'
	}
];

export const apps: App[] = list.map((app) => ({ ...app, version: versions[app.id] }));

export const findApp = (id: string) => apps.find((app) => app.id === id);

export const github = (app: App) => `https://github.com/storytold/${app.id}`;
