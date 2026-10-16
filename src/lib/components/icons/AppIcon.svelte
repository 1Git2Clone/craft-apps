<script lang="ts">
	import type { App } from '$lib/apps';
	import { colours } from '$lib/colours';
	import { icons } from '$lib/icons';

	let { app }: { app: App } = $props();
</script>

<!-- An app's icon in a small box, drawn in the app's own colour. -->
<span
	class="grid size-7.5 place-items-center rounded-[7px] border border-line"
	style:color={colours[app.colour]}
>
	<svg viewBox="0 0 24 24" aria-hidden="true">{@html icons[app.icon]}</svg>
</span>
