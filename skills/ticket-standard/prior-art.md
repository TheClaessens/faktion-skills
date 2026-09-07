# Prior art

What is already on the board that bears on the ticket being written. Read when drafting or grilling a ticket for a project with existing tickets.

Prior art is **context**, always. It is **never scope**.

## The leak

Another ticket's body is full of requirements, acceptance criteria and DoD lines. Lifting one into the ticket you are writing produces invented scope with the best alibi there is: it is specific, it matches the project's voice, and it came from a real ticket. Nobody catches it in review, because it reads exactly like something the requester asked for.

**Take from prior art:**

- **Vocabulary** - the project's canonical spellings and domain terms. If the board says "monster", the ticket says monster.
- **Keys** - what this follows from, blocks, or relates to, for the description's context paragraph.
- **Epic** - the parent this belongs under.
- **Conventions** - how titles and DoDs are shaped on this board in practice.
- **Duplicates and overlaps** - whether this ticket already exists.

**Never take from prior art:**

- Requirements, acceptance criteria, or DoD lines
- Behaviours the requester did not describe
- Edge cases another ticket happened to handle

A neighbouring ticket handling an edge case is not evidence that this one should. It is a **question for the requester**, and it belongs in the grill.

## Searching

Work cheapest-first and stop as soon as the branch is answered. The project key comes from the resolution ladder in [`jira.md`](jira.md); resolve it before the first search, not per query.

| Looking for | JQL |
|---|---|
| Overlap or duplicate | `project = SGS AND text ~ "export csv" ORDER BY updated DESC` |
| Recent work in the area | `project = SGS AND text ~ "export" AND created >= -90d` |
| A named epic's children | `project = SGS AND parent = SGS-78` |
| A key the requester mentioned | `getJiraIssue` on the key directly |

`text ~` covers summary, description and comments, so it is the right first reach. `ORDER BY updated DESC` puts live work above abandoned work.

**Search results are summaries; that is usually enough.** Fetch a full body with `getJiraIssue` only for the handful that actually bear on this ticket - a ticket the requester named, or a likely duplicate. Reading twenty full bodies to write one ticket is how the leak gets its material.

**JQL is eventually consistent.** A ticket pushed seconds ago may not appear in a search yet. When drafting a batch, track the keys you just created rather than searching for them.

## Reporting what you found

Findings go to the requester as **questions and citations**, never as silent additions to the draft.

- A likely duplicate: name it and ask before drafting. `SGS-78 looks like this - same thing, or different?`
- A related ticket: propose the reference. `Worth saying this follows from SGS-78?`
- A vocabulary mismatch: adopt the board's term and say you did.

In a grill, prior art is the strongest **source** a ➡️ line can have: a suggestion citing a real ticket is grounded, where the same suggestion from nowhere is a guess.
