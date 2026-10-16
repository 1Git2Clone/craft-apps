<script lang="ts">
	import { apps, github } from '$lib/apps';
	import { funnel } from '$lib/funnel';

	let { data } = $props();
	let app = $derived(data.app);

	let switchButton = $state<HTMLButtonElement>();
	let aboutButton = $state<HTMLButtonElement>();
	let menu = $state<HTMLElement>();

	function toggleFullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else document.documentElement.requestFullscreen();
	}

	const popover =
		'fixed inset-auto top-11 m-0 rounded-[10px] border border-line bg-panel text-fg shadow-[0_12px_32px_#0008]';
	const iconButton = 'flex cursor-pointer p-1 text-dim hover:text-fg';
	const link = 'text-accent underline';
</script>

<svelte:head>
	<title>{app.name} · Crafts</title>
	<meta name="description" content="{app.name} ({app.description}) in your browser. An unofficial host of the open-source ArtCraft app." />
</svelte:head>

<div class="flex h-full flex-col">
	<header class="flex h-10 flex-none items-center gap-3 border-b border-line px-3">
		<span class="text-base font-bold tracking-tight text-accent max-[480px]:hidden">Crafts</span>
		<span class="rounded border border-line px-1.5 py-px text-[11px] text-dim max-[480px]:hidden">
			unofficial
		</span>
		<span class="h-[18px] w-px bg-line max-[480px]:hidden"></span>

		<button
			bind:this={switchButton}
			popovertarget="menu"
			aria-haspopup="true"
			class="flex cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 py-1 hover:border-line hover:bg-panel focus-visible:border-line focus-visible:bg-panel"
		>
			{app.name}
			<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
		</button>

		<!-- A link to the release notes, dressed as a button. It grows with a
		     transform, which leaves the layout alone, so the bar never moves. -->
		<a
			href="{github(app)}/releases/tag/v{app.version}"
			target="_blank"
			rel="noopener"
			title="The release published here. Renovate opens a pull request for each new one."
			class="inline-flex items-center gap-[5px] rounded-md px-2 py-[3px] text-xs leading-none whitespace-nowrap text-accent no-underline transition-[background-color,transform] duration-150 before:text-[9px] before:content-['●'] hover:scale-106 hover:bg-accent/14 focus-visible:scale-106 focus-visible:bg-accent/14 focus-visible:outline-none active:scale-102"
		>
			v{app.version} · pinned
		</a>

		<span class="flex-1"></span>

		<button bind:this={aboutButton} popovertarget="about" title="About" class={iconButton}>
			<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
		</button>
		<button onclick={toggleFullscreen} title="Fullscreen" class={iconButton}>
			<svg viewBox="0 0 24 24">
				<path
					d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
				/>
			</svg>
		</button>
	</header>

	<div
		id="menu"
		popover
		bind:this={menu}
		{@attach funnel(() => switchButton)}
		class="{popover} left-3 max-h-[calc(100vh-56px)] w-[min(300px,calc(100vw-24px))] overflow-auto p-2"
	>
		<h2 class="mx-2.5 mt-1.5 mb-2 text-[10px] font-semibold tracking-[0.12em] text-dim uppercase">
			Apps
		</h2>
		<nav>
			{#each apps as other (other.id)}
				<a
					href="/{other.id}/"
					onclick={() => menu?.hidePopover()}
					aria-current={other.id === app.id ? 'page' : undefined}
					style:--app-colour={other.colour}
					class="flex items-center gap-3 rounded-lg px-2.5 py-2 no-underline hover:bg-hover focus-visible:bg-hover focus-visible:outline-none aria-[current]:bg-[color-mix(in_srgb,var(--color-accent)_22%,var(--color-panel))] aria-[current]:after:ml-auto aria-[current]:after:text-accent aria-[current]:after:content-['✓']"
				>
					<span
						class="grid size-[30px] place-items-center rounded-[7px] border border-line text-(--app-colour)"
					>
						<svg viewBox="0 0 24 24">{@html other.icon}</svg>
					</span>
					<span>
						{other.name}
						<small class="block text-[11px] text-dim">{other.description}</small>
					</span>
				</a>
			{/each}
		</nav>
		<p class="mx-2.5 mt-2 mb-1 border-t border-line pt-2 text-[11px] text-dim">
			Unofficial host. Not affiliated with ArtCraft.
		</p>
	</div>

	<div
		id="about"
		popover
		{@attach funnel(() => aboutButton)}
		class="{popover} right-3 w-[min(340px,calc(100vw-24px))] px-4 py-3.5"
	>
		<h2 class="mb-2 text-sm font-bold">Unofficial host</h2>
		<p class="mb-2.5 text-dim">
			This is not an official ArtCraft site, and I am not affiliated with or endorsed by ArtCraft or
			Storytold. These are their open-source web builds, served unmodified from my own server.
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
				<a class={link} href="https://git.hu-tao.dev/craft-projects/pages" target="_blank" rel="noopener">
					How this site is published
				</a>
			</li>
		</ul>
	</div>

	<!-- The app itself: upstream's web build, unpacked under /apps/ by
	     scripts/fetch-apps.sh. -->
	<iframe
		src="/apps/{app.id}/"
		title="{app.name} editor"
		allow="fullscreen; clipboard-read; clipboard-write; autoplay; microphone"
		class="w-full flex-1 border-0 bg-bg"
	></iframe>
</div>
