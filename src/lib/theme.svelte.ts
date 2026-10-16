import { defaultTheme, isThemeName, themeStyle, type ThemeName } from './themes';

const key = 'crafts-theme';

/** The top bar's theme. Remembered per browser, so a reload keeps it. */
export const theme = $state<{ name: ThemeName }>({ name: defaultTheme });

/** Reads the remembered theme. Storage can be blocked, so it may stay the default. */
export function loadTheme() {
	try {
		const saved = localStorage.getItem(key);
		if (isThemeName(saved)) apply(saved);
	} catch {
		// Private window or blocked storage: keep the default.
	}
}

export function setTheme(name: ThemeName) {
	apply(name);
	try {
		localStorage.setItem(key, name);
	} catch {
		// Same: the choice just won't survive a reload.
	}
}

// On <html>, so everything the bar draws follows it, including what is not
// inside the bar: the funnel animation builds its copies under <body>. The
// apps are iframes, separate documents, so it never reaches them.
function apply(name: ThemeName) {
	theme.name = name;
	document.documentElement.style.cssText = themeStyle(name);
}
