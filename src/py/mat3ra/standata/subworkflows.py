from typing import Dict

from .base import StandataData
from .core import BaseWorkflowSubworkflowStandata
from .data.subworkflows import subworkflows_data


class SubworkflowStandata(BaseWorkflowSubworkflowStandata):
    data_dict: Dict = subworkflows_data
    data: StandataData = StandataData(data_dict)
