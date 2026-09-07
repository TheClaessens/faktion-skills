# Ticket smells

A **smell** is a phrase that reads as settled and is not: ordinary PM language whose everyday meaning hides a fork. "Delete a transcription session" sounds complete, and two developers will build irreconcilably different things from it.

Every smell in this file is one shape of the same defect - the ticket is **functionally vague**. The bar already says a ticket is functional rather than technical; this file is about that functional description being clear enough to build from.

The definition worth holding: **a ticket is functionally vague when a developer could build the wrong thing and still honestly say they followed it.**

Read this while grilling, to find the questions worth asking, and while reviewing, to find the gaps a ticket left open.

## The test

A smell is worth raising when **two competent developers would implement the sentence differently, and the requester would care which one shipped.**

That test draws the line this catalogue lives on:

- **Inside** the request - a fork in what they asked for. Soft or hard delete. Raise it.
- **Adjacent** to the request - a feature next to what they asked for. An undo, a bulk version, a confirmation email. **Do not raise it.** Asking is how a grill talks a requester into a bigger ticket than they came for, and the ticket that results is invented scope they agreed to.

Surfacing a fork is the opposite of inventing scope: inventing is answering it silently, this is refusing to answer it at all.

## Challenge, do not note

Functional vagueness is the thing to **push back on**, not to record politely and draft around. Noting it reads as diligence and changes nothing: the ticket still ships vague, and the developer still guesses.

The requester is not being obstructed by this. They are the only person who can resolve it, they can usually do so in one sentence, and the alternative is finding out in review that the wrong thing got built.

So: name the vagueness, say concretely what a developer would have to guess, and ask for the answer.

> "Delete a transcription session" could mean the row is gone or it is recoverable for a while. A developer has to pick one, and picking wrong is not undoable. Which is it?

Push **once**, properly. What they cannot answer **parks** - onto the ticket as a named open question. A requester who genuinely does not know is never blocked; a requester who simply had not thought about it gets asked.

## The catalogue

| Smell | The fork it hides |
|---|---|
| **Delete, remove, clear, reset** | Soft or hard? Recoverable, and for how long? What happens to things that referenced it? |
| **Archive, publish, approve, activate** | What actually changes, who can do it, and is it reversible? |
| **Edit, update, change** | Does history survive? What happens when two people edit at once? |
| **Export, generate, sync, import** | Does the user wait, or is it backgrounded? What do they see meanwhile, and on failure? |
| **Show a list of** | Ordered how? Paginated? What shows when it is empty? |
| **Search, filter** | Across which fields? Exact or fuzzy? What does no-result look like? |
| **Notify, alert, remind** | Which channel? At what moment? Can it be turned off? |
| **Users can** | Which users? Everyone, or is this permission-gated? |
| **Large, recent, too many, slow** | The actual number. An unstated threshold is a decision the developer will make for you. |
| **Like X already does** | Which parts of X - the behaviour, the layout, the rules? |
| Anything that **displays data** | What does it look like before there is any data? |
| **UI described in words alone** - "bottom-right", "a list of cards", "a modal", "like the old one" | What it actually looks like. See below. |
| Anything crossing a **boundary** (network, third party, device) | What does the user see when it fails? |

The catalogue is a lens, not a checklist. **Fire a smell only when it is genuinely present and the answer would change the ticket.** Running all twelve past a request for a tooltip is how a grill burns the patience it needs for the tickets that deserve it.

## The special case: UI with no reference

The one smell whose answer is usually an artefact rather than a sentence. A ticket that describes an interface **in words alone** hands the developer a drawing exercise. "A floating action button in the bottom-right that expands to show the available actions" reads as precise and specifies almost nothing: the icon, the expanded shape, the spacing, what the actions look like, what it does on a narrow screen. The developer builds something, and the requester discovers in review that they meant something else.

Ask for the artefact rather than for a longer description:

> This is a UI change described in words. Do you have a mockup, a screenshot of the current screen, or even a photo of a sketch? It will save a round of "not quite that" later.

Any of these settles it, in descending order of usefulness: a design file or exported frame, a mockup image, a screenshot of the existing screen being changed, a hand sketch photographed on a phone, or a named existing screen in the product that this one should match.

**Share it in the conversation and it gets read** - an image is read directly, and what it shows feeds the draft. Ask the requester to attach it to the JIRA ticket too, so it reaches the developer and not only you.

If they have none, it parks like any other gap - written onto the ticket as *No visual reference supplied*, so the developer knows to ask before building rather than after.

## Resolving a smell

A fired smell is a sub-branch on the scope tree - it joins the round it belongs to and settles like any other branch.

**Check the board before asking** ([`prior-art.md`](prior-art.md)). How this project resolved the same smell before is the best answer a `➡️` line can carry:

> ❓ **Q1** - **Delete semantics**: "Delete a transcription session" reads either way - soft delete with a recovery window, or the row is gone.
>
> ➡️ SGS-78 soft-deletes recordings with a 30-day window; matching that would keep the two consistent.

An unresolved smell does not block the ticket. It **parks** - named on the ticket as an open question, exactly like any other gap the requester could not close.
