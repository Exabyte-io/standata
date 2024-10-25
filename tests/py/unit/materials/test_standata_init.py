from mat3ra.standata.materials import Materials


def test_standata_materials_init():
    """Materials class is initialized with data based on materials_data"""
    std_materials = Materials()
    assert std_materials.data.standataConfig.entities is not None
    assert len(std_materials.data.standataConfig.entities) >= 1
    assert isinstance(std_materials.data.filesMapByName.dictionary, dict)
    assert len(std_materials.data.filesMapByName.dictionary) >= 1


def test_categories_data():
    """Category map has at least one group of tags."""
    std_materials = Materials()
    assert std_materials.data.standataConfig.categories is not None
    assert len(std_materials.data.standataConfig.categories) >= 1
