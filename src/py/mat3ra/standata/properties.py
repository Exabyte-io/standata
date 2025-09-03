from typing import Dict

from .base import Standata, StandataData
from .data.properties import properties_data


class Properties(Standata):
    data_dict: Dict = properties_data
    data: StandataData = StandataData(data_dict)
