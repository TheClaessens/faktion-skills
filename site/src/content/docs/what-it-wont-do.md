---
title: What it won't do
description: Guarantees you can check — nothing is written to JIRA until you approve it, and the tool never invents scope.
---

These skills write to a live JIRA board. The fear that stops an install is not whether the tickets will be good. It is what they will quietly add.

These are guarantees, not intentions. Each one is a rule the agent follows, and each one links to the file that enforces it. If the file does not say it, it is not a guarantee.

## Nothing reaches the tracker without your approval

Nothing is written to JIRA until you explicitly approve it. The agent drafts in the conversation. You read the draft. A push happens only on confirmation — "push", "ship it", "good to go". No push happens because the agent inferred you were ready.

That covers every write: a new ticket, and an edit to one that already exists.

Check:

- [write-ticket](/faktion-skills/skills/write-ticket/) — the review step is never skipped; push is only on explicit confirmation
- [write-bug](/faktion-skills/skills/write-bug/) — the same draft, review, push loop
- [jira.md](/faktion-skills/reference/jira/) — what runs at push time, after you have approved

## Scope is never invented

The agent writes only what you described. A brief request gets a brief ticket. It does not pad with edge cases, error-handling paragraphs, conflict resolution, or sub-features nobody asked for.

When the request is thin, it has two moves: ask for the missing detail, or write it sparse, matching the detail you gave. Filling the gap is not a third move.

Check: [Never invent scope](/faktion-skills/the-bar/#never-invent-scope) in the ticket bar.

## Requirements are never lifted from neighbouring tickets

The board is read for **context**, never for **scope**.

Context is vocabulary, the keys this work follows from, the parent epic, how this board titles things, and whether the ticket already exists. Scope is what you asked for, and it comes from you.

A requirement, an acceptance line, or a Definition of Done item copied off an adjacent ticket is invented scope wearing the project's own voice. A neighbouring ticket that handles an edge case is a question for you, not a line on yours.

Check: [Prior art](/faktion-skills/reference/prior-art/#the-leak) — what may be taken, and what may not.

## Unanswered questions are parked and named

"I don't know" settles the question. It does not license a guess.

The gap is recorded as a **parked gap**: a named open question on the brief, then on the ticket a developer picks up. On a finished ticket it is visible — not a plausible requirement where the gap used to be. A ticket with a named gap starts the right conversation. A ticket where the gap was filled in starts nothing, because nobody can see it.

Check: [Parking a gap](/faktion-skills/skills/grill-ticket/) in grill-ticket.

## What is read from the board, and why

Say this to a colleague:

It searches the board so the ticket uses the project's words, cites what it follows from, sits under the right epic, matches how this board is shaped, and does not duplicate work that already exists.

A search returns titles, status, type, parent, and when it was updated — not neighbouring descriptions. A full ticket body is opened only when you named the key, when a duplicate looks likely, or to place this ticket under its epic, and at most three of those.

What it finds becomes a question or a citation. It is never a silent addition to the draft.

Check: [Prior art](/faktion-skills/reference/prior-art/#the-budget) — the take-list, the never-take list, and the search budget.
