import fs from 'node:fs';
import path from 'node:path';
import {
	loadInventory,
	splitYamlFrontmatter,
	transformDocument,
	type Skill,
} from './content';
import { skillPageHref } from './skill-pages';

/**
 * Public pathname prefix. Keep in lockstep with `base` in astro.config.mjs.
 * Published markdown links are root-absolute, so they need this prefix or
 * they 404 on GitHub Pages.
 */
export const SITE_BASE = '/faktion-skills';

export const DUTCH_NOTE = [
	':::note',
	'Requests may be written in Dutch. The tool accepts Dutch input; you do not need to translate into English first.',
	':::',
].join('\n');

export type SourcePage = {
	/** Posix path relative to the plugin root. */
	sourcePath: string;
	/** Starlight slug, which is also the site route under `SITE_BASE`. */
	slug: string;
	description: string;
	dutchNote?: boolean;
};

export const SOURCE_PAGES: readonly SourcePage[] = [
	{
		sourcePath: 'skills/ticket-standard/SKILL.md',
		slug: 'the-bar',
		description:
			'The Faktion house ticket standard: title convention, description shape, Definition of Done, and scope rules.',
		dutchNote: true,
	},
	{
		sourcePath: 'skills/ticket-standard/smells.md',
		slug: 'smells',
		description:
			'Functional-vagueness smells: phrases that read as settled and are not.',
	},
	{
		sourcePath: 'skills/ticket-standard/prior-art.md',
		slug: 'reference/prior-art',
		description:
			'How the tool searches existing tickets, and what it may not take from them.',
	},
	{
		sourcePath: 'skills/ticket-standard/intake.md',
		slug: 'reference/intake',
		description: 'Turning a rambling or spoken brain-dump into requirements.',
	},
	{
		sourcePath: 'skills/ticket-standard/jira.md',
		slug: 'reference/jira',
		description:
			'Pushing to JIRA: connector tools, markdown format, epics and batches.',
	},
];

export function publishedRoutes(
	base: string = SITE_BASE,
	skills: readonly Pick<Skill, 'name' | 'sourcePath'>[] = [],
): Record<string, string> {
	const prefix = base.replace(/\/$/, '');
	const published: Record<string, string> = {};
	for (const page of SOURCE_PAGES) {
		published[page.sourcePath] = `${prefix}/${page.slug}/`;
	}
	for (const skill of skills) {
		if (published[skill.sourcePath] !== undefined) {
			continue;
		}
		published[skill.sourcePath] = `${prefix}${skillPageHref(skill)}`;
	}
	return published;
}

export function renderSourcePage(
	source: string,
	page: SourcePage,
	published: Readonly<Record<string, string>>,
): string {
	const transformed = transformDocument(splitYamlFrontmatter(source).body, {
		sourcePath: page.sourcePath,
		published,
	});
	const { title, body } = takeLeadingH1(transformed);
	const pageTitle = title ?? page.slug;

	const lines = [
		'---',
		`title: ${yamlQuote(pageTitle)}`,
		`description: ${yamlQuote(page.description)}`,
		`# Generated from ${page.sourcePath} at build time. Do not edit.`,
		'---',
		'',
	];
	if (page.dutchNote) {
		lines.push(DUTCH_NOTE, '');
	}
	lines.push(body.trimEnd(), '');
	return lines.join('\n');
}

export function writeSourcePages(options: {
	pluginRoot: string;
	docsDir: string;
	siteBase?: string;
}): void {
	const published = publishedRoutes(
		options.siteBase ?? SITE_BASE,
		loadInventory(options.pluginRoot).skills,
	);
	for (const page of SOURCE_PAGES) {
		const abs = path.join(options.pluginRoot, ...page.sourcePath.split('/'));
		if (!fs.existsSync(abs)) {
			throw new Error(`Source document missing: ${page.sourcePath}`);
		}
		const markdown = renderSourcePage(
			fs.readFileSync(abs, 'utf8'),
			page,
			published,
		);
		const outPath = path.join(options.docsDir, `${page.slug}.md`);
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, markdown);
	}
}

function takeLeadingH1(source: string): { title: string | undefined; body: string } {
	const match = source.match(/^\s*#\s+(.+?)\s*\n+/);
	if (!match) {
		return { title: undefined, body: source };
	}
	return { title: match[1].trim(), body: source.slice(match[0].length) };
}

function yamlQuote(value: string): string {
	return JSON.stringify(value);
}
