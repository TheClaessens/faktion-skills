import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
	DUTCH_NOTE,
	SOURCE_PAGES,
	publishedRoutes,
	renderSourcePage,
	writeSourcePages,
	type SourcePage,
} from '../src/lib/source-docs';

const fixtures = path.join(
	fileURLToPath(new URL('.', import.meta.url)),
	'fixtures',
	'source-docs',
);

function fixture(name: string): string {
	return fs.readFileSync(path.join(fixtures, name), 'utf8');
}

const barPage: SourcePage = SOURCE_PAGES.find(
	(page) => page.slug === 'the-bar',
)!;

const inventorySkills = [
	{ name: 'ticket-standard', sourcePath: 'skills/ticket-standard/SKILL.md' },
	{ name: 'write-bug', sourcePath: 'skills/write-bug/SKILL.md' },
	{ name: 'review-ticket', sourcePath: 'skills/review-ticket/SKILL.md' },
] as const;

describe('publishedRoutes', () => {
	it('maps every source-derived page onto a site route', () => {
		expect(publishedRoutes('/faktion-skills')).toEqual({
			'skills/ticket-standard/SKILL.md': '/faktion-skills/the-bar/',
			'skills/ticket-standard/smells.md': '/faktion-skills/smells/',
			'skills/ticket-standard/prior-art.md': '/faktion-skills/reference/prior-art/',
			'skills/ticket-standard/intake.md': '/faktion-skills/reference/intake/',
			'skills/ticket-standard/jira.md': '/faktion-skills/reference/jira/',
		});
	});

	it('includes every catalogued source path', () => {
		const published = publishedRoutes();
		for (const page of SOURCE_PAGES) {
			expect(published[page.sourcePath]).toBe(
				`/faktion-skills/${page.slug}/`,
			);
		}
	});

	it('maps inventory skill files onto their skill pages, without displacing source pages', () => {
		const published = publishedRoutes('/faktion-skills', inventorySkills);

		expect(published['skills/write-bug/SKILL.md']).toBe(
			'/faktion-skills/skills/write-bug/',
		);
		expect(published['skills/review-ticket/SKILL.md']).toBe(
			'/faktion-skills/skills/review-ticket/',
		);
		expect(published['skills/ticket-standard/SKILL.md']).toBe(
			'/faktion-skills/the-bar/',
		);
	});
});

describe('renderSourcePage', () => {
	const published = publishedRoutes('/faktion-skills', inventorySkills);

	it('renders from source through the transform, not as a restatement', () => {
		const result = renderSourcePage(fixture('bar.md'), barPage, published);

		expect(result).toContain('The single source of truth for what a good ticket looks like here.');
		expect(result).toContain('Write only what the requester actually described.');
		expect(result).toContain('[`smells.md`](/faktion-skills/smells/)');
		expect(result).toContain('[`intake.md`](/faktion-skills/reference/intake/)');
		expect(result).toContain('[`write-bug`](/faktion-skills/skills/write-bug/)');
		expect(result).toContain('Applies when the input is conversational rather than a written spec.');
		expect(result).not.toContain('](smells.md)');
		expect(result).not.toContain('](intake.md)');
		expect(result).not.toContain('](../write-bug/SKILL.md)');
	});

	it('adds the Dutch-input note only on the bar', () => {
		const smellsPage = SOURCE_PAGES.find((page) => page.slug === 'smells')!;
		const bar = renderSourcePage(fixture('bar.md'), barPage, published);
		const smells = renderSourcePage(fixture('smells.md'), smellsPage, published);

		expect(bar).toContain(DUTCH_NOTE);
		expect(bar).toMatch(/Requests may be written in Dutch/);
		expect(smells).not.toContain(DUTCH_NOTE);
		expect(smells).not.toMatch(/Dutch/);
	});

	it('unwraps a relative link to a document that is not published', () => {
		const result = renderSourcePage(fixture('bar.md'), barPage, published);

		expect(result).toContain('See `secret-notes` before guessing.');
		expect(result).not.toContain('](secret-notes.md)');
	});

	it('strips source frontmatter and the leading heading, and does not rewrite the substance', () => {
		const result = renderSourcePage(fixture('bar.md'), barPage, published);

		expect(result).toContain('title: "The Faktion ticket bar"');
		expect(result).not.toMatch(/^# The Faktion ticket bar$/m);
		expect(result).not.toContain('name: ticket-standard');
		expect(result).toContain('# Generated from skills/ticket-standard/SKILL.md at build time.');
	});
});

describe('writeSourcePages', () => {
	it('writes one transformed page per catalogued source file', () => {
		const pluginRoot = path.join(fixtures, 'plugin');
		const docsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'source-docs-'));

		try {
			writeSourcePages({ pluginRoot, docsDir, siteBase: '/faktion-skills' });

			for (const page of SOURCE_PAGES) {
				const written = fs.readFileSync(
					path.join(docsDir, `${page.slug}.md`),
					'utf8',
				);
				expect(written.startsWith('---\n')).toBe(true);
				expect(written).toContain(`# Generated from ${page.sourcePath} at build time.`);
			}

			const bar = fs.readFileSync(path.join(docsDir, 'the-bar.md'), 'utf8');
			expect(bar).toContain('[`smells.md`](/faktion-skills/smells/)');
			expect(bar).toContain('[`write-bug`](/faktion-skills/skills/write-bug/)');
			expect(bar).toContain('Requests may be written in Dutch');

			const priorArt = fs.readFileSync(
				path.join(docsDir, 'reference/prior-art.md'),
				'utf8',
			);
			expect(priorArt).toContain(
				'[`review-ticket`](/faktion-skills/skills/review-ticket/)',
			);
		} finally {
			fs.rmSync(docsDir, { recursive: true, force: true });
		}
	});
});
