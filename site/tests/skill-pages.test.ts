import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadInventory } from '../src/lib/content';
import { skillPageHref, skillSourceUrl } from '../src/lib/skill-pages';

const fixtures = path.join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');

function pluginFixture(name: string): string {
	return path.join(fixtures, 'plugins', name);
}

describe('skill page routes', () => {
	it('maps each inventory skill to a /skills/{name}/ href and a GitHub source URL', () => {
		const inventory = loadInventory(pluginFixture('complete'));

		expect(inventory.skills.map(skillPageHref)).toEqual([
			'/skills/grill-brief/',
			'/skills/front-door/',
		]);

		expect(skillSourceUrl(inventory.skills[0])).toBe(
			'https://github.com/TheClaessens/faktion-skills/blob/main/plugins/faktion-pm-skills/skills/grill-brief/SKILL.md',
		);
		expect(skillSourceUrl(inventory.skills[1])).toBe(
			'https://github.com/TheClaessens/faktion-skills/blob/main/plugins/faktion-pm-skills/skills/front-door/SKILL.md',
		);
	});
});
