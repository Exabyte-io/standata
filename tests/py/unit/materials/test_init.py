from pathlib import Path

from mat3ra.standata.build.builder import StandataBuilder

from mat3ra.standata.materials import Materials


def test_standata_init_path():
    """Constructor extracts categories and entities from config file."""
    std = Materials().data
    assert len(std.entities) >= 1
    assert len(std.categories) >= 1


def test_entities_data(materials_standata: StandataBuilder):
    """Entities have properties 'filename' and 'categories'."""
    assert all(["filename" in e and "categories" in e for e in materials_standata.entities])


def test_categories_data(materials_standata: StandataBuilder):
    """Category map has at least one group of tags."""
    assert len(materials_standata.category_map.keys()) >= 1
