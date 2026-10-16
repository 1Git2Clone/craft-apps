<script lang="ts">
	import { resolve } from '$app/paths';
	import type { App } from '$lib/apps';
	import AppIcon from '$lib/components/icons/AppIcon.svelte';

	let { app, current }: { app: App; current: boolean } = $props();

	// Picking an app navigates; the menu it sits in closes behind it.
	function close(event: MouseEvent) {
		(event.currentTarget as HTMLElement).closest<HTMLElement>('[popover]')?.hidePopover();
	}
</script>

<a
	href={resolve(`/${app.id}/`)}
	onclick={close}
	aria-current={current ? 'page' : undefined}
	class="flex items-center gap-3 rounded-lg px-2.5 py-2 no-underline hover:bg-hover focus-visible:bg-hover focus-visible:outline-none aria-[current]:bg-[color-mix(in_srgb,var(--color-accent)_22%,var(--color-panel))] aria-[current]:after:ml-auto aria-[current]:after:text-accent aria-[current]:after:content-['✓']"
>
	<AppIcon {app} />
	<span>
		{app.name}
		<small class="block text-[11px] text-dim">{app.description}</small>
	</span>
</a>
