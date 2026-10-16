import { defaultTheme, isThemeName, type ThemeName } from './themes';

const key = 'crafts-theme';

/** The top bar's theme. Remembered per browser, so a reload keeps it. */
export const theme = $state<{ name: ThemeName }>({ name: defaultTheme });

/** Reads the remembered theme. Storage can be blocked, so it may stay the default. */
export function loadTheme() {
	try {
		const saved = localStorage.getItem(key);
		if (isThemeName(saved)) theme.name = saved;
	} catch {
		// Private window or blocked storage: keep the default.
	}
}

export function setTheme(name: ThemeName) {
	theme.name = name;
	try {
		localStorage.setItem(key, name);
	} catch {
		// Same: the choice just won't survive a reload.
	}
}
