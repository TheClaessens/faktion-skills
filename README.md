# Faktion PM skills

Ticket-writing skills for Faktion PMs. Write stories and bugs, grade tickets against the house bar, derive test plans - pushed straight to JIRA.

## Install

You need Claude Code and a connected Atlassian account.

```bash
# 1. Claude Code
npm install -g @anthropic-ai/claude-code

# 2. This plugin
claude
/plugin marketplace add TheClaessens/faktion-skills
/plugin install faktion-pm-skills@faktion

# 3. Connect JIRA
/mcp
```

## Using it

Type **`/ask-thomas`** and say what you have. It works out what the ticket needs and does it.

It reads the board first - related tickets, the epic, whether this already exists, the words your project actually uses - so you are not re-explaining context it could look up. It takes vocabulary and references from existing tickets; it never takes requirements from them.

It pushes back when the functional scope is vague. "Create a way to delete a transcription session" gets you a question about soft versus hard delete, because a developer could build either one and honestly say they followed the ticket. Anything you cannot answer is parked on the ticket as an open question rather than guessed at.

Every ticket starts with a short interview - six things it needs to know before anything gets written. Say everything up front and that is one confirmation; leave gaps and it asks. Anything you genuinely do not know gets parked and written onto the ticket as an open question, never guessed at.

Everything else fires on its own - describe a feature and you get a draft, report something broken and you get a bug. You never need to remember a skill name.

Nothing reaches JIRA without you approving it first.

## What's in here

| Skill | Does |
|---|---|
| `ask-thomas` | Front door. Works out what a ticket needs next. |
| `grill-ticket` | Interviews you until the scope is settled. Runs before every ticket. |
| `write-ticket` | Idea, conversation, or voice note into a story. Batches, epics, follow-ups, rewrites. |
| `write-bug` | A defect into a bug ticket. |
| `review-ticket` | Grades a ticket before a developer picks it up. |
| `ticket-test-plan` | Turns a Definition of Done into checks. |
| `ticket-standard` | The bar itself. Read by all of the above. |

## Changing the bar

`skills/ticket-standard/SKILL.md` is the single source of truth for what a good Faktion ticket looks like. Every other skill points at it and none of them restate it, so a change there changes every skill at once. Edit that file, not the writers.

Two open decisions are marked `OPEN DECISION` in the source:

- **Bug title convention** - the original skill was Story-only, so `write-bug`'s shape is a proposal rather than tuned practice.
- **A type for work with no user** - a dependency bump or migration has no persona, and forcing one produces the anti-pattern the bar warns about.

## Changelog and commits

[`CHANGELOG.md`](CHANGELOG.md) is written by a `post-commit` hook, from the commit messages. To turn it on after cloning:

```bash
git config core.hooksPath .githooks
```

Commit subjects follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), and four types produce a changelog entry:

| Subject | Lands under |
|---|---|
| `feat(grill-ticket): ...` | Added |
| `fix(smells): ...` | Fixed |
| `change(bar): ...` | Changed |
| `remove(...): ...` | Removed |
| `feat!: ...` or a `BREAKING CHANGE:` body | Changed, marked **BREAKING** |

Anything else - `docs`, `chore`, `refactor`, a bare subject - commits normally and writes nothing. Reserve the four types for changes a PM would notice.

The hook appends the entry and amends it into the commit it describes, so the changelog is never a commit behind. It stands down during merges, rebases and cherry-picks, and does nothing to a commit that is already pushed. Write the release heading by hand at release time: move `## [Unreleased]` entries under a new version heading, and edit freely - the hook only ever appends, so a curated entry survives.
