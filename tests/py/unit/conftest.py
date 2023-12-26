from pathlib import Path

import pytest
from mat3ra.standata import Standata


@pytest.fixture
def materials_config_path() -> Path:
    return Path("materials/categories.yml")


@pytest.fixture(scope="module")
def materials_standata() -> Standata:
    return Standata.from_file("materials/categories.yml")
