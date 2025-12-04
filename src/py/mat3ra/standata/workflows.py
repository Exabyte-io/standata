from typing import Dict, Type

from .base import Standata, StandataData
from .data.workflows import workflows_data


class WorkflowStandata(Standata):
    data_dict: Dict = workflows_data
    data: StandataData = StandataData(data_dict)

    @classmethod
    def filter_by_application(cls, application: str) -> Type["Standata"]:
        return cls.filter_by_tags(application)
