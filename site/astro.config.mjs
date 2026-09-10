// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { loadInventory } from './src/lib/content.ts';
import { PM_PLUGIN_ROOT } from './src/lib/plugin-root.ts';

// Schema-validate the live inventory at build time. A manifest that disagrees
// with disk fails the build instead of publishing a wrong page.
loadInventory(PM_PLUGIN_ROOT);

// https://astro.build/config
export default defineConfig({
	site: 'https://theclaessens.github.io',
	base: '/faktion-skills',
	integrations: [
		starlight({
			title: 'Faktion skills',
			description:
				'Ticket-writing skills for Faktion PMs: grill vague requests, draft against the house bar, and push to JIRA only after you approve.',
			// English only. Do not add `locales` — a Dutch translation is a later, additive change.
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/TheClaessens/faktion-skills',
				},
			],
			sidebar: [
				{ label: 'Overview', slug: 'overview' },
				{ label: 'How it works', slug: 'how-it-works' },
			],
		}),
	],
});
