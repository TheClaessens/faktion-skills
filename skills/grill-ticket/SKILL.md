---
name: grill-ticket
description: Interview the requester until the scope of a ticket is settled, and produce the brief that drafting works from. Runs before every ticket.
---

# Grill a ticket

Interview the requester relentlessly until the scope is settled. **No drafting happens here** - this skill produces a brief, and [`write-ticket`](../write-ticket/SKILL.md) turns the brief into a ticket afterwards.

That separation is the point. Drafting while still interrogating makes the interrogation stop early: the draft is visible progress and the questions are not, so the agent reaches for the draft. Settle the scope first, with nothing else in front of you.

**Every ticket starts here.** There is no judgement call about whether a request is thin enough to warrant grilling - that call is made wrong in the direction of drafting, every time. What varies is how long the grill runs.

Read [`ticket-standard`](../ticket-standard/SKILL.md) - the scope rule governs this whole conversation, and it governs your questions as hard as it governs a ticket.

## The tree

Map the request as a **scope tree**. Six branches, each of which can grow sub-branches:

| Branch | The question behind it |
|---|---|
| **Persona** | Who hits this, and what were they doing beforehand? |
| **Trigger** | Where in the product, and what starts it? |
| **Behaviour** | What happens - the steps the user sees? |
| **Boundary** | What is deliberately *not* in this ticket? |
| **Done** | How would you know it works? |
| **Relations** | What does this follow from, and what waits on it? |

Relations is the branch you can often settle yourself - search the board rather than asking.

**Boundary is the branch that gets skipped and the one that pays.** A ticket that says what it excludes is the cheapest defence against a developer building the excluded thing.

## Where the questions come from

Branches give you the shape of the tree; **smells give you its depth.** Read [`smells.md`](../ticket-standard/smells.md) against what the requester actually said, and every smell that fires becomes a sub-branch on the tree.

A smell is a phrase that reads as settled and is not - "delete a transcription session" is two different features depending on an answer nobody gave. The test for raising one: two competent developers would build it differently, and the requester would care which shipped.

That test also bounds you. A fork **inside** what they asked for is yours to raise; a feature **adjacent** to it is not, and asking about it is how a grill talks a requester into a bigger ticket than they came for.

**Functional vagueness gets pushed on, not noted.** A ticket is functionally vague when a developer could build the wrong thing and still honestly say they followed it. Name what they would have to guess and ask for the answer - politely recording the ambiguity and drafting anyway is the failure this skill exists to prevent.

## When they already said everything

A request that answers all six branches gets a **short grill**: no questions, straight to the brief for confirmation. That is the whole cost of always-on - one nod on a request that was already complete.

Reaching the brief in one step is a normal outcome, not a skipped step. Manufacturing a round of questions to look thorough wastes the patience you need for the requests that genuinely need six.

## Rounds

Work the tree in **rounds**. The **frontier** is every branch whose prerequisites are already settled - the questions you can ask now without guessing at answers you have not heard. Ask the whole frontier in one round, then wait.

```
❓ **Q1** - **<question title>**: <question body, options where they help>

➡️ <sourced suggestion, or the options with no preference stated>

---

❓ **Q2** - **<question title>**: <question body>

➡️ <sourced suggestion, or the options with no preference stated>
```

Each round of answers reshapes the tree: settled branches push the frontier outward. A question whose answer depends on another question still open in this round belongs to a **later** round.

## The ➡️ line, and the trap in it

A suggestion the requester nods at becomes scope on the ticket - and it reads exactly like scope they asked for. That is invented scope with a conversational alibi, and it is harder to catch afterwards than the ordinary kind.

So every ➡️ is **sourced or absent**:

- **Sourced** - name where it came from. A related ticket ("SGS-78 does it this way"), something they said earlier in this conversation, an existing pattern in the product. Cite it in the line.
- **Absent** - when you have no basis, lay out the options and say you have none. "Could go either way, and I have nothing to base a preference on" is a useful answer. A confident guess dressed as a recommendation is not.

**Facts are your job; decisions are theirs.** Anything you could look up - what a related ticket says, what the product currently does - you look up rather than ask. Do not block the round on it: only the questions downstream of a running lookup wait.

**Search the board before the first round.** [`prior-art.md`](../ticket-standard/prior-art.md) has the searches and the rule on what may be taken from what you find. It pays twice here: it settles Relations and Vocabulary without spending a question, and a real ticket is the best source a ➡️ line can cite.

What it turns up becomes **questions, never answers**. A neighbouring ticket that handles an edge case tells you to ask whether this one should - it does not tell you that it does.

## Parking a gap

The requester will not know some answers. **"I don't know" settles a branch** - it does not reopen it, and it never licenses you to fill it in.

Record it as a **parked gap**, and it travels to the brief and onto the ticket as a named open question. A ticket with a visible gap starts the right conversation with the developer. A ticket where the gap was filled in starts nothing, because nobody can see it.

## Done

The grill ends when **every branch of the tree is either answered or parked** - nothing left silently assumed.

Then write the brief and put it to them:

```
## Brief: <working title>

**Persona / Trigger / Behaviour / Boundary / Done / Relations** - the settled answers.

**Parked:** the open questions, each one named.
```

Confirm the brief before anything is drafted. Once they approve it, hand to [`write-ticket`](../write-ticket/SKILL.md) - or [`write-bug`](../write-bug/SKILL.md), where the tree's Behaviour branch is expected-versus-actual and Trigger is the reproduction path.
