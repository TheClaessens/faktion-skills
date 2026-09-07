# Changelog

Kept in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) shape, versioned per [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entries under `## [Unreleased]` are written after each commit, prompted by the hook in `.claude/hooks/`. See [Releasing](README.md#releasing).

## [Unreleased]

### Changed

- **BREAKING** The front door is now `/ask-faktion-pm`, renamed from `/ask-thomas`.

## [1.0.0-rc.1] - 2026-09-07

First release candidate: the ticket framework as a plugin for Cowork and Claude Code.

### Added

- `ticket-standard` - the Faktion ticket bar as a single source of truth: title convention, description shape, Definition of Done, and the two scope rules (never invent scope; functional, not technical).
- `ticket-standard/intake.md` - reading a brain-dump without turning context into scope.
- `ticket-standard/smells.md` - a catalogue of functionally vague phrasings and how to challenge them, bounded by the inside-versus-adjacent test.
- `ticket-standard/prior-art.md` - reading the JIRA board for vocabulary, references and duplicates, and never for requirements.
- `ticket-standard/jira.md` - push mechanics over the Atlassian Rovo connector, including the project resolution ladder.
- `grill-ticket` - interviews the requester across the six-branch scope tree until scope is settled, and produces the brief that drafting works from.
- `write-ticket` - the draft, review and push loop, covering new tickets, batches, epics and fleshing out existing ones.
- `write-bug` - bug drafting, where scope is the reproduction path and expected-versus-actual.
- `review-ticket` - grades a ticket against the bar without rewriting it.
- `ticket-test-plan` - turns a Definition of Done into a test plan, and reports DoD lines that cannot become checks.
- `ask-thomas` - the front door, and the only skill name a PM has to remember.
- The JIRA connector ships with the plugin, so installing prompts you to sign in to Atlassian rather than leaving you to connect it afterwards.
- Title conventions covering every kind of work: technical work with no end user takes **Developer** as the persona, and bugs take no persona at all - they state what is broken.
