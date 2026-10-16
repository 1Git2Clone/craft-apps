<script lang="ts">
	import type { App } from '$lib/apps';
	import AboutPanel from '$lib/components/apps/AboutPanel.svelte';
	import IconButton from '$lib/components/layout/IconButton.svelte';
	import Info from '$lib/components/icons/Info.svelte';

	let { app }: { app: App } = $props();

	let button = $state<HTMLButtonElement>();
</script>

<IconButton bind:element={button} popovertarget="about" title="About">
	<Info />
</IconButton>

<AboutPanel {app} opener={button} />
