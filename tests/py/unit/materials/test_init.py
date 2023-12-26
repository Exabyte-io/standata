from pathlib import Path

from mat3ra.standata import Standata


def test_standata_init_path(materials_config_path: Path):
    """Constructor extracts categories and entities from config file."""
    std = Standata.from_file(materials_config_path)
    assert len(std.entities) >= 1
    assert len(std.categories) >= 1


def test_entities_data(materials_standata: Standata):
    """Entities have properties 'filename' and 'categories'."""
    assert all(["filename" in e and "categories" in e for e in materials_standata.entities])


def test_categories_data(materials_standata: Standata):
    """Category map has at least one group of tags."""
    assert len(materials_standata.category_map.keys()) >= 1
