from mat3ra.standata import Standata


def test_find_entity_tag(materials_standata: Standata):
    """Find at least one material using correct tags."""
    materials = materials_standata.find_entities("insulator", "3D")
    assert len(materials) >= 1
    assert type(materials[0]) == dict


def test_find_entity_no_matching_tags(materials_standata: Standata):
    """Return empty list if tags are not matching."""
    materials = materials_standata.find_entities("nonexistent_1", "nonexistent_2")
    assert type(materials) == list
    assert len(materials) == 0


def test_find_entity_no_tags(materials_standata: Standata):
    """Return empty list if no tags are provided."""
    materials = materials_standata.find_entities()
    assert type(materials) == list
    assert len(materials) == 0
