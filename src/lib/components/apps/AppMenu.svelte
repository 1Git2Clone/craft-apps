<script lang="ts">
	import { apps, categories, type App } from '$lib/apps';
	import Popover from '$lib/components/layout/Popover.svelte';
	import AppMenuItem from '$lib/components/apps/AppMenuItem.svelte';

	let { app, opener }: { app: App; opener: HTMLElement | undefined } = $props();

	// The menu's groups, each with its apps, empty ones left out.
	const groups = categories
		.map((category) => ({ category, apps: apps.filter((other) => other.category === category) }))
		.filter((group) => group.apps.length > 0);
</script>

<Popover
	id="menu"
	{opener}
	class="left-3 max-h-[calc(100vh-56px)] w-[min(300px,calc(100vw-24px))] overflow-auto p-2"
>
	<!-- About six apps tall, then it scrolls. -->
	<nav class="max-h-[calc(6*46px+3*28px)] overflow-y-auto">
		{#each groups as group (group.category)}
			<h2 class="mx-2.5 mt-1.5 mb-1 text-[10px] font-semibold tracking-[0.12em] text-dim uppercase">
				{group.category}
			</h2>
			{#each group.apps as other (other.id)}
				<AppMenuItem app={other} current={other.id === app.id} />
			{/each}
		{/each}
	</nav>
	<p class="mx-2.5 mt-2 mb-1 border-t border-line pt-2 text-[11px] text-dim">
		Unofficial host. Not affiliated with ArtCraft.
	</p>
</Popover>
