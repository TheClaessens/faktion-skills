/**
 * Homepage copy and routes. Presentation lives in `src/pages/index.astro`.
 * The visual design pass restyles that page; it should not need to re-author
 * these strings.
 */

export type HomeLink = {
	/** Site path without Astro `base`. */
	path: string;
	label: string;
	blurb: string;
};

export const identity = {
	eyebrow: 'Faktion · product managers',
	title: 'Ticket-writing skills for Faktion PMs',
	what: 'These skills sit in Claude and turn a request (a vague note, a bug, a voice dump) into a JIRA ticket that meets the house bar.',
	who: 'They are for Faktion product managers who write stories and bugs. If that is not your job, stop here.',
} as const;

export const command = {
	heading: 'The one thing you type',
	value: '/ask-faktion-pm',
	note: 'That is the only name you remember. Everything else runs on its own.',
} as const;

/** The four pages a first visit should reach without opening the docs nav. */
export const onward: readonly HomeLink[] = [
	{
		path: '/the-bar/',
		label: 'The bar',
		blurb:
			'The house ticket standard. The one page worth reading if you never install.',
	},
	{
		path: '/how-it-works/',
		label: 'How it works',
		blurb:
			'Front door, grill, draft, push. Shown as a captured session, not a reconstructed one.',
	},
	{
		path: '/what-it-wont-do/',
		label: "What it won't do",
		blurb: 'Nothing reaches JIRA until you approve it. Scope is never invented.',
	},
	{
		path: '/install/',
		label: 'Install',
		blurb: 'One path: Cowork, no terminal. Then type the name above.',
	},
];

/** Remaining docs routes. Skills are reached from How it works. */
export const secondaryLinks = {
	heading: 'Also here',
	links: [
		{
			path: '/smells/',
			label: 'Smells',
			blurb: 'Phrases that read as settled and are not.',
		},
		{
			path: '/reference/prior-art/',
			label: 'Prior art',
			blurb: 'What the tool reads from the board, and what it may not take.',
		},
		{
			path: '/reference/intake/',
			label: 'Intake',
			blurb: 'Turning a rambling or spoken brain-dump into requirements.',
		},
		{
			path: '/reference/jira/',
			label: 'JIRA mechanics',
			blurb: 'How a push works once you have approved the draft.',
		},
	] as const satisfies readonly HomeLink[],
};
