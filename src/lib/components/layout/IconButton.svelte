<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		element = $bindable(),
		children,
		...rest
	}: HTMLButtonAttributes & { element?: HTMLButtonElement; children: Snippet } = $props();
</script>

<button bind:this={element} class="flex cursor-pointer p-1 text-dim hover:text-fg" {...rest}>
	{@render children()}
</button>
