<script lang="ts">
	import { resolve } from '$app/paths';
	import type { App } from '$lib/apps';

	let { app }: { app: App } = $props();
</script>

<!-- The app itself: upstream's web build, unpacked under /apps/ by
     scripts/fetch-apps.sh. -->
<iframe
	src={resolve(`/apps/${app.id}/`)}
	title="{app.name} editor"
	allow="fullscreen; clipboard-read; clipboard-write; autoplay; microphone"
	class="w-full flex-1 border-0 bg-bg"
></iframe>
