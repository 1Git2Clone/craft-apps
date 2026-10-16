<script lang="ts">
	import type { Snippet } from 'svelte';
	import { funnel } from '$lib/funnel';

	let {
		id,
		opener,
		class: className = '',
		children
	}: {
		id: string;
		/** The button that opens it: the animation pours it out of this. */
		opener: HTMLElement | undefined;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div
	{id}
	popover
	{@attach funnel(() => opener)}
	class="fixed inset-auto top-11 m-0 rounded-[10px] border border-line bg-panel text-fg shadow-[0_12px_32px_#0008] {className}"
>
	{@render children()}
</div>
