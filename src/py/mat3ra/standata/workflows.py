from typing import Dict

from .base import Standata, StandataData
from .data.workflows import workflows_data


class WorkflowStandata(Standata):
    data_dict: Dict = workflows_data
    data: StandataData = StandataData(data_dict)

    @classmethod
    def filter_by_application(cls, application: str) -> "WorkflowStandata":
        return cls.filter_by_tags(application)

    @classmethod
    def filter_by_application_config(cls, application_config: Dict) -> "WorkflowStandata":
        application_name = application_config.get("name", "")
        return cls.filter_by_application(application_name)
