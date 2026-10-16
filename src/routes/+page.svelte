<script lang="ts">
	import { onMount } from 'svelte';
	import { apps, findApp } from '$lib/apps';

	// The bare host has no app of its own: send it to one. Links from before
	// each app had a path carry it in the hash (/#photocraft), which only the
	// browser can see, so this happens here rather than as a redirect.
	onMount(() => {
		const app = findApp(location.hash.slice(1)) ?? apps[0];
		location.replace(`/${app.id}/`);
	});
</script>

<svelte:head>
	<title>Crafts</title>
	<noscript><meta http-equiv="refresh" content="0; url=/{apps[0].id}/" /></noscript>
</svelte:head>
