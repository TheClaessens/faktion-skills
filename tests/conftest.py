import importlib.util
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
HOOK_PATH = REPO_ROOT / ".claude" / "hooks" / "changelog.py"
FIXTURES = Path(__file__).parent / "fixtures" / "changelog-hook"


def load_changelog_hook():
    spec = importlib.util.spec_from_file_location("changelog_hook", HOOK_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="session")
def changelog():
    return load_changelog_hook()


@pytest.fixture
def current_layout():
    return FIXTURES / "current-layout"


@pytest.fixture
def nested_layout():
    return FIXTURES / "nested-layout"
