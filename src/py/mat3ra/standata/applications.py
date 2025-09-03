from typing import Dict

from .base import Standata, StandataData
from .data.applications import applications_data


class Applications(Standata):
    data_dict: Dict = applications_data
    data: StandataData = StandataData(data_dict)
