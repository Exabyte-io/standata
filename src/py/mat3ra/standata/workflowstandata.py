from typing import Dict

from .base import Standata, StandataData
from .data.workflows import workflows_data


class WorkflowStandata(Standata):
    data_dict: Dict = workflows_data
    data: StandataData = StandataData(data_dict)

    def filter_by_application(self, application: str) -> "Standata":
        return self.filter_by_tags(application)
