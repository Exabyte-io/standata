from types import SimpleNamespace
from typing import Dict

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
        filtered_standata = cls.get_by_categories(application, TAGS.RELAXATION)
        return filtered_standata[0] if filtered_standata else {}
