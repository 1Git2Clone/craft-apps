/**
 * The apps' icons: the inside of a 24x24, stroked SVG, by what they show.
 * Mostly Lucide's shapes, drawn by `AppIcon`.
 */
export const icons = {
	image:
		'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
	camera:
		'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
	penTool:
		'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
	pageLayout:
		'<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="9" height="7" rx="1"/><rect x="16" y="14" width="5" height="7" rx="1"/>',
	window: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
	play: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>',
	sparkle: '<path d="M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1z"/>',
	waveform: '<path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3"/>',
	document:
		'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
	spreadsheet:
		'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
	presentation: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>',
	pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 18h4"/>',
	setSquare: '<path d="M4 20V4l16 16z"/><path d="M8 16v-4l4 4z"/>',
	/** For an app that has no icon of its own yet. */
	square: '<rect x="3" y="3" width="18" height="18" rx="2"/>'
} as const satisfies Record<string, string>;

export type IconName = keyof typeof icons;
