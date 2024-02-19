from mat3ra.standata.materials import materials_data


def test_get_material_data():
    """Assert correct information if found about a material."""
    material = materials_data["filesMapByName"]["C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-3993].json"]
    assert type(material) == dict
    assert material["name"] == "C, Graphene, HEX (P6/mmm) 2D (Monolayer), 2dm-3993"
    assert material["isNonPeriodic"] is False
