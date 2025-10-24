"""Tests for workflow standata."""
import pytest
from mat3ra.standata.core import WorkflowStandata


class TestWorkflowStandata:
    """Test WorkflowStandata class."""

    @pytest.fixture
    def workflow_standata(self):
        """Create a WorkflowStandata instance."""
        return WorkflowStandata()

    def test_find_by_application_espresso(self, workflow_standata):
        """Test finding Espresso workflows."""
        workflows = workflow_standata.find_by_application("espresso")
        assert len(workflows) > 0

        # Check all workflows are for espresso
        for workflow in workflows:
            assert workflow.get("application", {}).get("name") == "espresso"

    def test_find_by_application_vasp(self, workflow_standata):
        """Test finding VASP workflows."""
        workflows = workflow_standata.find_by_application("vasp")
        assert len(workflows) > 0

        # Check all workflows are for VASP
        for workflow in workflows:
            assert workflow.get("application", {}).get("name") == "vasp"
            assert "subworkflows" in workflow
            assert len(workflow["subworkflows"]) > 0

    def test_find_by_application_nwchem(self, workflow_standata):
        """Test finding NWChem workflows."""
        workflows = workflow_standata.find_by_application("nwchem")
        assert len(workflows) > 0

        # Check all workflows are for NWChem
        for workflow in workflows:
            assert workflow.get("application", {}).get("name") == "nwchem"

    def test_total_energy_workflows_exist(self, workflow_standata):
        """Test that total energy workflows exist for all applications."""
        applications = ["espresso", "vasp", "nwchem"]

        for app_name in applications:
            workflow = workflow_standata.find_by_application_and_name(app_name, "Total Energy")
            assert workflow is not None, f"Total Energy workflow not found for {app_name}"
            assert workflow.get("name") == "Total Energy"
            assert "total_energy" in workflow.get("properties", [])

    def test_workflow_structure_consistency(self, workflow_standata):
        """Test that all workflows have consistent structure."""
        applications = ["espresso", "vasp", "nwchem"]

        for app_name in applications:
            workflows = workflow_standata.find_by_application(app_name)

            for workflow in workflows:
                # Check required top-level fields
                assert "name" in workflow
                assert "application" in workflow
                assert workflow["application"]["name"] == app_name
                assert "subworkflows" in workflow
                assert isinstance(workflow["subworkflows"], list)
                assert len(workflow["subworkflows"]) > 0

                # Check each subworkflow
                for subworkflow in workflow["subworkflows"]:
                    assert "application" in subworkflow
                    assert subworkflow["application"]["name"] == app_name
                    assert "units" in subworkflow
                    assert isinstance(subworkflow["units"], list)

                    # Check execution units have application context
                    for unit in subworkflow["units"]:
                        if unit.get("type") == "execution":
                            assert "application" in unit, \
                                f"Unit {unit.get('name')} missing application in {workflow['name']}"
                            assert "name" in unit["application"]
                            assert "version" in unit["application"]

    def test_vasp_band_structure_workflow(self, workflow_standata):
        """Test VASP band structure workflow specifically."""
        workflow = workflow_standata.find_by_application_and_name("vasp", "Band Structure")

        assert workflow is not None
        assert workflow["name"] == "Band Structure"
        assert "band_structure" in workflow.get("properties", [])
        assert workflow["application"]["name"] == "vasp"

    def test_vasp_relaxation_workflow(self, workflow_standata):
        """Test VASP relaxation workflow."""
        workflow = workflow_standata.get_relaxation_workflow_by_application("vasp")

        assert workflow is not None
        assert workflow["name"] == "Variable-cell Relaxation"
        assert workflow["application"]["name"] == "vasp"

    def test_espresso_relaxation_workflow(self, workflow_standata):
        """Test Espresso relaxation workflow."""
        workflow = workflow_standata.get_relaxation_workflow_by_application("espresso")

        assert workflow is not None
        assert workflow["name"] == "Variable-cell Relaxation"
        assert workflow["application"]["name"] == "espresso"

    def test_default_workflow(self, workflow_standata):
        """Test getting default workflow."""
        default_workflow = workflow_standata.get_default()

        assert default_workflow is not None
        assert default_workflow.get("name") == "Total Energy"

    def test_application_context_at_all_levels(self, workflow_standata):
        """Test that application context exists at workflow, subworkflow, and unit levels."""
        applications = ["espresso", "vasp", "nwchem"]

        for app_name in applications:
            workflows = workflow_standata.find_by_application(app_name)

            for workflow in workflows:
                # Workflow level
                assert workflow.get("application", {}).get("name") == app_name

                # Subworkflow level
                for subworkflow in workflow.get("subworkflows", []):
                    assert subworkflow.get("application", {}).get("name") == app_name

                    # Unit level
                    for unit in subworkflow.get("units", []):
                        if unit.get("type") == "execution":
                            app = unit.get("application", {})
                            assert app.get("name") == app_name, \
                                f"Unit {unit.get('name')} in {workflow['name']} has wrong app"
                            assert app.get("version") is not None, \
                                f"Unit {unit.get('name')} missing version"

    def test_subworkflow_completeness(self, workflow_standata):
        """Test that subworkflows within workflows are complete."""
        applications = ["espresso", "vasp", "nwchem"]

        for app_name in applications:
            workflows = workflow_standata.find_by_application(app_name)

            for workflow in workflows:
                for subworkflow in workflow.get("subworkflows", []):
                    # Check required subworkflow fields
                    assert "_id" in subworkflow, \
                        f"Subworkflow {subworkflow.get('name')} missing _id"
                    assert "name" in subworkflow
                    assert "application" in subworkflow
                    assert "units" in subworkflow
                    assert "model" in subworkflow

                    # Verify model structure
                    model = subworkflow.get("model", {})
                    assert "type" in model
                    assert "subtype" in model
