<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import AppFrame from '$lib/components/apps/AppFrame.svelte';

	let { data } = $props();
	let app = $derived(data.app);
</script>

<svelte:head>
	<title>{app.name} · Crafts</title>
	<meta
		name="description"
		content="{app.name} in your browser: an unofficial host of the open-source app."
	/>
</svelte:head>

<div class="flex h-full flex-col">
	<Header {app} />
	<AppFrame {app} />
</div>
