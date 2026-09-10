# Faktion skills

**Using the PM skills?** Start on the [documentation site](https://faktionbe.github.io/faktion-skills/). What they do, how they work, and the ticket bar live there.

This repository is the marketplace. The rest of this file is how to install from it, and how to change it.

## Install

### Cowork (recommended for PMs)

No terminal, no install. In Claude, open **Customize → Plugins**:

1. **Add marketplace** → `faktionbe/faktion-skills`
2. Install **faktion-pm-skills** from the list
3. Sign in to Atlassian when prompted - the plugin brings the JIRA connector with it

**Update** on the marketplace pulls the latest version.

### Claude Code

```bash
npm install -g @anthropic-ai/claude-code
claude
/plugin marketplace add faktionbe/faktion-skills
/plugin install faktion-pm-skills@faktion
# the Atlassian connector installs with the plugin; sign in when prompted
```

## Changing the bar

`plugins/faktion-pm-skills/skills/ticket-standard/SKILL.md` is the single source of truth for what a good Faktion ticket looks like. Every other skill points at it and none of them restate it, so a change there changes every skill at once. The documentation site publishes that file; it is not a second copy. Edit that file, not the writers.

## Releasing

Each plugin carries its own version and its own changelog. The PM plugin's is [`plugins/faktion-pm-skills/CHANGELOG.md`](plugins/faktion-pm-skills/CHANGELOG.md). Entries are written by hand, by whoever made the change - but not remembered by hand. A `PostToolUse` hook in [`.claude/settings.json`](.claude/settings.json) fires after every `git commit`, works out which plugin the commit touched, and asks whether that plugin's changelog is owed an entry, then to amend it into that same commit. A commit that only touches marketplace or site files earns none. Housekeeping earns nothing. The test is whether a reader of that plugin would notice.

Entries are written for that reader: *"the grill now pushes back when a ticket is functionally vague"*, not *"feat(smells): add catalogue"*. A changelog that restates commit subjects is a `git log` with worse formatting.

A plugin's version lives in three places, and cutting a release means moving all three together **for that plugin**:

1. `version` in that plugin's `.claude-plugin/plugin.json` - for the PM plugin, [`plugins/faktion-pm-skills/.claude-plugin/plugin.json`](plugins/faktion-pm-skills/.claude-plugin/plugin.json)
2. The `## [Unreleased]` heading in that plugin's `CHANGELOG.md`, renamed to the new version with today's date, and a fresh empty `## [Unreleased]` above it
3. A git tag namespaced with the plugin name - `git tag -a faktion-pm-skills/v1.0.0 -m "..."` and `git push --tags`

Which number moves follows from what accumulated under that plugin's `[Unreleased]`: anything marked **BREAKING** makes it a major, an `### Added` entry makes it a minor, `### Fixed` alone makes it a patch.
