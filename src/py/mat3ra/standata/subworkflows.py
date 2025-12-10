from types import SimpleNamespace
from typing import Dict

from .applications import ApplicationStandata
from .base import Standata, StandataData
from .data.subworkflows import subworkflows_data

TAGS = SimpleNamespace(
    RELAXATION="variable-cell_relaxation",
    DEFAULT="default"
)


class SubworkflowStandata(Standata):
    data_dict: Dict = subworkflows_data
    data: StandataData = StandataData(data_dict)

    @classmethod
    def filter_by_application(cls, application: str) -> "SubworkflowStandata":
        return cls.filter_by_tags(application)

    @classmethod
    def get_relaxation_subworkflow_by_application(cls, application: str) -> Dict:
        found_subworkflow_data = cls.get_by_categories(application, TAGS.RELAXATION)
        if not found_subworkflow_data:
            return {}
        relaxation_data = found_subworkflow_data[0].copy()

        return relaxation_data
