from pathlib import Path

import pytest

# from mat3ra.standata.build.builder import StandataBuilder


@pytest.fixture
def materials_config_path() -> Path:
    return Path("materials/categories.yml")


# @pytest.fixture(scope="module")
# def materials_standata() -> StandataBuilder:
#     return StandataBuilder.build_from_file("materials/categories.yml")
