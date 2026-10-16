import versions from '../../sites.json';

/** The menu's groups, in the order it shows them. */
export const categories = ['Creative', 'Office', 'Engineering', 'Other'] as const;

export interface App {
	id: keyof typeof versions;
	name: string;
	description: string;
	category: (typeof categories)[number];
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
		category: 'Creative',
		name: 'PhotoCraft',
		description: 'Image editing',
		colour: '#4ab3ff',
		icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'
	},
	{
		id: 'filmcraft',
		category: 'Creative',
		name: 'FilmCraft',
		description: 'Video editing',
		colour: '#9b8cff',
		icon: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>'
	},
	{
		id: 'effectcraft',
		category: 'Creative',
		name: 'EffectCraft',
		description: 'Motion graphics & VFX',
		colour: '#3ccf8e',
		icon: '<path d="M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1z"/>'
	},
	{
		id: 'figcraft',
		category: 'Creative',
		name: 'FigCraft',
		description: 'Interface design',
		colour: '#ff8a65',
		icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'
	},
	{
		id: 'wordcraft',
		category: 'Office',
		name: 'WordCraft',
		description: 'Documents & word processing',
		colour: '#5c9dff',
		icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'
	},
	{
		id: 'gridcraft',
		category: 'Office',
		name: 'GridCraft',
		description: 'Spreadsheets',
		colour: '#3ccf8e',
		icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'
	},
	{
		id: 'deckcraft',
		category: 'Office',
		name: 'DeckCraft',
		description: 'Presentations & slides',
		colour: '#ffb74d',
		icon: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>'
	},
	{
		id: 'cadcraft',
		category: 'Engineering',
		name: 'CADCraft',
		description: 'CAD & drafting',
		colour: '#ffd54f',
		icon: '<path d="M4 20V4l16 16z"/><path d="M8 16v-4l4 4z"/>'
	},
	{
		id: 'lightcraft',
		category: 'Creative',
		name: 'LightCraft',
		description: 'Photo library & RAW',
		colour: '#f6c453',
		icon: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>'
	},
	{
		id: 'vectorcraft',
		category: 'Creative',
		name: 'VectorCraft',
		description: 'Vector illustration',
		colour: '#ff7aa8',
		icon: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>'
	},
	{
		id: 'designcraft',
		category: 'Creative',
		name: 'DesignCraft',
		description: 'Page layout',
		colour: '#ba68c8',
		icon: '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="9" height="7" rx="1"/><rect x="16" y="14" width="5" height="7" rx="1"/>'
	},
	{
		id: 'soundcraft',
		category: 'Creative',
		name: 'SoundCraft',
		description: 'Audio editing & mixing',
		colour: '#4dd0e1',
		icon: '<path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3"/>'
	},
	{
		id: 'pdfcraft',
		category: 'Office',
		name: 'PdfCraft',
		description: 'PDF reading & editing',
		colour: '#ef5350',
		icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 18h4"/>'
	}
];

// An app pinned in sites.json but not described above still gets a menu
// entry, so publishing a new one takes nothing but its line there.
const fallback = (id: App['id']): Omit<App, 'version'> => ({
	id,
	category: 'Other',
	name: id.replace(/^(.)(.*)craft$/, (_, first, rest) => `${first.toUpperCase()}${rest}Craft`),
	description: '',
	colour: '#a3a3a3',
	icon: '<rect x="3" y="3" width="18" height="18" rx="2"/>'
});

/** Every app in sites.json, in that file's order. */
export const apps: App[] = (Object.keys(versions) as App['id'][]).map((id) => ({
	...(list.find((app) => app.id === id) ?? fallback(id)),
	version: versions[id]
}));

export const findApp = (id: string) => apps.find((app) => app.id === id);

export const github = (app: App) => `https://github.com/storytold/${app.id}`;
