"""After a commit, ask the agent to write the changelog entry that commit earned.

Fires on PostToolUse for `git commit`. Resolves which plugin changelog(s) the
commit should update from the committed paths and the repository layout:

- Single-plugin mode (no `plugins/*/.claude-plugin/plugin.json`): paths under
  `skills/`, root `.claude-plugin/plugin.json`, and `.mcp.json` target
  `CHANGELOG.md`. Marketplace, site, `.github/`, hook and other tooling
  target none.
- Multi-plugin mode (`plugins/` contains at least one plugin manifest): a path
  under `plugins/<name>/` targets `plugins/<name>/CHANGELOG.md`. Marketplace,
  site, and root tooling target none.

A commit that touches more than one plugin targets every touched plugin's
changelog, named together in one prompt. That is deliberate: each plugin's
readers should see the change.

Emits nothing — rather than failing — when no plugin changelog is owed
(marketplace, site, or tooling-only commits), and when the commit already
touches the changelog(s) that would be targeted (loop guard + release
exemption).

Tests: `python3 -m pytest`. Dev dependency: `requirements-dev.txt`.
"""
import json
import subprocess
import sys
from pathlib import Path

PROMPT = """\
A commit just landed and {changelog} has not been updated for it.

    {sha}  {subject}
    files: {files}

Decide whether a reader of this plugin would notice this change.

Housekeeping - formatting, refactors, comments, tooling, work-in-progress on \
something not yet usable - earns no entry. Say nothing and carry on; do not \
mention that you skipped it.

Otherwise write one entry under `## [Unreleased]` in {changelog}, in the \
right `### Added` / `### Changed` / `### Fixed` / `### Removed` section, \
creating that heading if it is missing. Then fold it into the commit it \
describes:

    git add {changelog_git_add} && git commit --amend --no-edit

Write the entry for a PM reading the release notes, not for a developer \
reading the diff. Say what changed about using the plugin - "the grill now \
pushes back when a ticket is functionally vague" - rather than restating the \
commit subject. When this change extends something already listed under \
[Unreleased], edit that entry instead of adding a second one.

Mark a breaking change - a renamed or removed skill, a changed invocation - \
with a leading **BREAKING**, since it decides the next release is a major.
"""


def resolve_changelog_targets(commit_paths: list[str], repo_root: str | Path) -> list[str]:
    root = Path(repo_root)
    if _is_multi_plugin(root):
        targets = _nested_plugin_targets(commit_paths, root)
    elif any(_is_single_plugin_path(path) for path in commit_paths):
        targets = ["CHANGELOG.md"]
    else:
        targets = []
    already = set(commit_paths)
    return [path for path in targets if path not in already]


def _is_multi_plugin(repo_root: Path) -> bool:
    plugins = repo_root / "plugins"
    if not plugins.is_dir():
        return False
    return any(plugins.glob("*/.claude-plugin/plugin.json"))


def _nested_plugin_targets(commit_paths: list[str], repo_root: Path) -> list[str]:
    names: list[str] = []
    seen: set[str] = set()
    for path in commit_paths:
        parts = Path(path).parts
        if len(parts) < 2 or parts[0] != "plugins":
            continue
        name = parts[1]
        if name in seen:
            continue
        plugin_json = repo_root / "plugins" / name / ".claude-plugin" / "plugin.json"
        if plugin_json.is_file():
            seen.add(name)
            names.append(name)
    return [f"plugins/{name}/CHANGELOG.md" for name in names]


def _is_single_plugin_path(path: str) -> bool:
    return path in {".claude-plugin/plugin.json", ".mcp.json"} or path.startswith("skills/")


def format_prompt(
    changelog_paths: list[str],
    *,
    sha: str,
    subject: str,
    files: str,
) -> str:
    named = " and ".join(changelog_paths)
    return PROMPT.format(
        changelog=named,
        changelog_git_add=" ".join(changelog_paths),
        sha=sha,
        subject=subject,
        files=files,
    )


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
    if not files:
        return 0

    repo_root = git("rev-parse", "--show-toplevel")
    targets = resolve_changelog_targets(files, repo_root)
    if not targets:
        return 0

    listed = ", ".join(files[:12]) + (
        f" (+{len(files) - 12} more)" if len(files) > 12 else ""
    )
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": format_prompt(
                        targets,
                        sha=git("rev-parse", "--short", "HEAD"),
                        subject=git("log", "-1", "--pretty=%s"),
                        files=listed,
                    ),
                }
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
