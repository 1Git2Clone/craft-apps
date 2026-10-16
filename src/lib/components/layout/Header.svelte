<script lang="ts">
	import { onMount } from 'svelte';
	import type { App } from '$lib/apps';
	import { theme, loadTheme } from '$lib/theme.svelte';
	import { themeStyle } from '$lib/themes';
	import ThemePicker from '$lib/components/apps/ThemePicker.svelte';
	import About from '$lib/components/apps/About.svelte';
	import AppSwitcher from '$lib/components/apps/AppSwitcher.svelte';
	import VersionBadge from '$lib/components/apps/VersionBadge.svelte';
	import IconButton from '$lib/components/layout/IconButton.svelte';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';

	let { app }: { app: App } = $props();

	onMount(loadTheme);

	function toggleFullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else document.documentElement.requestFullscreen();
	}
</script>

<!-- The menus sit with their buttons in here. As open popovers they render
     in the top layer, so where they are in the page does not change where
     they show, while they still inherit the theme set on this element. The
     theme stops here: the apps below keep their own colours. -->
<header
	style={themeStyle(theme.name)}
	class="flex h-10 flex-none items-center gap-3 border-b border-line bg-bg px-3 text-fg"
>
	<span class="text-base font-bold tracking-tight text-accent max-[480px]:hidden">Crafts</span>
	<span class="rounded border border-line px-1.5 py-px text-[11px] text-dim max-[480px]:hidden">
		unofficial
	</span>
	<span class="h-4.5 w-px bg-line max-[480px]:hidden"></span>

	<AppSwitcher {app} />
	<VersionBadge {app} />

	<span class="flex-1"></span>

	<ThemePicker />
	<About {app} />
	<IconButton onclick={toggleFullscreen} title="Fullscreen">
		<Fullscreen />
	</IconButton>
</header>
