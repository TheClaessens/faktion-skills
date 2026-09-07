"""After a commit, ask the agent to write the changelog entry that commit earned.

Fires on PostToolUse for `git commit`. Emits nothing when the commit already
touches CHANGELOG.md, which is both the loop guard (the amend lands the
changelog in HEAD) and the release-commit exemption.
"""
import json
import subprocess
import sys

PROMPT = """\
A commit just landed and CHANGELOG.md has not been updated for it.

    {sha}  {subject}
    files: {files}

Decide whether a reader of this plugin would notice this change.

Housekeeping - formatting, refactors, comments, tooling, work-in-progress on \
something not yet usable - earns no entry. Say nothing and carry on; do not \
mention that you skipped it.

Otherwise write one entry under `## [Unreleased]` in CHANGELOG.md, in the \
right `### Added` / `### Changed` / `### Fixed` / `### Removed` section, \
creating that heading if it is missing. Then fold it into the commit it \
describes:

    git add CHANGELOG.md && git commit --amend --no-edit

Write the entry for a PM reading the release notes, not for a developer \
reading the diff. Say what changed about using the plugin - "the grill now \
pushes back when a ticket is functionally vague" - rather than restating the \
commit subject. When this change extends something already listed under \
[Unreleased], edit that entry instead of adding a second one.

Mark a breaking change - a renamed or removed skill, a changed invocation - \
with a leading **BREAKING**, since it decides the next release is a major.
"""


def git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], capture_output=True, text=True
    ).stdout.strip()


def main() -> int:
    try:
        json.load(sys.stdin)
    except Exception:
        return 0

    if git("rev-parse", "--is-inside-work-tree") != "true":
        return 0

    files = git("show", "--name-only", "--pretty=format:", "HEAD").split()
    if not files or "CHANGELOG.md" in files:
        return 0

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": PROMPT.format(
                        sha=git("rev-parse", "--short", "HEAD"),
                        subject=git("log", "-1", "--pretty=%s"),
                        files=", ".join(files[:12])
                        + (f" (+{len(files) - 12} more)" if len(files) > 12 else ""),
                    ),
                }
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
