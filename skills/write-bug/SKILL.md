---
name: write-bug
description: Turn a reported defect into a Faktion JIRA bug ticket and push it - reproduction path, expected versus actual, and the gap named where the reporter did not know.
---

# Write a bug

A defect report is not a feature request wearing different words, and the bar's Story shape does not fit it. Read [`ticket-standard`](../ticket-standard/SKILL.md) for the rules that do carry over - never invent scope, functional not technical, writing style, anti-patterns - then apply the differences below.

Same **draft, review, push** loop as [`write-ticket`](../write-ticket/SKILL.md), including its intake and push pointers - and the same entry rule: drafting works from a [`grill-ticket`](../grill-ticket/SKILL.md) brief, where Trigger is the reproduction path and Behaviour is expected-versus-actual.

## What changes for a bug

<!-- OPEN DECISION: jira-ticket-writer had no bug type. What follows is a proposal,
     not six months of tuning. Confirm or replace before rolling this out to PMs. -->

### Title

State the broken behaviour. **No persona.** Forcing "As a User I want..." onto a defect produces the canonical anti-pattern - it reads as a feature request for the bug.

> Export fails silently on CSV files over 10MB

### Description

- **What happens** - the actual behaviour, in the reporter's words.
- **What should happen** - the expected behaviour.
- **Reproduction** - the numbered path to get there. Include environment, account, or data specifics only where the reporter gave them.
- **Impact** - who is affected and how often, if the reporter knows.

### Definition of Done

The DoD for a bug is the reproduction path no longer reproducing, stated concretely. It mirrors the description; it does not prescribe a fix.

## Scope, for a bug

**Scope is the reproduction path and the gap between expected and actual.** So:

- An invented reproduction step is invented scope.
- **An invented root cause is worse than an invented requirement**, because it sends the developer somewhere specific and wrong. Unless the reporter diagnosed it, the ticket does not say why it breaks.

When the reporter cannot reproduce it reliably, say so on the ticket. "Intermittent, reporter saw it twice on Tuesday" is a fact; a clean-looking repro path you assembled is a fiction.
