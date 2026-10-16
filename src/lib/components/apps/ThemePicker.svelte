<script lang="ts">
	import { theme, setTheme } from '$lib/theme.svelte';
	import { themes, type ThemeName } from '$lib/themes';
	import IconButton from '$lib/components/layout/IconButton.svelte';
	import Popover from '$lib/components/layout/Popover.svelte';
	import PaintbrushDye from '$lib/components/icons/PaintbrushDye.svelte';

	let button = $state<HTMLButtonElement>();

	const names = Object.keys(themes) as ThemeName[];

	function pick(name: ThemeName, event: MouseEvent) {
		setTheme(name);
		(event.currentTarget as HTMLElement).closest<HTMLElement>('[popover]')?.hidePopover();
	}
</script>

<IconButton bind:element={button} popovertarget="themes" title="Colour theme">
	<PaintbrushDye />
</IconButton>

<Popover id="themes" opener={button} class="right-12 w-48 p-2">
	<h2 class="mx-2.5 mt-1.5 mb-1 text-[10px] font-semibold tracking-[0.12em] text-dim uppercase">
		Theme
	</h2>
	{#each names as name (name)}
		{@const colours = themes[name].colours}
		<button
			onclick={(event) => pick(name, event)}
			aria-pressed={theme.name === name}
			class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-hover focus-visible:bg-hover focus-visible:outline-none aria-pressed:bg-[color-mix(in_srgb,var(--color-accent)_22%,var(--color-panel))] aria-pressed:after:ml-auto aria-pressed:after:text-accent aria-pressed:after:content-['✓']"
		>
			<!-- The theme in miniature: its bar, with its accent on it. -->
			<span
				class="grid size-5 place-items-center rounded-full border"
				style:background={colours.bg}
				style:border-color={colours.line}
			>
				<span class="size-2 rounded-full" style:background={colours.accent}></span>
			</span>
			{themes[name].label}
		</button>
	{/each}
</Popover>
