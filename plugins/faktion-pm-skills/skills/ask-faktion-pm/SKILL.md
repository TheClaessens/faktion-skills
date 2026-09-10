---
name: ask-faktion-pm
description: The front door - work out what a ticket needs next and do it.
disable-model-invocation: true
---

# Ask Faktion PM

The one name a PM has to remember. Work out what this ticket needs next, say so, and do it.

The other skills are model-invoked, so you can invoke them directly once you know which one applies.

## Work out where they are

Ask only what you cannot infer from what they have already given you.

| What they have | What they need | Skill |
|---|---|---|
| An idea, a conversation, a voice note | A grill, then a ticket | [`grill-ticket`](../grill-ticket/SKILL.md) |
| Something broken | A grill, then a bug | [`grill-ticket`](../grill-ticket/SKILL.md) |
| A ticket that exists but reads thin | A grade before a developer picks it up | [`review-ticket`](../review-ticket/SKILL.md) |
| A ticket that needs to change | A rewrite | [`write-ticket`](../write-ticket/SKILL.md), fleshing-out branch |
| A ticket about to be signed off | A test plan | [`ticket-test-plan`](../ticket-test-plan/SKILL.md) |
| A whole feature, not one ticket | A grill, then a batch drafted together | [`grill-ticket`](../grill-ticket/SKILL.md) |

**Anything that ends in a ticket starts at the grill.** It is short when they already said everything, so routing there is never the wrong call.

## When it is ambiguous

Ambiguity is what the grill is for - it goes in the tree as an open branch rather than being resolved by you. Route there and let the rounds settle it.

## When the answer is "nothing yet"

Sometimes the honest advice is that the ticket cannot be written, because the scope is not decided. Say that, name the decision that has to happen first, and offer to draft it sparse with the gap marked.

That is a better outcome than a complete-looking ticket built on a guess.
