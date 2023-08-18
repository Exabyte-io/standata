import pytest
from pathlib import Path
from standata import Standata


@pytest.fixture
def materials_config_path() -> Path:
    return Path("materials/categories.yml")


@pytest.fixture(scope="module")
def materials_standata() -> Standata:
    return Standata("materials/categories.yml")
