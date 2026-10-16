// Tailwind's colour utilities for the theme slots, made from the same list
// the Theme type is: `bg-panel` is `background-color: var(--color-panel)`.
// The values are set on <html> (see themes.ts), never here.

import plugin from 'tailwindcss/plugin';
import { slotProperty, themeSlots } from './themes';

export default plugin(() => {}, {
	theme: {
		extend: {
			colors: Object.fromEntries(themeSlots.map((slot) => [slot, `var(${slotProperty(slot)})`]))
		}
	}
});
