<script lang="ts">
	import { github, type App } from '$lib/apps';

	let { app }: { app: App } = $props();
</script>

<!-- A link to the release notes, dressed as a button. It grows with a
     transform, which leaves the layout alone, so the bar never moves. -->
<a
	href="{github(app)}/releases/tag/v{app.version}"
	target="_blank"
	rel="noopener"
	title="The release published here. Renovate opens a pull request for each new one."
	class="inline-flex items-center gap-1.25 rounded-md px-2 py-0.75 text-xs leading-none whitespace-nowrap text-accent no-underline transition-[background-color,transform] duration-150 before:text-[9px] before:content-['●'] hover:scale-106 hover:bg-accent/14 focus-visible:scale-106 focus-visible:bg-accent/14 focus-visible:outline-none active:scale-102"
>
	v{app.version} · pinned
</a>
