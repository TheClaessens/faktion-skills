import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadInventory, transformDocument } from '../src/lib/content';

const fixtures = path.join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');

function pluginFixture(name: string): string {
	return path.join(fixtures, 'plugins', name);
}

function transformFixture(name: string): string {
	return fs.readFileSync(path.join(fixtures, 'transform', name), 'utf8');
}

describe('loadInventory', () => {
	it('reads the plugin version from the manifest', () => {
		const inventory = loadInventory(pluginFixture('complete'));

		expect(inventory.version).toBe('3.2.1');
	});

	it('returns each listed skill with name, description, and invocation flag', () => {
		const inventory = loadInventory(pluginFixture('complete'));

		expect(inventory.skills).toEqual([
			{
				name: 'grill-brief',
				description: 'Interview until the scope is settled.',
				invocation: 'model-invoked',
			},
			{
				name: 'front-door',
				description: 'The one name a user types.',
				invocation: 'user-typed',
			},
		]);
	});

	it('fails the load when a listed skill is absent from disk, naming the skill', () => {
		expect(() => loadInventory(pluginFixture('missing-skill'))).toThrow(
			'Skill "./skills/ghost-brief" is listed in the manifest but missing from disk',
		);
	});

	it('fails the load when a skill file has no frontmatter, naming the file', () => {
		expect(() => loadInventory(pluginFixture('missing-frontmatter'))).toThrow(
			'Skill file "skills/broken-brief/SKILL.md" has missing or malformed frontmatter',
		);
	});

	it('fails the load when skill frontmatter is missing a required field, naming the file', () => {
		expect(() => loadInventory(pluginFixture('malformed-frontmatter'))).toThrow(
			'Skill file "skills/quiet-brief/SKILL.md" has missing or malformed frontmatter',
		);
	});
});

describe('transformDocument', () => {
	it('rewrites relative links between skill files into site routes', () => {
		const source = transformFixture('relative-skill-link.md');

		const result = transformDocument(source, {
			sourcePath: 'ticket-bar/SKILL.md',
			published: {
				'other-skill/SKILL.md': '/skills/other-skill/',
			},
		});

		expect(result).toBe('See [`other-skill`](/skills/other-skill/) for the next step.\n');
	});

	it('drops the href of a relative link to a document that is not published', () => {
		const source = transformFixture('unpublished-link.md');

		const result = transformDocument(source, {
			sourcePath: 'ticket-bar/SKILL.md',
			published: {
				'other-skill/SKILL.md': '/skills/other-skill/',
			},
		});

		expect(result).toBe('Ask `secret-notes` before drafting.\n');
	});

	it('reframes agent-directed lines and changes nothing else', () => {
		const source = transformFixture('agent-directed.md');

		const result = transformDocument(source, {
			sourcePath: 'ticket-bar/SKILL.md',
			published: {},
		});

		expect(result).toBe(transformFixture('agent-directed.expected.md'));
	});

	it('rewrites sibling links and hashes, keeps external URLs, and reframes on the same line', () => {
		const source = transformFixture('composed.md');

		const result = transformDocument(source, {
			sourcePath: 'ticket-bar/SKILL.md',
			published: {
				'ticket-bar/intake.md': '/reference/intake/',
				'ticket-bar/smells.md': '/smells/',
			},
		});

		expect(result).toBe(
			[
				'- [`intake.md`](/reference/intake/) - turning a ramble into requirements. Applies when the input is conversational.',
				'- [`smells.md`](/smells/#catalogue) - functional vagueness.',
				'',
				'See the [guide](https://example.com/guide) for an external reference.',
				'',
			].join('\n'),
		);
	});

	it('leaves a document with no rewrite targets unchanged', () => {
		const source = transformFixture('unchanged.md');

		const result = transformDocument(source, {
			sourcePath: 'ticket-bar/SKILL.md',
			published: {},
		});

		expect(result).toBe(source);
	});
});
