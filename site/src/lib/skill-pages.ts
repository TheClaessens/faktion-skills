import type { Skill, SkillInvocation } from './content';

const GITHUB_BLOB_ROOT =
	'https://github.com/faktionbe/faktion-skills/blob/main/plugins/faktion-pm-skills';

/**
 * Site path for a skill page, without Astro `base`.
 * A second plugin later is a change here, not a new page file per skill.
 */
export function skillPageHref(skill: Pick<Skill, 'name'>): string {
	return `/skills/${skill.name}/`;
}

export function skillSourceUrl(skill: Pick<Skill, 'sourcePath'>): string {
	return `${GITHUB_BLOB_ROOT}/${skill.sourcePath}`;
}

export function invocationLabel(invocation: SkillInvocation): string {
	return invocation === 'user-typed' ? 'Typed by a user' : 'Model-invoked';
}
