// Popovers pour out of the button that opened them and back into it, like
// the macOS minimize animation.
//
// CSS cannot bend an element, so the popover is drawn as thin horizontal
// slices instead. Each slice holds a copy of the popover, squeezed to the
// width of a funnel whose narrow end (the throat) is the button, and the
// whole stack slides out through the throat. Opening is:
//
//   1. slide: the popover slides out of the button, narrow near the throat;
//   2. straighten: the funnel's sides relax back into a rectangle.
//
// The two overlap, and closing plays the same thing backwards.
//
// Each slice is a plain, untransformed box on whole pixels with
// `overflow: hidden`, and only the copy inside it is squeezed and skewed.
// That keeps every cut between slices a crisp horizontal line. Clipping the
// transformed copies directly left a soft edge at every cut instead, which
// Firefox's GPU renderer drew as visible lines across the popover.

const DURATION_MS = 350;
const SLICE_PX = 8;

// The share of the animation each phase takes, as [start, end] in 0..1.
const SLIDE: Phase = [0, 0.6];
const STRAIGHTEN: Phase = [0.3, 1];

type Phase = [start: number, end: number];
type Edges = (y: number) => [left: number, right: number];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (x: number) => x * x * (3 - 2 * x);

// How far through a phase we are, 0..1, eased at both ends.
const phase = (progress: number, [start, end]: Phase) =>
	smoothstep(clamp((progress - start) / (end - start)));

/**
 * A Svelte attachment for a popover: animates it out of `opener` and back.
 *
 *     <div popover {@attach funnel(() => button)}>
 */
export function funnel(getOpener: () => HTMLElement | undefined) {
	return (popover: HTMLElement) => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const onBeforeToggle = (event: ToggleEvent) => {
			const opener = getOpener();
			if (!opener) return;
			if (event.newState === 'open') {
				// Keep it invisible from its first paint until the animation ends.
				popover.style.visibility = 'hidden';
			} else {
				// Still laid out at this point, so it can be measured and copied.
				play(popover, opener, false);
			}
		};

		const onToggle = (event: ToggleEvent) => {
			const opener = getOpener();
			// Only now is the opened popover laid out and measurable.
			if (opener && event.newState === 'open') play(popover, opener, true);
		};

		popover.addEventListener('beforetoggle', onBeforeToggle);
		popover.addEventListener('toggle', onToggle);
		return () => {
			popover.removeEventListener('beforetoggle', onBeforeToggle);
			popover.removeEventListener('toggle', onToggle);
		};
	};
}

function play(popover: HTMLElement, opener: HTMLElement, opening: boolean) {
	const box = popover.getBoundingClientRect();
	const throat = opener.getBoundingClientRect();
	const top = Math.round(box.top);

	const layer = document.body.appendChild(document.createElement('div'));
	layer.className = 'funnel';
	// The layer hangs off <body>, outside any theme set on the popover's
	// ancestors, so it takes the popover's own background.
	layer.style.background = getComputedStyle(popover).backgroundColor;
	// Clipped to nothing until the first frame gives it a shape.
	layer.style.clipPath = 'path("M0,0Z")';

	const slices: HTMLElement[] = [];
	for (let i = 0; i * SLICE_PX < box.height; i++) {
		const slice = layer.appendChild(document.createElement('div'));
		slice.style.height = `${SLICE_PX}px`;

		const copy = popover.cloneNode(true) as HTMLElement;
		copy.removeAttribute('popover');
		Object.assign(copy.style, {
			position: 'absolute',
			inset: 'auto',
			margin: '0',
			// The popover itself is hidden by now, and the copy inherits that.
			visibility: 'visible',
			left: `${box.left}px`,
			// Shifted up so that this slice's band of the popover shows through.
			top: `${box.top - top - i * SLICE_PX}px`,
			width: `${box.width}px`,
			height: `${box.height}px`,
			// Skew around the slice's own top edge.
			transformOrigin: `0 ${i * SLICE_PX}px`
		});
		slice.appendChild(copy);
		keepScroll(popover, copy);
		slices.push(slice);
	}

	// How far the popover moves to pass entirely into the throat.
	const travel = box.bottom - throat.bottom;
	const start = performance.now();
	popover.style.visibility = 'hidden';

	requestAnimationFrame(function frame(now) {
		const elapsed = clamp((now - start) / DURATION_MS);
		const progress = opening ? elapsed : 1 - elapsed; // 0 = in the button, 1 = fully out

		// Whole pixels, so the cuts between slices stay on pixel rows.
		const offset = Math.round(-(1 - phase(progress, SLIDE)) * travel);
		const bend = 1 - phase(progress, STRAIGHTEN);

		// The funnel's left and right edges at screen height y: as wide as the
		// button at the throat, as wide as the popover at its far end.
		const edges: Edges = (y) => {
			const depth = smoothstep(clamp((y - throat.bottom) / (box.bottom - throat.bottom)));
			return [
				lerp(box.left, lerp(throat.left, box.left, depth), bend),
				lerp(box.right, lerp(throat.right, box.right, depth), bend)
			];
		};

		slices.forEach((slice, i) => {
			const y = top + i * SLICE_PX + offset;
			const [leftTop, rightTop] = edges(y);
			const [leftBottom, rightBottom] = edges(y + SLICE_PX);

			slice.style.top = `${y}px`;
			// Slices still above the throat have not come out yet.
			slice.style.visibility = y + SLICE_PX <= throat.bottom ? 'hidden' : '';

			// Squeeze to the slice's average width, and skew so its left edge runs
			// from where the funnel is at the slice's top to where it is at its
			// bottom: the slices then join into one curve, not a staircase.
			const scale = (rightTop - leftTop + rightBottom - leftBottom) / 2 / box.width;
			const skew = (leftBottom - leftTop) / SLICE_PX;
			(slice.firstChild as HTMLElement).style.transform =
				`matrix(${scale}, 0, ${skew}, 1, ${leftTop - box.left}, 0)`;
		});

		// Clip the layer to the funnel's exact outline. That trims the small
		// sawtooth the slices leave on the right edge (the skew only lines up
		// the left one), and the layer's background fills any gap between them.
		layer.style.clipPath = `path("${outline(slices.length, top, offset, box, throat, edges)}")`;

		if (elapsed < 1) return requestAnimationFrame(frame);
		layer.remove();
		popover.style.visibility = '';
	});
}

// A copy starts scrolled to the top. Scroll each of its scrollable parts to
// where the original is, or a menu scrolled down would jump while it closes.
function keepScroll(original: Element, copy: Element) {
	if (original.scrollTop) copy.scrollTop = original.scrollTop;
	for (let i = 0; i < original.children.length; i++) {
		keepScroll(original.children[i], copy.children[i]);
	}
}

// The visible part of the funnel, as SVG path data: down the left edge at
// each slice boundary, then back up the right one.
function outline(
	count: number,
	top: number,
	offset: number,
	box: DOMRect,
	throat: DOMRect,
	edges: Edges
) {
	const ys: number[] = [];
	for (let i = 0; i <= count; i++) {
		const y = Math.min(top + i * SLICE_PX, box.bottom) + offset;
		if (y > throat.bottom) ys.push(y);
	}
	if (ys.length === 0) return 'M0,0Z';
	ys.unshift(Math.max(throat.bottom, box.top + offset));

	const left = ys.map((y) => `${edges(y)[0]},${y}`);
	const right = ys.reverse().map((y) => `${edges(y)[1]},${y}`);
	return `M${[...left, ...right].join('L')}Z`;
}
