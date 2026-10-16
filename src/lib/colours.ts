declare const brand: unique symbol;

/**
 * A colour, as a CSS hex code. Not just a string: the only way to make one is
 * `hex()`, which checks the code while type-checking.
 */
export type Colour = string & { readonly [brand]: 'Colour' };

type HexDigit =
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'A'
	| 'B'
	| 'C'
	| 'D'
	| 'E'
	| 'F';

// Whether S is all hex digits, and 3 or 6 of them (#rgb or #rrggbb).
type IsHexDigits<S extends string, Seen extends unknown[] = []> = S extends ''
	? Seen['length'] extends 3 | 6
		? true
		: false
	: S extends `${HexDigit}${infer Rest}`
		? IsHexDigits<Rest, [...Seen, unknown]>
		: false;

type ValidHex<S extends string> = S extends `#${infer Digits}`
	? IsHexDigits<Digits> extends true
		? S
		: never
	: never;

/** `hex('#31a8ff')` is a Colour; `hex('#31a8f')` or `hex('blue')` does not compile. */
export const hex = <const S extends string>(code: ValidHex<S>) => code as unknown as Colour;

/** The apps' icon colours. An app names one of these. */
export const colours = {
	sky: hex('#4ab3ff'),
	gold: hex('#f6c453'),
	pink: hex('#ff7aa8'),
	purple: hex('#ba68c8'),
	coral: hex('#ff8a65'),
	violet: hex('#9b8cff'),
	green: hex('#3ccf8e'),
	cyan: hex('#4dd0e1'),
	blue: hex('#5c9dff'),
	amber: hex('#ffb74d'),
	red: hex('#ef5350'),
	yellow: hex('#ffd54f'),
	grey: hex('#a3a3a3')
} satisfies Record<string, Colour>;

export type ColourName = keyof typeof colours;
