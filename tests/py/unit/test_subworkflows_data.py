from types import SimpleNamespace

from mat3ra.standata.data.subworkflows import subworkflows_data
from mat3ra.standata.subworkflows import SubworkflowStandata

APP = SimpleNamespace(ESPRESSO="espresso")
SUBWORKFLOW = SimpleNamespace(
    SEARCH_NAME="pw_scf",
    FILENAME="espresso/pw_scf.json",
    EXACT_NAME="Preliminary SCF Calculation",
)


def test_get_by_name():
    subworkflow = SubworkflowStandata.get_by_name_first_match(SUBWORKFLOW.SEARCH_NAME)
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert SUBWORKFLOW.EXACT_NAME in subworkflow["name"]


def test_get_by_categories():
    subworkflows = SubworkflowStandata.get_by_categories(APP.ESPRESSO)
    assert isinstance(subworkflows, list)
    assert len(subworkflows) >= 1
    assert isinstance(subworkflows[0], dict)


def test_get_subworkflow_data():
    subworkflow = subworkflows_data["filesMapByName"][SUBWORKFLOW.FILENAME]
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert subworkflow["name"] == SUBWORKFLOW.EXACT_NAME


def test_get_by_name_and_categories():
    subworkflow = SubworkflowStandata.get_by_name_and_categories(SUBWORKFLOW.SEARCH_NAME, APP.ESPRESSO)
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert APP.ESPRESSO in str(subworkflow.get("application", {})).lower() or APP.ESPRESSO in str(subworkflow)


def test_get_as_list():
    subworkflows_list = SubworkflowStandata.get_as_list()
    assert isinstance(subworkflows_list, list)
    assert len(subworkflows_list) >= 1
    assert isinstance(subworkflows_list[0], dict)
    assert "name" in subworkflows_list[0]


def test_filter_by_application_and_get_by_name():
    subworkflow = SubworkflowStandata.filter_by_application(APP.ESPRESSO).get_by_name_first_match(
        SUBWORKFLOW.SEARCH_NAME)
    assert type(subworkflow) == dict
    assert "name" in subworkflow
    assert subworkflow["name"] == SUBWORKFLOW.EXACT_NAME
    assert APP.ESPRESSO in str(subworkflow.get("application", {})).lower()
