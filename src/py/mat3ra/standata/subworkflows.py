from typing import Dict

from .base import Standata, StandataData
from .data.subworkflows import subworkflows_data


class SubworkflowStandata(Standata):
    data_dict: Dict = subworkflows_data
    data: StandataData = StandataData(data_dict)

    @classmethod
    def filter_by_application(cls, application: str) -> "SubworkflowStandata":
        return cls.filter_by_tags(application)

