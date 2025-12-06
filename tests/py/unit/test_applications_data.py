from mat3ra.standata.data.applications import applications_data
from mat3ra.standata.applications import ApplicationStandata


def test_get_by_name():
    application = ApplicationStandata.get_by_name_first_match("espresso")
    assert type(application) == dict
    assert application["name"] == "espresso"
    assert application["version"] == "6.3"


def test_get_by_categories():
    applications = ApplicationStandata.get_by_categories("quantum-mechanical")
    assert isinstance(applications, list)
    assert applications[0]["name"] == "espresso"


def test_get_application_data():
    application = applications_data["filesMapByName"]["espresso/espresso_gnu_6.3.json"]
    assert type(application) == dict
    assert application["name"] == "espresso"
    assert application["version"] == "6.3"


def test_get_by_name_and_categories():
    application = ApplicationStandata.get_by_name_and_categories("vasp", "quantum-mechanical")
    assert type(application) == dict
    assert application["name"] == "vasp"
    assert application["version"] == "5.4.4"


def test_list_all():
    applications = ApplicationStandata.list_all()
    assert isinstance(applications, dict)
    assert len(applications) >= 1
    assert "espresso" in applications
    assert isinstance(applications["espresso"], list)
    assert len(applications["espresso"]) >= 1
    assert isinstance(applications["espresso"][0], dict)
    assert "version" in applications["espresso"][0]
    assert "build" in applications["espresso"][0]
    assert applications["espresso"][0]["version"] == "6.3"
    assert applications["espresso"][0]["build"] == "GNU"

def test_get_as_list():
    applications_list = ApplicationStandata.get_as_list()
    assert isinstance(applications_list, list)
    assert len(applications_list) >= 1
    assert isinstance(applications_list[0], dict)
    assert applications_list[0]["name"] == "espresso"

