from mat3ra.standata.data.workflows import workflows_data
from mat3ra.standata.workflowstandata import WorkflowStandata


def test_get_by_name():
    workflow = WorkflowStandata.get_by_name_first_match("band_gap")
    assert type(workflow) == dict
    assert "name" in workflow
    assert 'Band Gap + DoS - HSE' in workflow["name"]


def test_get_by_categories():
    workflows = WorkflowStandata.get_by_categories("espresso")
    assert isinstance(workflows, list)
    assert len(workflows) >= 1
    assert isinstance(workflows[0], dict)


def test_get_workflow_data():
    workflow = workflows_data["filesMapByName"]["espresso/band_gap.json"]
    assert type(workflow) == dict
    assert "name" in workflow
    assert workflow["name"] == "Band Gap"


def test_get_by_name_and_categories():
    workflow = WorkflowStandata.get_by_name_and_categories("band_gap", "espresso")
    assert type(workflow) == dict
    assert "name" in workflow
    assert "espresso" in str(workflow.get("application", {})).lower() or "espresso" in str(workflow)


def test_get_as_list():
    workflows_list = WorkflowStandata.get_as_list()
    assert isinstance(workflows_list, list)
    assert len(workflows_list) >= 1
    assert isinstance(workflows_list[0], dict)
    assert "name" in workflows_list[0]


def test_filter_by_application_and_get_by_name():
    workflow = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match("band_gap")
    assert type(workflow) == dict
    assert "name" in workflow
    assert workflow["name"] == 'Band Gap + DoS - HSE'
    assert "espresso" in str(workflow.get("application", {})).lower()
