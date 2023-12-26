from mat3ra.standata.materials import materials_data


def test_get_material_data():
    """Assert correct information if found about a material."""
    material = materials_data["filesMapByName"]["Graphene.json"]
    assert type(material) == dict
    assert material["name"] == "Graphene (mp-1040425)"
    assert material["isNonPeriodic"] is False
