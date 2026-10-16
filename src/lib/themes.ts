import { hex, type Colour } from './colours';

/**
 * Every colour the top bar and its menus use. A theme has to set them all,
 * and Tailwind makes its colour utilities (bg-panel, text-fg, …) from this
 * list too (themes.tailwind.ts), so a slot is one word added here.
 */
export const themeSlots = ['bg', 'panel', 'hover', 'line', 'fg', 'dim', 'accent'] as const;

export type ThemeSlot = (typeof themeSlots)[number];

/** The CSS custom property a slot is set in. */
export const slotProperty = (slot: ThemeSlot) => `--color-${slot}` as const;

export interface Theme {
	label: string;
	colours: Record<ThemeSlot, Colour>;
}

export const themes = {
	classic: {
		label: 'Classic',
		colours: {
			bg: hex('#262626'),
			panel: hex('#323232'),
			hover: hex('#3e3e3e'),
			line: hex('#474747'),
			fg: hex('#e3e3e3'),
			dim: hex('#a3a3a3'),
			accent: hex('#31a8ff')
		}
	},
	wine: {
		label: 'Wine',
		colours: {
			bg: hex('#1a0f12'),
			panel: hex('#241519'),
			hover: hex('#2f1a1f'),
			line: hex('#3d2228'),
			fg: hex('#f3e6e8'),
			dim: hex('#b39197'),
			accent: hex('#ec6b6f')
		}
	},
	midnight: {
		label: 'Midnight',
		colours: {
			bg: hex('#0f1420'),
			panel: hex('#161d2e'),
			hover: hex('#1f2940'),
			line: hex('#2a3652'),
			fg: hex('#e4e9f5'),
			dim: hex('#8c98b3'),
			accent: hex('#8b9dff')
		}
	},
	forest: {
		label: 'Forest',
		colours: {
			bg: hex('#111a14'),
			panel: hex('#18241b'),
			hover: hex('#213126'),
			line: hex('#2c4032'),
			fg: hex('#e3efe5'),
			dim: hex('#93ab98'),
			accent: hex('#5fd38d')
		}
	},
	paper: {
		label: 'Paper',
		colours: {
			bg: hex('#f4f4f2'),
			panel: hex('#ffffff'),
			hover: hex('#ececea'),
			line: hex('#d6d6d2'),
			fg: hex('#1f1f1f'),
			dim: hex('#6b6b6b'),
			accent: hex('#1473e6')
		}
	}
} as const satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

export const defaultTheme: ThemeName = 'classic';

export const isThemeName = (name: unknown): name is ThemeName =>
	typeof name === 'string' && Object.hasOwn(themes, name);

/**
 * The theme as CSS custom properties, for a `style` attribute. Tailwind's
 * colour utilities read these, so everything inside that element follows.
 */
export const themeStyle = (name: ThemeName) =>
	themeSlots.map((slot) => `${slotProperty(slot)}: ${themes[name].colours[slot]}`).join('; ');
