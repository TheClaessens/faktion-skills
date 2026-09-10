import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export type SkillInvocation = 'model-invoked' | 'user-typed';

export type Skill = {
	name: string;
	description: string;
	invocation: SkillInvocation;
	/** Plugin-relative posix path to `SKILL.md`. */
	sourcePath: string;
};

export type Inventory = {
	version: string;
	skills: Skill[];
};

const skillFrontmatterSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	'disable-model-invocation': z.boolean().optional(),
});

const pluginManifestSchema = z.object({
	version: z.string().min(1),
	skills: z.array(z.string()),
});

const inventorySchema = z.object({
	version: z.string().min(1),
	skills: z.array(
		z.object({
			name: z.string().min(1),
			description: z.string().min(1),
			invocation: z.enum(['model-invoked', 'user-typed']),
			sourcePath: z.string().min(1),
		}),
	),
});

export function loadInventory(pluginRoot: string): Inventory {
	const manifestPath = path.join(pluginRoot, '.claude-plugin', 'plugin.json');
	const manifest = pluginManifestSchema.parse(
		JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
	);

	const skills = manifest.skills.map((entry) => {
		const skillFile = path.join(pluginRoot, entry, 'SKILL.md');
		const relativeFile = toPosix(path.relative(pluginRoot, skillFile));
		if (!fs.existsSync(skillFile)) {
			throw new Error(
				`Skill "${entry}" is listed in the manifest but missing from disk`,
			);
		}
		const raw = fs.readFileSync(skillFile, 'utf8');
		const parsed = skillFrontmatterSchema.safeParse(parseFrontmatter(raw));
		if (!parsed.success) {
			throw new Error(
				`Skill file "${relativeFile}" has missing or malformed frontmatter`,
			);
		}

		return {
			name: parsed.data.name,
			description: parsed.data.description,
			invocation:
				parsed.data['disable-model-invocation'] === true
					? 'user-typed'
					: 'model-invoked',
			sourcePath: relativeFile,
		} satisfies Skill;
	});

	return inventorySchema.parse({ version: manifest.version, skills });
}

export function requireSkill(pluginRoot: string, name: string): Skill {
	const skill = loadInventory(pluginRoot).skills.find((entry) => entry.name === name);
	if (!skill) {
		throw new Error(`Skill "${name}" is not in the plugin inventory`);
	}
	return skill;
}

export type TransformContext = {
	sourcePath: string;
	published: Readonly<Record<string, string>>;
};

export function transformDocument(source: string, context: TransformContext): string {
	return reframeAgentDirected(rewriteRelativeLinks(source, context));
}

function rewriteRelativeLinks(source: string, context: TransformContext): string {
	return source.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label: string, href: string) => {
		const rewritten = resolveHref(href, context);
		if (rewritten.kind === 'keep') {
			return match;
		}
		if (rewritten.kind === 'unpublished') {
			return label;
		}
		return `[${label}](${rewritten.href})`;
	});
}

type ResolvedHref =
	| { kind: 'keep' }
	| { kind: 'unpublished' }
	| { kind: 'route'; href: string };

function resolveHref(href: string, context: TransformContext): ResolvedHref {
	const hashIndex = href.indexOf('#');
	const pathPart = hashIndex === -1 ? href : href.slice(0, hashIndex);
	const hash = hashIndex === -1 ? '' : href.slice(hashIndex);

	if (pathPart === '' || isExternalOrAbsolute(pathPart)) {
		return { kind: 'keep' };
	}

	const fromDir = path.posix.dirname(context.sourcePath);
	const resolved = path.posix.normalize(path.posix.join(fromDir, pathPart));
	const route = context.published[resolved];
	if (!route) {
		return { kind: 'unpublished' };
	}
	return { kind: 'route', href: `${route}${hash}` };
}

function isExternalOrAbsolute(href: string): boolean {
	return (
		/^[a-z]+:/i.test(href) || href.startsWith('/') || href.startsWith('//')
	);
}

function reframeAgentDirected(source: string): string {
	return source
		.replace(/^Read this (when|while|at|before|after)\b/gm, 'This applies $1')
		.replace(/^Read (when|while|at|before|after)\b/gm, 'Applies $1')
		.replace(/\. Read this (when|while|at|before|after)\b/g, '. This applies $1')
		.replace(/\. Read (when|while|at|before|after)\b/g, '. Applies $1');
}

function toPosix(filePath: string): string {
	return filePath.split(path.sep).join('/');
}

const YAML_FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Split a leading YAML fence from the rest of a markdown file. */
export function splitYamlFrontmatter(source: string): {
	yaml: string | undefined;
	body: string;
} {
	const match = source.match(YAML_FRONTMATTER);
	if (!match) {
		return { yaml: undefined, body: source };
	}
	return { yaml: match[1], body: source.slice(match[0].length) };
}

function parseFrontmatter(raw: string): Record<string, unknown> {
	const { yaml } = splitYamlFrontmatter(raw);
	if (yaml === undefined) {
		return {};
	}

	const data: Record<string, unknown> = {};
	for (const line of yaml.split(/\r?\n/)) {
		if (line.trim() === '') {
			continue;
		}
		const separator = line.indexOf(':');
		if (separator === -1) {
			continue;
		}
		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		if (value === 'true') {
			data[key] = true;
		} else if (value === 'false') {
			data[key] = false;
		} else {
			data[key] = value;
		}
	}
	return data;
}
