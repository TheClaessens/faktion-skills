// @ts-check
import path from 'node:path';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { loadInventory } from './src/lib/content.ts';
import { PM_PLUGIN_ROOT } from './src/lib/plugin-root.ts';
import {
	SITE_BASE,
	SOURCE_PAGES,
	writeSourcePages,
} from './src/lib/source-docs.ts';

const docsDir = path.resolve('src/content/docs');

function generateSourceDocs() {
	writeSourcePages({
		pluginRoot: PM_PLUGIN_ROOT,
		docsDir,
		siteBase: SITE_BASE,
	});
}

// Schema-validate the live inventory at build time. A manifest that disagrees
// with disk fails the build instead of publishing a wrong page.
loadInventory(PM_PLUGIN_ROOT);

// Render the bar, smells, and reference pages from plugin source so the site
// cannot drift from the file the tool enforces. Must run before Starlight
// loads the docs collection.
generateSourceDocs();

// https://astro.build/config
export default defineConfig({
	site: 'https://theclaessens.github.io',
	base: SITE_BASE,
	integrations: [
		starlight({
			title: 'Faktion skills',
			description:
				'Ticket-writing skills for Faktion PMs: grill vague requests, draft against the house bar, and push to JIRA only after you approve.',
			// English only. Do not add `locales` — a Dutch translation is a later, additive change.
			logo: {
				light: './src/assets/brand/faktion-wordmark-on-light.svg',
				dark: './src/assets/brand/faktion-wordmark-on-dark.svg',
				alt: 'Faktion',
				replacesTitle: true,
			},
			customCss: [
				'@fontsource/barlow/latin-400.css',
				'@fontsource/barlow/latin-500.css',
				'@fontsource/barlow/latin-600.css',
				'@fontsource/barlow/latin-700.css',
				'@fontsource/barlow/latin-ext-400.css',
				'@fontsource/barlow/latin-ext-600.css',
				'./src/styles/theme.css',
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/TheClaessens/faktion-skills',
				},
			],
			sidebar: [
				{ label: 'Install', slug: 'install' },
				{ label: 'The bar', slug: 'the-bar' },
				{ label: 'Smells', slug: 'smells' },
				{ label: 'How it works', slug: 'how-it-works' },
				{ label: "What it won't do", slug: 'what-it-wont-do' },
				{
					label: 'Reference',
					items: [
						{ label: 'Prior art', slug: 'reference/prior-art' },
						{ label: 'Intake', slug: 'reference/intake' },
						{ label: 'JIRA mechanics', slug: 'reference/jira' },
					],
				},
			],
		}),
	],
	vite: {
		plugins: [
			{
				name: 'generate-source-docs',
				buildStart() {
					generateSourceDocs();
					for (const page of SOURCE_PAGES) {
						this.addWatchFile(
							path.join(PM_PLUGIN_ROOT, ...page.sourcePath.split('/')),
						);
					}
				},
			},
		],
	},
});
