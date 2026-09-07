---
name: review-ticket
description: Grade a JIRA ticket against the Faktion bar before a developer picks it up, and report what is missing, invented, or unclear.
---

# Review a ticket

Grade a ticket someone already wrote. This skill reports; it does not rewrite. Fixing is [`write-ticket`](../write-ticket/SKILL.md), and only after the requester has seen the findings.

Read [`ticket-standard`](../ticket-standard/SKILL.md) first. **Every rule in it gets applied to the ticket** - the review is exhaustive, not a sample of what caught your eye.

## Get the ticket

From a key, a URL, or pasted text. When it is a key or URL, fetch the full body **and its comments** (`getJiraIssue`) - a requirement that only exists in a comment is a finding, not a fix.

## Grade it

Work the bar top to bottom. For each rule: does this ticket meet it?

Three kinds of finding, in descending severity:

1. **Invented scope** - a requirement on the ticket that nobody appears to have asked for. The most expensive defect and the hardest to see, because invented content reads exactly like real content. Signals: an edge case, an error-handling paragraph, a sync indicator, or a sub-feature with no trace in the description's context or the comments.

   **Search the board for the suspicious lines** ([`prior-art.md`](../ticket-standard/prior-art.md)). A requirement that appears near-verbatim on a neighbouring ticket is the leak, not a coincidence - and finding its origin turns a hunch into a citable finding.
2. **Missing scope** - a developer cannot start without asking a question. Name the question.

   Run [`smells.md`](../ticket-standard/smells.md) over the ticket. **A ticket is functionally vague when a developer could build the wrong thing and still honestly say they followed it** - and an unresolved smell is that finding, already phrased. "Delete a session" without soft-or-hard has the gap whether or not anyone noticed it.

   Report these as gaps, not as suggestions. The developer who builds the wrong thing will have followed the ticket exactly.
3. **Bar violations** - title convention, DoD introducing new requirements, technical detail the requester never raised, the anti-patterns list.

## Report

Findings first, ordered by severity, each naming the rule it breaks and quoting the line. Then one line on whether the ticket is startable as it stands.

Do not soften a finding into a suggestion. **"A developer cannot start this without asking who the export is for" beats "consider clarifying the audience."**

A ticket with no findings gets said plainly, in one line. Manufacturing a finding to look thorough is its own failure.
