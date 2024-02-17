from mat3ra.standata.materials import materials_data


def test_get_material_data():
    """Assert correct information if found about a material."""
    material = materials_data["filesMapByName"]["C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[mp-1040425].json"]
    assert type(material) == dict
    assert material["name"] == "C, Graphene, HEX (P6/mmm) 2D (Monolayer), mp-1040425"
    assert material["isNonPeriodic"] is False
