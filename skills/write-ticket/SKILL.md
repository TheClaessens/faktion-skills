---
name: write-ticket
description: Turn a description, conversation, spec, or voice note into a Faktion JIRA story and push it. Handles single tickets, follow-ups, batches, and epics.
---

# Write a ticket

Turn what the requester said into a ticket a developer can pick up, and push it to JIRA.

Read [`ticket-standard`](../ticket-standard/SKILL.md) first - it is the bar this ticket is measured against, and it is not repeated here.

## The loop

**Draft, review, push.** The review step is never skipped: nothing reaches JIRA without the requester seeing it first.

This loop runs fast. The requester says "push", you push, they start the next ticket. Stay in flow with them.

### 1. Absorb

Take in everything they gave you, including what they said earlier in the conversation.

When the input is conversational or spoken rather than written, read [`intake.md`](../ticket-standard/intake.md).

**Drafting works from a brief.** [`grill-ticket`](../grill-ticket/SKILL.md) produces one; when there isn't one yet, run it before drafting. A request that already says everything makes that a single confirming round, so this is cheap on the easy tickets and load-bearing on the rest.

The brief **is** the scope: draft from its branches rather than re-deciding them, and carry its parked gaps onto the ticket as named open questions. Closing a parked gap at drafting time is invented scope - the requester already said they did not know.

### 2. Draft

Write the ticket to the bar - title convention, context paragraphs, Definition of Done - and present it in the conversation as a formatted preview.

Use the board's own vocabulary and cite the tickets this one follows from; [`prior-art.md`](../ticket-standard/prior-art.md) covers finding them, and the line on what may be taken from them.

Before showing it, check it against **Never invent scope**: every requirement in the draft traces to something the requester actually said. Anything that does not, cut or turn into a question.

### 3. Review

They approve, tweak, or add context. Apply and re-show. Iterate until they say it is good.

### 4. Push

Only on explicit confirmation - "push", "ship it", "good to go". Follow [`jira.md`](../ticket-standard/jira.md) and share the link.

## Batches, follow-ups and epics

A requester often describes a whole flow at once. Draft every ticket, present them together, and push them together once approved. Epic linking and follow-up references are in [`jira.md`](../ticket-standard/jira.md).

## Fleshing out an existing ticket

Same loop, with the current ticket fetched first (`searchJiraIssuesUsingJql` or the key they gave you) and its full body read before drafting.

Two rules specific to rewriting:

- **The existing body is context, not licence.** Scope still comes from the requester. Content already on the ticket stays unless they asked for it to change.
- **Show what changed**, not just the new version, so the requester can see what a push would overwrite.

Push with `editJiraIssue`.
