"""
This module contains the core Standata classes for accessing and searching
materials, applications, properties, workflows, and subworkflows.
"""

from .base import Standata
from .data.applications import applications_data
from .data.materials import materials_data
from .data.properties import properties_data
from .data.subworkflows import subworkflows_data
from .data.workflows import workflows_data


class MaterialStandata(Standata):
    """
    A class for accessing and searching material standata.
    """

    _runtime_data = materials_data


class ApplicationStandata(Standata):
    """
    A class for accessing and searching application standata.
    """

    _runtime_data = applications_data


class PropertyStandata(Standata):
    """
    A class for accessing and searching property standata.
    """

    _runtime_data = properties_data


class WorkflowStandata(Standata):
    """
    A class for accessing and searching workflow standata.
    """

    _runtime_data = workflows_data

    @classmethod
    def find_by_application(cls, app_name: str):
        """Find workflows by application name."""
        return cls.get_by_categories(app_name)

    @classmethod
    def find_by_application_and_name(cls, app_name: str, display_name: str):
        """Find workflow by application name and display name."""
        workflows = cls.find_by_application(app_name)
        return next((w for w in workflows if w.get("name") == display_name), None)

    @classmethod
    def get_relaxation_workflow_by_application(cls, app_name: str):
        """Get relaxation workflow for a specific application."""
        workflows = cls.get_by_categories("relaxation", app_name)
        return workflows[0] if workflows else None

    @classmethod
    def get_default(cls):
        """Get the default workflow."""
        defaults = cls.get_by_categories("default")
        return defaults[0] if defaults else None


class SubworkflowStandata(Standata):
    """
    A class for accessing and searching subworkflow standata.
    """

    _runtime_data = subworkflows_data

    @classmethod
    def find_by_application(cls, app_name: str):
        """Find subworkflows by application name."""
        return cls.get_by_categories(app_name)

    @classmethod
    def find_by_application_and_name(cls, app_name: str, display_name: str):
        """Find subworkflow by application name and display name."""
        subworkflows = cls.find_by_application(app_name)
        return next((sw for sw in subworkflows if sw.get("name") == display_name), None)

    @classmethod
    def get_relaxation_subworkflow_by_application(cls, app_name: str):
        """Get relaxation subworkflow for a specific application."""
        subworkflows = cls.get_by_categories("relaxation", app_name)
        return subworkflows[0] if subworkflows else None

    @classmethod
    def get_default(cls):
        """Get the default subworkflow."""
        defaults = cls.get_by_categories("default")
        return defaults[0] if defaults else None
