<script lang="ts">
	import { github, type App } from '$lib/apps';
	import Popover from '$lib/components/layout/Popover.svelte';

	let { app, opener }: { app: App; opener: HTMLElement | undefined } = $props();

	const link = 'text-accent underline';
</script>

<Popover id="about" {opener} class="right-3 w-[min(340px,calc(100vw-24px))] px-4 py-3.5">
	<h2 class="mb-2 text-sm font-bold">Unofficial host</h2>
	<p class="mb-2.5 text-dim">
		This is not an official ArtCraft site, and it is not affiliated with or endorsed by ArtCraft or
		Storytold. These are their open-source web builds, served unmodified.
	</p>
	<p class="mb-2.5 text-dim">{app.name} is licensed under MIT or Apache-2.0, at your option.</p>
	<ul class="grid gap-1.5">
		<li><a class={link} href={github(app)} target="_blank" rel="noopener">Source on GitHub</a></li>
		<li>
			<a class={link} href="{github(app)}/blob/main/LICENSE-MIT" target="_blank" rel="noopener">
				LICENSE-MIT
			</a>
			·
			<a class={link} href="{github(app)}/blob/main/LICENSE-APACHE" target="_blank" rel="noopener">
				LICENSE-APACHE
			</a>
			·
			<a class={link} href="{github(app)}/blob/main/NOTICE" target="_blank" rel="noopener">NOTICE</a>
		</li>
		<li>
			<a class={link} href={__SOURCE_URL__} target="_blank" rel="noopener">
				How this site is published
			</a>
		</li>
	</ul>
</Popover>
