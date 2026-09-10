import fs from 'node:fs';
import path from 'node:path';

/**
 * Capture files live under `site/src/content/walkthrough/`. Site scripts
 * (`npm run build`, `npm test`) run with `site/` as cwd. Do not resolve from
 * `import.meta.url`: the Astro prerender bundle no longer sits next to source.
 */
const WALKTHROUGH_DIR = path.resolve(process.cwd(), 'src/content/walkthrough');

export type CaptureName = 'story-grill' | 'short-grill' | 'bug-grill' | 'product';

export type Annotation = {
	/** Unique substring in one capture block. The note is inserted after that block. */
	after: string;
	title: string;
	body: string;
};

export type Segment =
	| { kind: 'transcript'; markdown: string }
	| { kind: 'annotation'; title: string; body: string };

export function loadCapture(name: CaptureName): string {
	const file = path.join(WALKTHROUGH_DIR, `${name}.md`);
	if (!fs.existsSync(file)) {
		throw new Error(`Walkthrough capture "${name}" is missing from disk`);
	}
	return fs.readFileSync(file, 'utf8');
}

/**
 * Split a grill capture into the capture header (not the conversation) and
 * the session from `## Request` onward.
 */
export function splitGrillCapture(source: string): { meta: string; body: string } {
	const requestAt = source.indexOf('## Request');
	if (requestAt === -1) {
		throw new Error('Walkthrough capture has no ## Request heading');
	}
	const header = source.slice(0, requestAt).trim();
	const meta = header.replace(/^#[^\n]+\n+/, '').trim();
	const body = source.slice(requestAt).trim();
	if (!meta) {
		throw new Error('Walkthrough capture is missing its capture header');
	}
	return { meta, body };
}

export function segmentsWithAnnotations(
	body: string,
	annotations: readonly Annotation[],
): Segment[] {
	for (const annotation of annotations) {
		if (!body.includes(annotation.after)) {
			throw new Error(
				`Walkthrough annotation anchor not found: ${JSON.stringify(annotation.after)}`,
			);
		}
	}

	const blocks = body.split(/\n{2,}/);
	const remaining = [...annotations];
	const segments: Segment[] = [];
	let transcript: string[] = [];

	const flushTranscript = () => {
		if (transcript.length === 0) {
			return;
		}
		segments.push({ kind: 'transcript', markdown: transcript.join('\n\n') });
		transcript = [];
	};

	for (const block of blocks) {
		transcript.push(block);
		const hits = remaining.filter((annotation) => block.includes(annotation.after));
		if (hits.length === 0) {
			continue;
		}
		flushTranscript();
		for (const annotation of hits) {
			segments.push({
				kind: 'annotation',
				title: annotation.title,
				body: annotation.body,
			});
		}
		const hitSet = new Set(hits);
		remaining.splice(
			0,
			remaining.length,
			...remaining.filter((annotation) => !hitSet.has(annotation)),
		);
	}
	flushTranscript();

	if (remaining.length > 0) {
		throw new Error(
			`Walkthrough annotation did not land on a block: ${remaining
				.map((annotation) => annotation.title)
				.join(', ')}`,
		);
	}

	return segments;
}

export function renderMarkdown(markdown: string): string {
	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const html: string[] = [];
	let index = 0;

	while (index < lines.length) {
		const line = lines[index];
		if (line.trim() === '') {
			index += 1;
			continue;
		}
		if (line.trim() === '---') {
			html.push('<hr />');
			index += 1;
			continue;
		}
		if (line.startsWith('## ')) {
			html.push(`<h3>${renderInline(line.slice(3))}</h3>`);
			index += 1;
			continue;
		}
		if (line.startsWith('# ')) {
			html.push(`<h3>${renderInline(line.slice(2))}</h3>`);
			index += 1;
			continue;
		}
		if (line.startsWith('- ')) {
			const items: string[] = [];
			while (index < lines.length && lines[index].startsWith('- ')) {
				items.push(`<li>${renderInline(lines[index].slice(2))}</li>`);
				index += 1;
			}
			html.push(`<ul>${items.join('')}</ul>`);
			continue;
		}
		if (/^\d+\. /.test(line)) {
			const items: string[] = [];
			while (index < lines.length && /^\d+\. /.test(lines[index])) {
				items.push(
					`<li>${renderInline(lines[index].replace(/^\d+\. /, ''))}</li>`,
				);
				index += 1;
			}
			html.push(`<ol>${items.join('')}</ol>`);
			continue;
		}

		const paragraph: string[] = [];
		while (
			index < lines.length &&
			lines[index].trim() !== '' &&
			lines[index].trim() !== '---' &&
			!lines[index].startsWith('# ') &&
			!lines[index].startsWith('## ') &&
			!lines[index].startsWith('- ') &&
			!/^\d+\. /.test(lines[index])
		) {
			paragraph.push(lines[index]);
			index += 1;
		}
		html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
	}

	return html.join('\n');
}

function renderInline(text: string): string {
	return escapeHtml(text)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

export const STORY_ANNOTATIONS: Annotation[] = [
	{
		after: 'fires the delete smell',
		title: 'Functional-vagueness pushback',
		body: 'This is the question a finished-sounding request still hides. Soft delete and hard delete are different products, and a developer who shipped either could honestly say they followed the sentence. The grill names that fork and asks. Recording the ambiguity and drafting anyway is the failure this skill exists to prevent. The question itself is Q3, once Persona and Trigger have been asked.',
	},
	{
		after: 'whether the audio is deleted on day 30 — is parked',
		title: 'A parked gap',
		body: '"I don\'t know" settled the question. It did not license a guess. The gap is named here and will travel with the brief; it is not filled in so the interrogation can stop.',
	},
	{
		after: 'Not bulk delete, not deleting the whole project, not GDPR-erasure-as-a-button.',
		title: 'A stated boundary',
		body: 'Q5 is the branch that usually gets skipped. The requester names what is deliberately not in the ticket: not bulk delete, not deleting the project, not GDPR-erasure-as-a-button. A ticket that says what it excludes is the cheapest defence against a developer building the excluded thing.',
	},
	{
		after: 'No drafting until you confirm this.',
		title: 'Why there is still no ticket',
		body: 'Every branch is answered or parked, and the agent still does not draft. A draft on screen is visible progress; the confirmation question is not. If both are in front of you, the interrogation stops early. You confirm the brief first. The ticket comes after.',
	},
	{
		after: '**Open question — audio on day 30.**',
		title: 'The parked gap on the ticket',
		body: 'The same gap is now a named open question on the ticket a developer would pick up. It was parked when the requester could not answer, it sat on the brief, and it was not closed at draft time. That is the whole route: asked, parked, and still visible.',
	},
];

export const SHORT_GRILL_ANNOTATIONS: Annotation[] = [
	{
		after: 'All six branches are in the opening.',
		title: 'This is the whole cost of always starting at the grill',
		body: 'The grill still ran. It asked nothing. A request that already answers the tree is confirmed in a single nod. Always-on grilling does not mean a round of questions every time — that would waste the patience the thin requests need.',
	},
];

export const BUG_ANNOTATIONS: Annotation[] = [
	{
		after: 'no persona, and I am not guessing why it breaks',
		title: 'What changes for a bug',
		body: 'Bugs take a different path from stories. Two differences, named here and kept to the end of the ticket: there is no persona, and the ticket will not invent a root cause. Trigger is the reproduction path. Behaviour is expected versus actual.',
	},
	{
		after: 'the ticket will not say either',
		title: 'No invented root cause',
		body: 'An invented cause sends a developer somewhere specific and wrong. The reporter did not diagnose it, so the ticket does not say why it breaks. That is stricter than the story rule against invented requirements.',
	},
	{
		after: '**Persona:** None — bug.',
		title: 'No persona',
		body: 'The brief records no persona, and the draft title states the broken behaviour. Forcing "As a User I want…" onto a defect would make it read as a feature request for the bug.',
	},
];
