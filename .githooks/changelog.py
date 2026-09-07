"""Append the HEAD commit to CHANGELOG.md under [Unreleased]. Called by post-commit."""
import re
import subprocess
import sys
from pathlib import Path

SECTIONS = {
    "feat": "Added",
    "fix": "Fixed",
    "change": "Changed",
    "remove": "Removed",
}
ORDER = ["Added", "Changed", "Fixed", "Removed"]
HEADER = re.compile(r"^(feat|fix|change|remove)(?:\(([^)]+)\))?(!)?:\s+(.+)$")


def main(root: str) -> int:
    subject = subprocess.run(
        ["git", "log", "-1", "--pretty=%s"], cwd=root, capture_output=True, text=True
    ).stdout.strip()
    body = subprocess.run(
        ["git", "log", "-1", "--pretty=%b"], cwd=root, capture_output=True, text=True
    ).stdout

    match = HEADER.match(subject)
    if not match:
        return 0

    kind, scope, bang, description = match.groups()
    breaking = bool(bang) or "BREAKING CHANGE:" in body
    section = "Changed" if breaking else SECTIONS[kind]

    entry = f"- {'**BREAKING** ' if breaking else ''}{description}"
    if scope:
        entry += f" (`{scope}`)"

    path = Path(root) / "CHANGELOG.md"
    lines = path.read_text().splitlines()

    try:
        start = next(i for i, l in enumerate(lines) if l.strip() == "## [Unreleased]")
    except StopIteration:
        return 0
    end = next(
        (i for i in range(start + 1, len(lines)) if lines[i].startswith("## ")), len(lines)
    )

    block = lines[start + 1 : end]
    if entry in block:
        return 0

    heading = f"### {section}"
    if heading in block:
        at = block.index(heading) + 1
        while at < len(block) and block[at].startswith("- "):
            at += 1
        block.insert(at, entry)
    else:
        later = [f"### {s}" for s in ORDER[ORDER.index(section) + 1 :]]
        at = next((i for i, l in enumerate(block) if l in later), len(block))
        while at > 0 and not block[at - 1].strip():
            at -= 1
        block[at:at] = ["", heading, "", entry]

    lines[start + 1 : end] = block
    path.write_text("\n".join(lines).rstrip() + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
