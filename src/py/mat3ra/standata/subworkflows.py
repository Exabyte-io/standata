from typing import Dict

from .base import Standata, StandataData
from .data.subworkflows import subworkflows_data


class Subworkflows(Standata):
    data_dict: Dict = subworkflows_data
    data: StandataData = StandataData(data_dict)
