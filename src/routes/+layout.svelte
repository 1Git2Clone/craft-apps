<script lang="ts">
	import { onMount } from 'svelte';
	import { loadTheme } from '$lib/theme.svelte';
	import './layout.css';

	let { children } = $props();

	onMount(loadTheme);
</script>

{@render children()}
