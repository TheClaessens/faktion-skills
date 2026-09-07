---
name: ticket-standard
description: The Faktion ticket bar - title convention, description shape, Definition of Done, and the scope rules. Read before drafting, rewriting, grading, or test-planning a ticket.
---

# The Faktion ticket bar

The single source of truth for what a good ticket looks like here. The writing and grading skills read this file and do not restate it; change the bar here and they all change with it.

Sibling references, reached when the branch applies:

- [`intake.md`](intake.md) - turning a rambling or spoken brain-dump into requirements. Read when the input is conversational rather than a written spec.
- [`smells.md`](smells.md) - functional vagueness: the phrases that read as settled and are not, and how to challenge them. Read while grilling and while reviewing.
- [`prior-art.md`](prior-art.md) - what is already on the board: searching it, and the hard line on what may be taken from it. Read when the project has existing tickets.
- [`jira.md`](jira.md) - pushing to JIRA: connector tools, markdown format, epics and batches. Read at push time.

## Never invent scope

The rule that fails most often, and the one worth the most.

Write only what the requester actually described. A brief description gets a brief ticket. Do not pad with edge cases, error handling, conflict resolution, sync indicators, or sub-features nobody asked for.

When the input is thin, you have exactly two moves:

1. **Ask** for the missing detail.
2. **Write it sparse**, matching the level of detail you were given.

**A sparse ticket prompts the right conversation later; invented scope creates false assumptions.** The invented parts are indistinguishable from the real ones, which is what makes them expensive.

**This applies to other tickets as hard as it applies to your own invention** - see [`prior-art.md`](prior-art.md). A requirement lifted from a neighbouring ticket is invented scope wearing the project's own voice.

The line to hold is between **context** and **scope**. Background the requester gives you to explain themselves ("the reason we need this is...") helps you understand and does not go in the ticket verbatim - extract the requirement. What they are asking for is scope, and it comes from them and nowhere else.

## Functional, not technical

Describe **what** the user or system does, not **how** it is built. Think user actions, screens, and outcomes - not endpoints, payloads, or architecture.

Functional description carries its own failure mode: **functional vagueness**, where the ticket describes behaviour that a developer could implement wrongly while following it exactly. [`smells.md`](smells.md) catalogues the phrasings this hides behind.

One exception: a technical detail the requester raised themselves. They had a reason. "Wire the frontend to the existing backend at `/api/v1/exports/iara`" keeps the endpoint; "export to IARA" gets described functionally. Never add technical detail on your own.

## Title

Agile in nature: start from a persona, end at the problem being solved.

> As a {Persona} I want {scope} so that {problem}

Example: _As a User I want to be able to request a new password so that I can log in again after losing my password._

Keep this format when it fits. When the requester supplies a different title style, follow theirs.

<!-- OPEN DECISION: this convention is Story-shaped. Bugs and chores need their own,
     or write-bug forces a persona onto a defect. See skills/write-bug/SKILL.md. -->

## Description

Open with one or more **context paragraphs**: what the ticket covers, why it exists, how it connects to other work. Reference related tickets naturally - "This ticket follows from SGS-78."

Then the details. **Bold labels** for key concepts, bullets for lists of features, fields, or actions. A developer should finish the description able to start work without asking a question.

A **Disclaimer** section is optional, for conditional cases and caveats.

## Definition of Done

After a horizontal rule, a checklist that summarises the description above - a quick reference a developer checks their work against.

**The DoD mirrors the description; it never introduces a new requirement.** Skip the obvious ("user can save and return to the previous page") unless the requester asked for it.

## Writing style

- **Use the requester's own words.** They say "monster" instead of "sample", the ticket says monster. They mix Dutch and English, so does the ticket. Domain terms survive intact - and so do specific names they reached for: an API ("SM-A-rt"), a table ("the AIB table"), an existing implementation.
- **Reference related tickets by key** when this one builds on previous work.
- **Be explicit about what is deferred.** Something going to a follow-up ticket, a backend that already exists - say so.
- **Bold the important nouns on first mention** - field names, UI elements, API names, page names. Tickets get scanned, not read.
- **Handcrafted, not generated.** A clean description followed by a DoD checklist, in a human PM's voice.

## Anti-patterns

The tells that a ticket was generated rather than written:

- Excessive headers - Requirements, Technical Notes, Dependencies, Out of Scope
- Numbered acceptance criteria in place of a DoD checklist
- Label or priority metadata sitting in the description body
- Padding: an edge case, an error-handling paragraph, or a sub-feature the requester never mentioned
- A persona forced onto work that has no user (a dependency bump, a migration)
