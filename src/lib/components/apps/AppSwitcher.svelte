<script lang="ts">
	import type { App } from '$lib/apps';
	import AppMenu from '$lib/components/apps/AppMenu.svelte';
	import ChevronDown from '$lib/components/icons/ChevronDown.svelte';

	let { app }: { app: App } = $props();

	let button = $state<HTMLButtonElement>();
</script>

<button
	bind:this={button}
	popovertarget="menu"
	aria-haspopup="true"
	class="flex cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 py-1 hover:border-line hover:bg-panel focus-visible:border-line focus-visible:bg-panel"
>
	{app.name}
	<ChevronDown />
</button>

<AppMenu {app} opener={button} />
