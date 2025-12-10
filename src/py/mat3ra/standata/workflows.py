from typing import Dict

from .base import StandataData
from .core import BaseWorkflowSubworkflowStandata
from .data.workflows import workflows_data


class WorkflowStandata(BaseWorkflowSubworkflowStandata):
    data_dict: Dict = workflows_data
    data: StandataData = StandataData(data_dict)


