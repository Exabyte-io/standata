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


class SubworkflowStandata(Standata):
    """
    A class for accessing and searching subworkflow standata.
    """

    _runtime_data = subworkflows_data
