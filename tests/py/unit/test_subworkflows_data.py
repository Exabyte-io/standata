from mat3ra.standata.data.subworkflows import subworkflows_data
from mat3ra.standata.subworkflows import SubworkflowStandata


def test_get_by_name():
    subworkflow = SubworkflowStandata.get_by_name_first_match("pw_scf")
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert "Preliminary SCF Calculation" in subworkflow["name"]


def test_get_by_categories():
    subworkflows = SubworkflowStandata.get_by_categories("espresso")
    assert isinstance(subworkflows, list)
    assert len(subworkflows) >= 1
    assert isinstance(subworkflows[0], dict)


def test_get_subworkflow_data():
    subworkflow = subworkflows_data["filesMapByName"]["espresso/pw_scf.json"]
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert subworkflow["name"] == "Preliminary SCF Calculation"


def test_get_by_name_and_categories():
    subworkflow = SubworkflowStandata.get_by_name_and_categories("pw_scf", "espresso")
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert "espresso" in str(subworkflow.get("application", {})).lower() or "espresso" in str(subworkflow)


def test_get_as_list():
    subworkflows_list = SubworkflowStandata.get_as_list()
    assert isinstance(subworkflows_list, list)
    assert len(subworkflows_list) >= 1
    assert isinstance(subworkflows_list[0], dict)
    assert "name" in subworkflows_list[0]


def test_filter_by_application_and_get_by_name():
    subworkflow = SubworkflowStandata.filter_by_application("espresso").get_by_name_first_match("pw_scf")
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert subworkflow["name"] == "Preliminary SCF Calculation"
    assert "espresso" in str(subworkflow.get("application", {})).lower()

