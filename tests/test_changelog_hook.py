def test_commit_touching_one_plugin_targets_root_changelog(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        ["skills/grill-ticket/SKILL.md"],
        current_layout,
    ) == ["CHANGELOG.md"]


def test_marketplace_only_commit_targets_no_plugin_changelog(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        [".claude-plugin/marketplace.json"],
        current_layout,
    ) == []


def test_root_plugin_manifest_targets_root_changelog(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        [".claude-plugin/plugin.json"],
        current_layout,
    ) == ["CHANGELOG.md"]


def test_root_mcp_config_targets_root_changelog(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        [".mcp.json"],
        current_layout,
    ) == ["CHANGELOG.md"]


def test_site_only_commit_targets_no_plugin_changelog(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        ["site/src/content/index.md"],
        current_layout,
    ) == []


def test_hook_and_tooling_commit_targets_no_plugin_changelog(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        [".claude/hooks/changelog.py", "requirements-dev.txt", ".github/workflows/pages.yml"],
        current_layout,
    ) == []


def test_commit_that_already_touches_changelog_targets_none(changelog, current_layout):
    assert changelog.resolve_changelog_targets(
        ["skills/grill-ticket/SKILL.md", "CHANGELOG.md"],
        current_layout,
    ) == []


def test_nested_plugin_commit_targets_that_plugin_changelog(changelog, nested_layout):
    assert changelog.resolve_changelog_targets(
        ["plugins/faktion-pm-skills/skills/grill-ticket/SKILL.md"],
        nested_layout,
    ) == ["plugins/faktion-pm-skills/CHANGELOG.md"]


def test_nested_marketplace_or_site_commit_targets_no_plugin_changelog(
    changelog, nested_layout
):
    assert changelog.resolve_changelog_targets(
        [".claude-plugin/marketplace.json", "site/index.md"],
        nested_layout,
    ) == []


def test_nested_commit_that_already_touches_changelog_targets_none(
    changelog, nested_layout
):
    assert changelog.resolve_changelog_targets(
        [
            "plugins/faktion-pm-skills/skills/grill-ticket/SKILL.md",
            "plugins/faktion-pm-skills/CHANGELOG.md",
        ],
        nested_layout,
    ) == []


def test_commit_touching_two_plugins_targets_both_changelogs(changelog, nested_layout):
    assert changelog.resolve_changelog_targets(
        [
            "plugins/faktion-pm-skills/skills/grill-ticket/SKILL.md",
            "plugins/faktion-dev-skills/skills/lint/SKILL.md",
        ],
        nested_layout,
    ) == [
        "plugins/faktion-pm-skills/CHANGELOG.md",
        "plugins/faktion-dev-skills/CHANGELOG.md",
    ]


def test_multi_plugin_commit_skips_changelog_already_in_the_commit(
    changelog, nested_layout
):
    assert changelog.resolve_changelog_targets(
        [
            "plugins/faktion-pm-skills/skills/grill-ticket/SKILL.md",
            "plugins/faktion-pm-skills/CHANGELOG.md",
            "plugins/faktion-dev-skills/skills/lint/SKILL.md",
        ],
        nested_layout,
    ) == ["plugins/faktion-dev-skills/CHANGELOG.md"]


def test_prompt_names_the_resolved_changelog_path(changelog):
    prompt = changelog.format_prompt(
        ["plugins/faktion-pm-skills/CHANGELOG.md"],
        sha="abc1234",
        subject="feat: grill",
        files="plugins/faktion-pm-skills/skills/grill-ticket/SKILL.md",
    )
    assert "plugins/faktion-pm-skills/CHANGELOG.md" in prompt
    assert "git add plugins/faktion-pm-skills/CHANGELOG.md" in prompt


def test_prompt_names_every_touched_plugin_changelog(changelog):
    prompt = changelog.format_prompt(
        [
            "plugins/faktion-pm-skills/CHANGELOG.md",
            "plugins/faktion-dev-skills/CHANGELOG.md",
        ],
        sha="abc1234",
        subject="feat: two plugins",
        files="plugins/faktion-pm-skills/skills/grill-ticket/SKILL.md, plugins/faktion-dev-skills/skills/lint/SKILL.md",
    )
    assert "plugins/faktion-pm-skills/CHANGELOG.md" in prompt
    assert "plugins/faktion-dev-skills/CHANGELOG.md" in prompt
    assert (
        "git add plugins/faktion-pm-skills/CHANGELOG.md "
        "plugins/faktion-dev-skills/CHANGELOG.md" in prompt
    )
