import versions from '../../sites.json';
import type { ColourName } from './colours';
import type { IconName } from './icons';

/** The menu's groups, in the order it shows them. */
export const categories = ['Creative', 'Office', 'Engineering', 'Other'] as const;

export interface App {
	id: keyof typeof versions;
	name: string;
	description: string;
	category: (typeof categories)[number];
	/** The colour of the app's icon in the switcher. */
	colour: ColourName;
	icon: IconName;
	/** The upstream release published here, from sites.json. */
	version: string;
}

const list: Omit<App, 'version'>[] = [
	{
		id: 'photocraft',
		category: 'Creative',
		name: 'PhotoCraft',
		description: 'Image editing',
		colour: 'sky',
		icon: 'image'
	},
	{
		id: 'filmcraft',
		category: 'Creative',
		name: 'FilmCraft',
		description: 'Video editing',
		colour: 'violet',
		icon: 'play'
	},
	{
		id: 'effectcraft',
		category: 'Creative',
		name: 'EffectCraft',
		description: 'Motion graphics & VFX',
		colour: 'green',
		icon: 'sparkle'
	},
	{
		id: 'figcraft',
		category: 'Creative',
		name: 'FigCraft',
		description: 'Interface design',
		colour: 'coral',
		icon: 'window'
	},
	{
		id: 'wordcraft',
		category: 'Office',
		name: 'WordCraft',
		description: 'Documents & word processing',
		colour: 'blue',
		icon: 'document'
	},
	{
		id: 'gridcraft',
		category: 'Office',
		name: 'GridCraft',
		description: 'Spreadsheets',
		colour: 'green',
		icon: 'spreadsheet'
	},
	{
		id: 'deckcraft',
		category: 'Office',
		name: 'DeckCraft',
		description: 'Presentations & slides',
		colour: 'amber',
		icon: 'presentation'
	},
	{
		id: 'cadcraft',
		category: 'Engineering',
		name: 'CADCraft',
		description: 'CAD & drafting',
		colour: 'yellow',
		icon: 'setSquare'
	},
	{
		id: 'lightcraft',
		category: 'Creative',
		name: 'LightCraft',
		description: 'Photo library & RAW',
		colour: 'gold',
		icon: 'camera'
	},
	{
		id: 'vectorcraft',
		category: 'Creative',
		name: 'VectorCraft',
		description: 'Vector illustration',
		colour: 'pink',
		icon: 'penTool'
	},
	{
		id: 'designcraft',
		category: 'Creative',
		name: 'DesignCraft',
		description: 'Page layout',
		colour: 'purple',
		icon: 'pageLayout'
	},
	{
		id: 'soundcraft',
		category: 'Creative',
		name: 'SoundCraft',
		description: 'Audio editing & mixing',
		colour: 'cyan',
		icon: 'waveform'
	},
	{
		id: 'pdfcraft',
		category: 'Office',
		name: 'PdfCraft',
		description: 'PDF reading & editing',
		colour: 'red',
		icon: 'pdf'
	}
];

// An app pinned in sites.json but not described above still gets a menu
// entry, so publishing a new one takes nothing but its line there.
const fallback = (id: App['id']): Omit<App, 'version'> => ({
	id,
	category: 'Other',
	name: id.replace(/^(.)(.*)craft$/, (_, first, rest) => `${first.toUpperCase()}${rest}Craft`),
	description: '',
	colour: 'grey',
	icon: 'square'
});

/** Every app in sites.json, in that file's order. */
export const apps: App[] = (Object.keys(versions) as App['id'][]).map((id) => ({
	...(list.find((app) => app.id === id) ?? fallback(id)),
	version: versions[id]
}));

export const findApp = (id: string) => apps.find((app) => app.id === id);

export const github = (app: App) => `https://github.com/storytold/${app.id}`;
