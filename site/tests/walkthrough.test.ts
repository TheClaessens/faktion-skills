import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
	BUG_ANNOTATIONS,
	loadCapture,
	segmentsWithAnnotations,
	SHORT_GRILL_ANNOTATIONS,
	splitGrillCapture,
	STORY_ANNOTATIONS,
	type Annotation,
} from '../src/lib/walkthrough';

const fixtures = path.join(
	fileURLToPath(new URL('.', import.meta.url)),
	'fixtures',
	'walkthrough',
);

describe('walkthrough annotations', () => {
	it('inserts a note after the block that contains the anchor, without rewriting the transcript', () => {
		const body = [
			'## Request',
			'',
			'**Requester:** Create a way to delete a transcription session.',
			'',
			'**Agent:** The smell fires here.',
			'',
			'**Agent:** Later.',
		].join('\n');

		const annotations: Annotation[] = [
			{
				after: 'fires here',
				title: 'A note',
				body: 'Editorial.',
			},
		];

		const segments = segmentsWithAnnotations(body, annotations);

		expect(segments).toEqual([
			{
				kind: 'transcript',
				markdown:
					'## Request\n\n**Requester:** Create a way to delete a transcription session.\n\n**Agent:** The smell fires here.',
			},
			{ kind: 'annotation', title: 'A note', body: 'Editorial.' },
			{
				kind: 'transcript',
				markdown: '**Agent:** Later.',
			},
		]);
	});

	it('fails when an anchor is missing from the capture', () => {
		expect(() =>
			segmentsWithAnnotations('## Request\n\nHello.', [
				{ after: 'not present', title: 'Gone', body: 'x' },
			]),
		).toThrow('Walkthrough annotation anchor not found');
	});
});

describe('captured transcripts', () => {
	it('still contain every story, short-grill, and bug annotation anchor', () => {
		const cases = [
			['story-grill', STORY_ANNOTATIONS],
			['short-grill', SHORT_GRILL_ANNOTATIONS],
			['bug-grill', BUG_ANNOTATIONS],
		] as const;

		for (const [name, annotations] of cases) {
			const { body } = splitGrillCapture(loadCapture(name, fixtures));
			const segments = segmentsWithAnnotations(body, annotations);
			const titles = segments
				.filter((segment) => segment.kind === 'annotation')
				.map((segment) => segment.title);
			expect(titles, name).toEqual(annotations.map((annotation) => annotation.title));

			const transcript = segments
				.filter((segment) => segment.kind === 'transcript')
				.map((segment) => segment.markdown)
				.join('\n\n');
			expect(transcript.startsWith('## Request'), name).toBe(true);
			expect(transcript, name).toContain(body.slice(0, 80));
		}
	});
});
